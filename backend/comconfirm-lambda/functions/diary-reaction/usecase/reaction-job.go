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
	ID          string   `json:"id"`
	PostAt      string   `json:"post_at"`
	Reaction    string   `json:"reaction"`
	Reactioners []string `json:"reactioners"`
}

// Run メソッドは、受け取ったポストデータを実際に処理します
func (rj *ReactionJob) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) (ResultDiary, error) {
	var err error

	ResultDiary := ResultDiary{}

	// apiGWEvent のヘッダ、queryString から PostDiary 構造体を生成
	diaryPost, err := domain.NewPostDiary(apiGWEvent, rj.DiaryReactioner)
	if err != nil {
		return ResultDiary, err
	}

	// GetDiary を初期化
	rj.diary = &domain.ReactionDiary{
		ThisReactioner: rj.DiaryReactioner,
	}

	// DynamoDB からitemを取得
	err = rj.diary.FetchOneDiaryFromDynamoDB(rj.DynamoDBClientRepo, diaryPost)
	if err != nil {
		return ResultDiary, err
	}

	// updateするためのitem作成
	item, err := rj.diary.GetDynamoDBItemMap()
	if err != nil {
		return ResultDiary, err
	}

	// updateを実行
	responseDiary, err := rj.diary.UpdateDiaryReaction(item, rj.DynamoDBClientRepo)
	if err != nil {
		return ResultDiary, err
	}
	ResultDiary.ID = responseDiary.ID
	ResultDiary.PostAt = responseDiary.PostAt
	ResultDiary.Reaction = responseDiary.Reaction
	ResultDiary.Reactioners = responseDiary.Reactioners

	return ResultDiary, nil
}
