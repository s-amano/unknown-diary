package controller

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-my-getter/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-my-getter/usecase"
)

// GetterController は コントローラーを表現する構造体です
type GetterController struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryGetter        string
}

// Run - usecase 上の GetterJob 経由で処理する
func (c *GetterController) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest) (usecase.ResultDiaries, error) {
	gj := usecase.GetterJob{
		DynamoDBClientRepo: c.DynamoDBClientRepo,
		DiaryGetter:        c.DiaryGetter,
	}

	items, err := gj.Run(ctx, apiGWEvent)
	if err != nil {
		return items, err
	}
	return items, nil
}
