package usecase

import (
	"context"
	"fmt"

	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-getter/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-getter/domain"
)

// GetterJob は、受け取ったポストデータをを処理するジョブを表すレポジトリです
type GetterJob struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryGetter        string

	diary *domain.GetDiary
}

// ResultDiaryContent はAPIのresponse内に格納する日記の内容を格納する構造体です
type ResultDiaryContent struct {
	DiaryContent string `json:"diary_content"`
}

func (gj *GetterJob) featchDiary(ctx context.Context) (domain.Diary, error) {

	// GetDiary を初期化
	gj.diary = &domain.GetDiary{
		DiaryGetter: gj.DiaryGetter,
	}

	res, err := gj.diary.FetchRandomOneDiaryFromDynamoDB(gj.DynamoDBClientRepo)
	if err != nil {
		fmt.Printf("fetch: %v \n", err)
	}

	// 結果が存在する場合にはDynamoDB データを Diary に登録
	if res != nil {
		resp, err := gj.diary.SetDiary(res)
		fmt.Printf("respです: %+v \n", resp)
		if err != nil {
			fmt.Printf("setDiaryでエラー: %v \n", err)
		}

		return resp, err
	}
	return domain.Diary{}, err
}

// recevier を変更する

// Run は実際の処理を行うメソッドです
func (gj *GetterJob) Run(ctx context.Context) (ResultDiaryContent, error) {
	var err error

	resultDiaryContent := ResultDiaryContent{}

	getItem, err := gj.featchDiary(ctx)
	if err != nil {
		fmt.Printf("getItem: %v \n", err)
	}

	resultDiaryContent.DiaryContent = getItem.Content

	return resultDiaryContent, nil

}
