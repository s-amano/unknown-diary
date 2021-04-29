package controller

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-reaction/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-reaction/usecase"
)

// ReactionController は コントローラーを表現する構造体です
type ReactionController struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryReactioner    string
}

// Run - usecase 上の ReactionJob 経由でメッセージを処理する
func (c *ReactionController) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) error {
	srj := usecase.ReactionJob{
		DynamoDBClientRepo: c.DynamoDBClientRepo,
		DiaryReactioner:    c.DiaryReactioner,
	}

	err := srj.Run(ctx, apiGWEvent, result)
	if err != nil {
		return err
	}
	return nil
}
