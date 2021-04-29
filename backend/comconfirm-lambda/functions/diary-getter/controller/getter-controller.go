package controller

import (
	"context"

	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-getter/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-getter/usecase"
)

// GetterController は コントローラーを表現する構造体です
type GetterController struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryGetter        string
}

// Run - usecase 上の GetterJob 経由で処理する
func (c *GetterController) Run(ctx context.Context) (usecase.ResultDiary, error) {
	gj := usecase.GetterJob{
		DynamoDBClientRepo: c.DynamoDBClientRepo,
		DiaryGetter:        c.DiaryGetter,
	}

	item, err := gj.Run(ctx)
	if err != nil {
		return item, err
	}
	return item, nil
}
