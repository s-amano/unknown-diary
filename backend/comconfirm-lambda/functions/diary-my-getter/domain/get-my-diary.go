package domain

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-my-getter/adapter"
)

// Diary - 各日記の内容を格納する構造体
type Diary struct {
	ID      string `json:"id"`      // id
	PostAt  string `json:"post_at"` // ポストされた日時
	Content string `json:"content"` // 日記の本文
}

// GetDiaries - 日記を格納する構造体
type GetDiaries struct {
	DiariesGetter string
	Diaries       []Diary
}

// FetchMyDiaryFromDynamoDB - DynamoDB から該当するレコードを取得する
func (gd *GetDiaries) FetchMyDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository) (*dynamodb.QueryOutput, error) {
	// DynamoDB クエリ作成
	keyCond := expression.Key("author").Equal(expression.Value(gd.DiariesGetter))

	expr, err := expression.NewBuilder().WithKeyCondition(keyCond).Build()
	if err != nil {
		return nil, err
	}

	// 初期段階はexclusiveStartKeyをnil指定で
	result, err := dc.QueryByExpression("author-status_post_at-index", &expr, nil)
	if err != nil {
		return nil, err
	}

	// 結果が空の場合の処理
	if *result.Count < 1 {
		return nil, nil
	}

	return result, nil
}

// AddDiaries - DynamoDBのクエリ結果を Diaries に格納する
func (gd *GetDiaries) AddDiaries(res *dynamodb.QueryOutput) ([]Diary, error) {
	var err error

	gd.Diaries = make([]Diary, 0, *res.Count)

	for _, item := range res.Items {
		diary := Diary{}

		err = json.Unmarshal([]byte(*item["post_data"].S), &diary)
		if err != nil {
			fmt.Printf("failed to unmarshal post_data. input: %s", *item["post_data"])
			continue
		}

		diary.ID = *item["id"].S
		diary.PostAt = *item["post_at"].N

		gd.Diaries = append(gd.Diaries, diary)
	}

	return gd.Diaries, nil
}
