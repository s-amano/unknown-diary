package domain

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
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

// SetPaginationData - ページネーションに必要なデータを取得する
func SetPaginationData(request events.APIGatewayProxyRequest, dc adapter.DynamoDBClientRepository) (map[string]*dynamodb.AttributeValue, *string, error) {
	var err error

	fmt.Printf("string request Query id: %+v\n", request.QueryStringParameters["id"])
	id := request.QueryStringParameters["id"]
	limit := request.QueryStringParameters["limit"]
	if id == "" && limit == "" {
		return nil, nil, err
	}
	if id == "" {
		return nil, &limit, err
	}
	// キー条件の生成
	keyCond := expression.Key("id").Equal(expression.Value(request.QueryStringParameters["id"]))
	// クエリ用 expression の生成
	expr, err := expression.NewBuilder().WithKeyCondition(keyCond).Build()
	if err != nil {
		fmt.Printf("exp create err %v\n", err)
		return nil, &limit, err
	}
	res, err := dc.QueryByExpressionNoindex(&expr)
	if err != nil {
		return nil, &limit, err
	}

	item := res.Items[0]

	return item, &limit, err
}

// FetchMyDiaryFromDynamoDB - DynamoDB から該当するレコードを取得する
func (gd *GetDiaries) FetchMyDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository, item map[string]*dynamodb.AttributeValue, limit string) (*dynamodb.QueryOutput, error) {
	// DynamoDB クエリ作成
	keyCond := expression.Key("author").Equal(expression.Value(gd.DiariesGetter))

	expr, err := expression.NewBuilder().WithKeyCondition(keyCond).Build()
	if err != nil {
		return nil, err
	}

	var exclusiveStartKey map[string]*dynamodb.AttributeValue = nil

	if item != nil {
		exclusiveStartKey = map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(*item["id"].S),
			},
			"post_at": {
				N: aws.String(*item["post_at"].N),
			},
			"author": {
				S: aws.String(*item["author"].S),
			},
			"status_post_at": {
				S: aws.String(*item["status_post_at"].S),
			},
		}
	}
	i, _ := strconv.Atoi(limit)
	intLimit := int64(i)
	defaultCount := int64(0)
	var defaultItems []map[string]*dynamodb.AttributeValue
	var res = &dynamodb.QueryOutput{Count: &defaultCount, Items: defaultItems}

	result, err := dc.QueryByExpressionWithLimit("author-status_post_at-index", &expr, exclusiveStartKey, &intLimit)
	if err != nil {
		return nil, err
	}

	fmt.Printf("result %s\n", result.LastEvaluatedKey)

	res.Items = append(res.Items, result.Items...)

	*res.Count = *res.Count + *result.Count

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
