package controller

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-receiver/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-receiver/usecase"
)

// ReceiverController は コントローラーを表現する構造体です
type ReceiverController struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
}

// Run - usecase 上の SurveyReceiverJob 経由でメッセージを処理する
func (c *ReceiverController) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) error {
	srj := usecase.ReceiverJob{
		DynamoDBRepo: c.DynamoDBClientRepo,
	}

	err := srj.Run(ctx, apiGWEvent, result)
	if err != nil {
		return err
	}
	return nil
}
