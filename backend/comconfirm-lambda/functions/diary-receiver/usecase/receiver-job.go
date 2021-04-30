package usecase

import (
	"bytes"
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-receiver/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-receiver/domain"
)

// ReceiverJob は、受け取ったポストデータをを処理するジョブを表すレポジトリです
type ReceiverJob struct {
	DynamoDBRepo adapter.DynamoDBClientRepository
	Author       string
}

// Run メソッドは、受け取ったポストデータを実際に処理します
func (c *ReceiverJob) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) error {
	var err error

	// apiGWEvent のヘッダ、queryString から Post 構造体を生成
	post, err := domain.NewPost(apiGWEvent, c.Author)
	if err != nil {
		return err
	}

	_, err = c.StorePost(ctx, post, result)
	if err != nil {
		return err
	}

	// 正常に処理されたときのレスポンスを設定
	result.StatusCode = 200 // OK
	result.Body = c.renderResponse(result.StatusCode, nil)

	return nil
}

func (c *ReceiverJob) renderResponse(statusCode int, message interface{}) string {
	buffer := new(bytes.Buffer)

	fmt.Printf("%s\n", buffer.String())
	return buffer.String()
}

// StorePost - POST されたデータを DynamoDB に書き込む
func (c *ReceiverJob) StorePost(ctx context.Context, Post *domain.Post, result *events.APIGatewayProxyResponse) (*dynamodb.PutItemOutput, error) {
	// DynamoDB へのアイテム書き込み
	item := Post.GetDynamoDBItemMap()

	r, err := c.DynamoDBRepo.PutItem(item)
	if err != nil {
		result.StatusCode = 500 // Internal Server Error
		result.Body = c.renderResponse(result.StatusCode, struct {
			ErrorMessage string
		}{
			ErrorMessage: err.Error(),
		})
		return nil, err
	}
	return r, nil
}
