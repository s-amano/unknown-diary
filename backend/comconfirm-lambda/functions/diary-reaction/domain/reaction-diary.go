package domain

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-reaction/adapter"

	"strconv"
)

// PostDiary 該当の日記を取得するための構造体です
type PostDiary struct {
	Body     string
	PostForm interface{}
}

// ReactionDiary 更新用の日記内容を表現する構造体です
type ReactionDiary struct {
	ID             string   // id
	PostAt         string   // ポストされた日時
	ThisReactioner string   // 今回反応をした人
	Reaction       string   // 日記の反応
	Reactioners    []string // 日記に反応した人一覧
	Content        string   // 日記の内容
	ReacionerFlag  bool     // 日記に反応したかどうかのフラグ
}

// NewPostDiary - API Gateway のリクエスト情報から PostDiary オブジェクトを生成
func NewPostDiary(request events.APIGatewayProxyRequest, diaryReactioner string) (*PostDiary, error) {
	var err error

	result := &PostDiary{}

	result.Body = request.Body

	fmt.Printf("request.Body: %+v\n", request.Body)

	// BODY 文字列をパースし PostForm に変換
	if err = json.Unmarshal([]byte(result.Body), &result.PostForm); err != nil {
		return nil, err
	}
	fmt.Printf("postForm: %+v\n", result.PostForm)

	return result, nil
}

// FetchOneDiaryFromDynamoDB - dynamoDBから特定の日記を取得する
func (rd *ReactionDiary) FetchOneDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository, postDiary *PostDiary) error {
	var err error

	switch postForm := postDiary.PostForm.(type) {
	case map[string]interface{}:
		rd.ID = postForm["id"].(string)
		rd.PostAt = postForm["post_at"].(string)
	default:
		fmt.Printf("postDiary.PostFormの型にミスがあります : %T\n", postDiary.PostForm)
	}

	// キー条件の生成
	keyCond := expression.Key("id").Equal(expression.Value(rd.ID))

	fmt.Printf("ID: %v\n", rd.ID)

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

	reactioners, ok := item["reactioners"]
	if !ok {
		rd.Reaction = "0"
		rd.Reactioners = []string{}
		fmt.Printf("既存リアクションがない")
	} else {
		fmt.Printf("reactionersSlice L %+v\n", reactioners.L)
		for _, v := range reactioners.L {
			rd.Reactioners = append(rd.Reactioners, *v.S)
		}
		rd.Reaction = *item["reaction"].S
	}

	return nil
}

// GetDynamoDBItemMap - updateするitemの特定をするためにプライマリーキー情報を生成します
func (rd *ReactionDiary) GetDynamoDBItemMap() (map[string]*dynamodb.AttributeValue, error) {
	// DynamoDB に格納する item オブジェクトを生成
	item := map[string]*dynamodb.AttributeValue{
		"id": {
			S: aws.String(rd.ID),
		},
		"post_at": {
			N: aws.String(rd.PostAt),
		},
	}
	return item, nil
}

// UpdateDiaryReaction 日記の反応をアップデートする
func (rd *ReactionDiary) UpdateDiaryReaction(item map[string]*dynamodb.AttributeValue, dc adapter.DynamoDBClientRepository) (ReactionDiary, error) {
	var err error

	// 反応をすでにリアクションしたかどうかで判定し、+1/-1する
	IntReaction, err := strconv.Atoi(rd.Reaction)
	if err != nil {
		return ReactionDiary{}, err
	}
	rd.ReacionerFlag = false

	// fmt.Printf("rectioners forの前のやつ %v\n", rd.Reactioners)
	for i, v := range rd.Reactioners {
		// fmt.Printf("rectioner for %v\n", v)
		if v == rd.ThisReactioner {
			IntReaction--
			rd.Reactioners = append(rd.Reactioners[:i], rd.Reactioners[i+1:]...)
			rd.ReacionerFlag = true
			continue
		}
	}

	if !rd.ReacionerFlag {
		IntReaction++
		// 反応者に名前を追加する
		rd.Reactioners = append(rd.Reactioners, rd.ThisReactioner)
	}

	rd.Reaction = strconv.Itoa(IntReaction)

	// 更新情報をitemとして生成
	updateItem := expression.UpdateBuilder{}.Set(expression.Name("reaction"), expression.Value(rd.Reaction)).Set(expression.Name("reactioners"), expression.Value(rd.Reactioners))

	expr, err := expression.NewBuilder().WithUpdate(updateItem).Build()
	if err != nil {
		return ReactionDiary{}, err
	}

	res, err := dc.UpdateItem(item, &expr)
	if err != nil {
		return ReactionDiary{}, err
	}
	responseitem := res.Attributes
	responseDiary := ReactionDiary{
		ID:       rd.ID,
		PostAt:   rd.PostAt,
		Reaction: *responseitem["reaction"].S,
	}

	fmt.Printf("updateItemのres : %+v\n", res.Attributes)

	return responseDiary, nil
}
