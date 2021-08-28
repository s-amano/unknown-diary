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
	ID       string  `json:"id"`      // id
	PostAt   string  `json:"post_at"` // ポストされた日時
	Title    string  `json:"title"`   // 日記のタイトル
	Content  string  `json:"content"` // 日記の本文
	Date     *string `json:"date"`    // 日記の日付
	Reaction string  `json:"reaction"`
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

	var exclusiveStartKey map[string]*dynamodb.AttributeValue = nil
	var limit = int64(100)
	defaultCount := int64(0)
	var defaultItems []map[string]*dynamodb.AttributeValue
	var res = &dynamodb.QueryOutput{Count: &defaultCount, Items: defaultItems}

	// LastEvaluatedKeyがある間,データを取得し続ける
	for {
		result, err := dc.QueryByExpression("author-status_post_at-index", &expr, exclusiveStartKey, limit)
		if err != nil {
			return nil, err
		}

		res.Items = append(res.Items, result.Items...)

		*res.Count = *res.Count + *result.Count

		exclusiveStartKey = result.LastEvaluatedKey

		if result.LastEvaluatedKey == nil {
			break
		}

	}

	return res, nil
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
		// リアクションがあるかどうかで条件分岐
		reaction, ok := item["reaction"]
		if !ok {
			diary.Reaction = "0"
		} else {
			diary.Reaction = *reaction.S
		}

		diary.ID = *item["id"].S
		diary.PostAt = *item["post_at"].N

		gd.Diaries = append(gd.Diaries, diary)
	}

	return gd.Diaries, nil
}
