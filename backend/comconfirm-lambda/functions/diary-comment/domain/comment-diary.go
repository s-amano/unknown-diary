package domain

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-comment/adapter"
)

// PostDiary 該当の日記を取得するための構造体です
type PostDiary struct {
	Body     string
	PostForm interface{}
}

// CommentDiary 更新用の日記内容を表現する構造体です
type CommentDiary struct {
	ID            string // id
	PostAt        string // ポストされた日時
	ThisCommenter string // 今回反応をした人
	ThisComment   string
	CommentArray  []string // 日記のコメント一覧
	Commenters    []string // 日記にコメントした人一覧
	Content       string   // 日記の内容
	CommenterFlag bool     // 日記にコメントしたかどうかのフラグ
}

// NewPostDiary - API Gateway のリクエスト情報から PostDiary オブジェクトを生成
func NewPostDiary(request events.APIGatewayProxyRequest, diaryCommenter string) (*PostDiary, error) {
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
func (cd *CommentDiary) FetchOneDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository, postDiary *PostDiary) error {
	var err error

	switch postForm := postDiary.PostForm.(type) {
	case map[string]interface{}:
		cd.ID = postForm["id"].(string)
		cd.PostAt = postForm["post_at"].(string)
		cd.ThisComment = postForm["comment"].(string)
		fmt.Printf("thiscomment : %v\n", cd.ThisComment)
	default:
		fmt.Printf("postDiary.PostFormの型にミスがあります : %T\n", postDiary.PostForm)
	}

	// キー条件の生成
	keyCond := expression.Key("id").Equal(expression.Value(cd.ID))

	fmt.Printf("ID: %v\n", cd.ID)

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

	commenters, ok := item["commenters"]
	if !ok {
		cd.CommentArray = []string{}
		cd.Commenters = []string{}
		fmt.Printf("既存コメントがない %+v\n", cd)
	} else {
		fmt.Printf("commentersSlice L %+v\n", commenters.L)
		for _, v := range commenters.L {
			cd.Commenters = append(cd.Commenters, *v.S)
		}
		comments, ok := item["comments"]
		if !ok {
			cd.CommentArray = []string{}
		} else {
			for _, v := range comments.L {
				cd.CommentArray = append(cd.CommentArray, *v.S)
			}
		}
	}

	return nil
}

// GetDynamoDBItemMap - updateするitemの特定をするためにプライマリーキー情報を生成します
func (cd *CommentDiary) GetDynamoDBItemMap() (map[string]*dynamodb.AttributeValue, error) {
	// DynamoDB に格納する item オブジェクトを生成
	item := map[string]*dynamodb.AttributeValue{
		"id": {
			S: aws.String(cd.ID),
		},
		"post_at": {
			N: aws.String(cd.PostAt),
		},
	}
	return item, nil
}

// UpdateDiaryComment 日記の反応をアップデートする
func (cd *CommentDiary) UpdateDiaryComment(item map[string]*dynamodb.AttributeValue, dc adapter.DynamoDBClientRepository) (CommentDiary, error) {
	var err error

	// コメントをすでにしていたらreject
	cd.CommenterFlag = false

	for _, v := range cd.Commenters {
		fmt.Printf("commenter for %v\n", v)
		fmt.Printf("this-commenter for %v\n", cd.ThisCommenter)
		if v == cd.ThisCommenter {
			cd.CommenterFlag = true
			continue
		}
	}

	if !cd.CommenterFlag {
		// コメント者に名前を追加する
		cd.Commenters = append(cd.Commenters, cd.ThisCommenter)
		cd.CommentArray = append(cd.CommentArray, cd.ThisComment)
		fmt.Printf("!cd.cmmenterflagのやつ : %+v\n", cd.CommentArray)
	}

	// 更新情報をitemとして生成
	updateItem := expression.UpdateBuilder{}.Set(expression.Name("comments"), expression.Value(cd.CommentArray)).Set(expression.Name("commenters"), expression.Value(cd.Commenters))

	expr, err := expression.NewBuilder().WithUpdate(updateItem).Build()
	if err != nil {
		return CommentDiary{}, err
	}

	res, err := dc.UpdateItem(item, &expr)
	if err != nil {
		return CommentDiary{}, err
	}
	responseitem := res.Attributes
	commentArray := []string{}

	for _, v := range responseitem["comments"].L {
		commentArray = append(commentArray, *v.S)
	}
	responseDiary := CommentDiary{
		ID:            cd.ID,
		PostAt:        cd.PostAt,
		CommentArray:  commentArray,
		CommenterFlag: cd.CommenterFlag,
	}

	fmt.Printf("updateItemのres : %+v\n", res.Attributes)

	return responseDiary, nil
}
