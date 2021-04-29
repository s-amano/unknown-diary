package domain

import (
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-reaction/adapter"
)

// ReactionDiary 更新用の日記内容を表現する構造体です
type ReactionDiary struct {
	ID              string // id
	PostAt          string // ポストされた日時
	Reaction        string // 日記の反応
	DiaryReactioner string
}

// NewReactionDiary - API Gateway のリクエスト情報から ReactionDiary オブジェクトを生成
func NewReactionDiary(request events.APIGatewayProxyRequest, author string) (*ReactionDiary, error) {
	var err error

	result := &ReactionDiary{}
	fmt.Println(result)
	return nil, err
}

// FetchOneDiaryFromDynamoDB - dynamoDBから特定の日記を取得する
func (rd *ReactionDiary) FetchOneDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository) (map[string]*dynamodb.AttributeValue, error) {
	var err error

	return nil, err
}
