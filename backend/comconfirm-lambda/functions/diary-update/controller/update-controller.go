package controller

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-update/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-update/usecase"
)

// UpdateController は コントローラーを表現する構造体です
type UpdateController struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryGetter        string
	DiaryID            string
}

// Run - usecase 上の UpdateJob 経由でメッセージを処理する
func (c *UpdateController) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) (usecase.ResultDiary, error) {
	srj := usecase.UpdateJob{
		DynamoDBClientRepo: c.DynamoDBClientRepo,
		DiaryGetter:        c.DiaryGetter,
		DiaryID:            c.DiaryID,
	}

	resposeDiary, err := srj.Run(ctx, apiGWEvent, result)
	if err != nil {
		return resposeDiary, err
	}
	return resposeDiary, nil
}
