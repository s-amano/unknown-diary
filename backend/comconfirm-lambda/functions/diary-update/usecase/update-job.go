package usecase

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-update/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-update/domain"
)

// UpdateJob ジョブを表すレポジトリです
type UpdateJob struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryGetter        string
	DiaryID            string

	diary *domain.UpdateDiary
}

// ResultDiary はAPIのresponse内に格納する日記を格納する構造体です
type ResultDiary struct {
	ID      string `json:"id"`
	PostAt  string `json:"post_at"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Date    string `json:"date"`
}

// Run メソッドは、受け取ったポストデータを実際に処理します
func (rj *UpdateJob) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) (ResultDiary, error) {
	var err error

	ResultDiary := ResultDiary{}

	// apiGWEvent のヘッダ、queryString から PostDiary 構造体を生成
	diaryPost, err := domain.NewPostDiary(apiGWEvent, rj.DiaryGetter)
	if err != nil {
		return ResultDiary, err
	}

	// updateするためのitem作成
	item, err := diaryPost.GetDynamoDBItemMap()
	if err != nil {
		return ResultDiary, err
	}

	// updateを実行
	responseDiary, err := diaryPost.UpdateDiary(item, rj.DynamoDBClientRepo)
	if err != nil {
		return ResultDiary, err
	}
	ResultDiary.ID = responseDiary.ID
	ResultDiary.PostAt = responseDiary.PostAt
	ResultDiary.Title = responseDiary.Title
	ResultDiary.Content = responseDiary.Content
	if responseDiary.Date != nil {
		ResultDiary.Date = *responseDiary.Date
	}

	return ResultDiary, nil
}
