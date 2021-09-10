package controller

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-comment/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-comment/usecase"
)

// CommentController は コントローラーを表現する構造体です
type CommentController struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryCommenter     string
}

// Run - usecase 上の CommentJob 経由でメッセージを処理する
func (c *CommentController) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) (usecase.ResultDiary, error) {
	srj := usecase.CommentJob{
		DynamoDBClientRepo: c.DynamoDBClientRepo,
		DiaryCommenter:     c.DiaryCommenter,
	}

	resposeDiary, err := srj.Run(ctx, apiGWEvent, result)
	if err != nil {
		return resposeDiary, err
	}
	return resposeDiary, nil
}
