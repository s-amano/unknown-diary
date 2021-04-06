package domain

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-receiver/adapter"

	"math/rand"
)

// Diary - 日記の内容を表現する構造体です
type Diary struct {
	ID      string `dynamodbav:"id" json:"id"`           // id
	PostAt  string `dynamodbav:"post_at" json:"post_at"` // ポストされた日時
	Content string `json:"content"`                      // 日記の本文
}

// GetDiary - 日記を表現する構造体です
type GetDiary struct {
	diaryPoster string
	Diary       Diary // 日記内容の構造体
}

// FetchRandomOneDiaryFromDynamoDB - dynamoDBからstatusがfalseのものをランダムで１つ取り出す
func (gd *GetDiary) FetchRandomOneDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository) (map[string]*dynamodb.AttributeValue, error) {
	var err error

	// DynamoDB クエリ条件の生成 ( author-status_post_at-index インデックス対象 )

	// 1. パーティションキー author が　postをした人のusernameと一致しない
	cond := expression.NotEqual(expression.Key("author"), expression.Value(gd.diaryPoster))

	// キー条件の生成  // 2. ソートキー条件 status が false
	keyCond := expression.KeyBeginsWith(expression.Key("status_post_at-index"), "false")

	// クエリ用 expression の生成
	expr, err := expression.NewBuilder().WithCondition(cond).WithKeyCondition(keyCond).Build()
	if err != nil {
		return nil, err
	}

	res, err := dc.QueryByExpression("author-status_post_at-index", &expr, nil)
	if err != nil {
		return nil, err
	}

	// 結果が空の場合の処理
	if *res.Count < 1 {
		return nil, nil
	}

	// 返されたres.Itemsのランダム番目を取得
	num := rand.Intn(len(res.Items))

	return res.Items[num], err
}

// SetDiary - クエリ結果を Diary に入れる
func (gd *GetDiary) SetDiary(item map[string]*dynamodb.AttributeValue) error {
	var err error
	var diary Diary

	// post_data を パースし Diary に変換
	err = json.Unmarshal([]byte(*item["post_data"].S), &diary)
	if err != nil {
		fmt.Printf("failed to unmarshal post_data. input: %s", *item["post_data"])
		return err
	}

	diary.ID = *item["id"].S
	diary.PostAt = *item["post_at"].S

	gd.Diary = diary

	return nil
}

// 受け取った日記のreceiverをpostした人のusernameへ更新する
