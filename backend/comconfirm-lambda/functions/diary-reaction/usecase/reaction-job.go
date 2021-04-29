package usecase

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-reaction/adapter"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-reaction/domain"
)

// ReactionJob ジョブを表すレポジトリです
type ReactionJob struct {
	DynamoDBClientRepo adapter.DynamoDBClientRepository
	DiaryReactioner    string

	diary *domain.ReactionDiary
}

// ResultDiary はAPIのresponse内に格納する日記を格納する構造体です
type ResultDiary struct {
	DiaryContent  string `json:"diary_content"`
	DiaryReaction int    `json:"diary_reaction"`
}

// Run メソッドは、受け取ったポストデータを実際に処理します
func (rj *ReactionJob) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) error {
	var err error

	// apiGWEvent のヘッダ、queryString から PostDiary 構造体を生成
	diaryPost, err := domain.NewPostDiary(apiGWEvent, rj.DiaryReactioner)
	if err != nil {
		return err
	}

	// GetDiary を初期化
	rj.diary = &domain.ReactionDiary{
		ThisReactioner: rj.DiaryReactioner,
	}

	// DynamoDB からitemを取得
	err = rj.diary.FetchOneDiaryFromDynamoDB(rj.DynamoDBClientRepo, diaryPost)
	if err != nil {
		return err
	}

	// updateするためのitem作成
	item, err := rj.diary.GetDynamoDBItemMap()
	if err != nil {
		return err
	}

	// updateを実行
	err = rj.diary.UpdateDiaryReaction(item, rj.DynamoDBClientRepo)
	if err != nil {
		return err
	}

	return nil
}
