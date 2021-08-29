package usecase

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-my-getter/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-my-getter/domain"
)

// GetterJob は、受け取ったポストデータをを処理するジョブを表すレポジトリです
type GetterJob struct {
	DynamoDBClientRepo     adapter.DynamoDBClientRepository
	DiaryGetter            string
	DiaryLimit             string
	DiaryExclusiveStartKey string

	diaries *domain.GetDiaries
}

// ResultDiaries はAPIのresponse内に格納する日記達を格納する構造体です
type ResultDiaries struct {
	Diaries []domain.Diary
}

func (gj *GetterJob) featchDiaries(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest) ([]domain.Diary, error) {

	// GetDiaries を初期化
	gj.diaries = &domain.GetDiaries{
		DiariesGetter: gj.DiaryGetter,
	}

	// apiGWEvent のヘッダ、queryString から item を生成
	item, err := domain.SetPaginationData(apiGWEvent, gj.DynamoDBClientRepo)
	if err != nil {
		return []domain.Diary{}, err
	}

	// DynamoDB からデータ取得
	res, err := gj.diaries.FetchMyDiaryFromDynamoDB(gj.DynamoDBClientRepo, item)
	if err != nil {
		fmt.Printf("fetch: %v \n", err)
	}

	// DynamoDB データを Diaries に登録
	diaries, err := gj.diaries.AddDiaries(res)
	if err != nil {
		return diaries, err
	}
	return diaries, nil

}

// Run は実際の処理を行うメソッドです
func (gj *GetterJob) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest) (ResultDiaries, error) {
	var err error

	resultDiaries := ResultDiaries{}

	getItems, err := gj.featchDiaries(ctx, apiGWEvent)
	if err != nil {
		fmt.Printf("getItems: %v \n", err)
	}

	resultDiaries.Diaries = getItems

	return resultDiaries, nil

}
