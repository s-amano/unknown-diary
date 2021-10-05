package usecase

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-getter/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-getter/domain"
)

// GetterJob は、受け取ったポストデータをを処理するジョブを表すレポジトリです
type GetterJob struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryGetter        string
	DiaryID            string

	diary *domain.GetDiary
}

// ResultDiary はAPIのresponse内に格納する日記の内容を格納する構造体です
type ResultDiary struct {
	domain.Diary
}

func (gj *GetterJob) featchDiary(ctx context.Context) (domain.Diary, error) {

	var res map[string]*dynamodb.AttributeValue
	var err error

	// GetDiary を初期化
	gj.diary = &domain.GetDiary{
		DiaryGetter: gj.DiaryGetter,
		DiaryID:     gj.DiaryID,
	}

	if len(gj.DiaryID) > 0 {
		res, err = gj.diary.FetchSpecificOneDiaryFromDynamoDB(gj.DynamoDBClientRepo)
		if err != nil {
			fmt.Printf("fetch: %v \n", err)
		}
	} else {
		res, err = gj.diary.FetchRandomOneDiaryFromDynamoDB(gj.DynamoDBClientRepo)
		if err != nil {
			fmt.Printf("fetch: %v \n", err)
		}
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

// Run は実際の処理を行うメソッドです
func (gj *GetterJob) Run(ctx context.Context) (ResultDiary, error) {
	var err error

	ResultDiary := ResultDiary{}

	getItem, err := gj.featchDiary(ctx)
	if err != nil {
		fmt.Printf("getItem: %v \n", err)
	}

	ResultDiary.ID = getItem.ID
	ResultDiary.PostAt = getItem.PostAt
	ResultDiary.Content = getItem.Content
	ResultDiary.Reaction = getItem.Reaction
	ResultDiary.Date = getItem.Date
	ResultDiary.Title = getItem.Title
	ResultDiary.Comments = getItem.Comments
	ResultDiary.Commenters = getItem.Commenters
	ResultDiary.Author = getItem.Author
	ResultDiary.Reactioners = getItem.Reactioners

	return ResultDiary, nil

}
