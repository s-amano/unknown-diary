package domain

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-reaction/adapter"
)

// PostDiary 該当の日記を取得するための構造体です
type PostDiary struct {
	Diary       UpdateDiary
	DiaryGetter string
	DiaryID     string
	DiaryAuthor string

	Body string
}

// UpdateDiary 更新用の日記内容を表現する構造体です
type UpdateDiary struct {
	ID       string  `json:"id"`      // id
	PostAt   string  `json:"post_at"` // ポストされた日時
	Title    string  `json:"title"`   // 日記のタイトル
	Content  string  `json:"content"` // 日記の本文
	Date     *string `json:"date"`    // 日記の日付
	Reaction string  `json:"reaction"`
}

// NewPostDiary - API Gateway のリクエスト情報から PostDiary オブジェクトを生成
func NewPostDiary(request events.APIGatewayProxyRequest, diaryUpdater string) (*PostDiary, error) {
	var err error

	result := &PostDiary{}

	result.Body = request.Body

	fmt.Printf("request.Body: %+v\n", request.Body)

	// BODY 文字列をパースし PostForm に変換
	if err = json.Unmarshal([]byte(result.Body), &result.Diary); err != nil {
		return nil, err
	}
	fmt.Printf("postForm: %+v\n", result.Diary)

	return result, nil
}

// FetchOneDiaryFromDynamoDB - dynamoDBから特定の日記を取得する
func (pd *PostDiary) FetchOneDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository) error {
	var err error

	// キー条件の生成
	keyCond := expression.Key("id").Equal(expression.Value(pd.Diary.ID))

	fmt.Printf("ID: %v\n", pd.Diary.ID)

	// クエリ用 expression の生成
	expr, err := expression.NewBuilder().WithKeyCondition(keyCond).Build()
	if err != nil {
		fmt.Printf("exp create err %v\n", err)
		return err
	}

	res, err := dc.QueryByExpressionNoindex(&expr)
	if err != nil {
		return err
	}

	item := res.Items[0]

	pd.DiaryAuthor = *item["author"].S

	return nil
}

// GetDynamoDBItemMap - updateするitemの特定をするためにプライマリーキー情報を生成します
func (pd *PostDiary) GetDynamoDBItemMap() (map[string]*dynamodb.AttributeValue, error) {
	// DynamoDB に格納する item オブジェクトを生成
	item := map[string]*dynamodb.AttributeValue{
		"id": {
			S: aws.String(pd.Diary.ID),
		},
		"post_at": {
			N: aws.String(pd.Diary.PostAt),
		},
	}
	return item, nil
}

// UpdateDiary 日記の反応をアップデートする
func (pd *PostDiary) UpdateDiary(item map[string]*dynamodb.AttributeValue, dc adapter.DynamoDBClientRepository) (UpdateDiary, error) {
	var err error
	var responseDiary UpdateDiary

	// APIを叩いた人と更新先の日記の作者が同じである
	if pd.DiaryGetter != pd.DiaryAuthor {
		return UpdateDiary{}, err
	}

	// 更新情報をitemとして生成
	updateItem := expression.UpdateBuilder{}.Set(expression.Name("post_data"), expression.Value(pd.Body))

	expr, err := expression.NewBuilder().WithUpdate(updateItem).Build()
	if err != nil {
		return UpdateDiary{}, err
	}

	res, err := dc.UpdateItem(item, &expr)
	if err != nil {
		return UpdateDiary{}, err
	}
	responseitem := res.Attributes
	// BODY 文字列をパースし PostForm に変換
	if err = json.Unmarshal([]byte(*responseitem["post_data"].S), &responseDiary); err != nil {
		return UpdateDiary{}, err
	}
	fmt.Printf("resultDiary: %+v\n", responseDiary)

	fmt.Printf("updateItemのres : %+v\n", res.Attributes)

	return responseDiary, nil
}
