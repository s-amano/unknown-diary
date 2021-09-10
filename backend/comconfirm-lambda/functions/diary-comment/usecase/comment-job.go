package usecase

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-comment/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-comment/domain"
)

// CommentJob ジョブを表すレポジトリです
type CommentJob struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryCommenter     string

	diary *domain.CommentDiary
}

// ResultDiary はAPIのresponse内に格納する日記を格納する構造体です
type ResultDiary struct {
	ID            string   `json:"id"`
	PostAt        string   `json:"post_at"`
	Comments      []string `json:"comments"`
	CommenterFlag bool     `json:"is_comment"`
}

// Run メソッドは、受け取ったポストデータを実際に処理します
func (cj *CommentJob) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) (ResultDiary, error) {
	var err error

	ResultDiary := ResultDiary{}

	// apiGWEvent のヘッダ、queryString から PostDiary 構造体を生成
	diaryPost, err := domain.NewPostDiary(apiGWEvent, cj.DiaryCommenter)
	if err != nil {
		return ResultDiary, err
	}

	// GetDiary を初期化
	cj.diary = &domain.CommentDiary{
		ThisCommenter: cj.DiaryCommenter,
	}

	// DynamoDB からitemを取得
	err = cj.diary.FetchOneDiaryFromDynamoDB(cj.DynamoDBClientRepo, diaryPost)
	if err != nil {
		return ResultDiary, err
	}

	// updateするためのitem作成
	item, err := cj.diary.GetDynamoDBItemMap()
	if err != nil {
		return ResultDiary, err
	}

	// updateを実行
	responseDiary, err := cj.diary.UpdateDiaryComment(item, cj.DynamoDBClientRepo)
	if err != nil {
		return ResultDiary, err
	}
	ResultDiary.ID = responseDiary.ID
	ResultDiary.PostAt = responseDiary.PostAt
	ResultDiary.Comments = responseDiary.CommentArray
	ResultDiary.CommenterFlag = responseDiary.CommenterFlag

	return ResultDiary, nil
}
