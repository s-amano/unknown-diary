package domain

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-my-favorites-getter/adapter"
)

// Diary - 各日記の内容を格納する構造体
type Diary struct {
	ID          string   `json:"id"`      // id
	PostAt      string   `json:"post_at"` // ポストされた日時
	Title       string   `json:"title"`   // 日記のタイトル
	Content     string   `json:"content"` // 日記の本文
	Date        *string  `json:"date"`    // 日記の日付
	Reaction    string   `json:"reaction"`
	Reactioners []string `json:"reactioners"`
}

// GetDiaries - 日記を格納する構造体
type GetDiaries struct {
	DiariesGetter string
	Diaries       []Diary
}

// SetPaginationData - ページネーションに必要なデータを取得する
func SetPaginationData(request events.APIGatewayProxyRequest, dc adapter.DynamoDBClientRepository) (map[string]*dynamodb.AttributeValue, *string, error) {
	var err error

	id := request.QueryStringParameters["id"]
	fmt.Printf("string request Query id: %v, type:%T\n", id, id)

	limit := request.QueryStringParameters["limit"]
	fmt.Printf("string request Query id: %v, type:%T\n", limit, limit)
	if id == "" {
		return nil, &limit, err
	}
	// キー条件の生成
	keyCond := expression.Key("id").Equal(expression.Value(id))
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

// FetchAllMyFavoritesDiaryFromDynamoDB - DynamoDB から該当するレコードを全て取得する
func (gd *GetDiaries) FetchAllMyFavoritesDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository) (*dynamodb.QueryOutput, error) {
	// DynamoDB クエリ作成
	filter := expression.Name("reactioners").Contains(gd.DiariesGetter)

	expr, err := expression.NewBuilder().WithFilter(filter).Build()
	if err != nil {
		return nil, err
	}

	var exclusiveStartKey map[string]*dynamodb.AttributeValue = nil
	defaultCount := int64(0)
	var defaultItems []map[string]*dynamodb.AttributeValue
	var res = &dynamodb.QueryOutput{Count: &defaultCount, Items: defaultItems}

	// LastEvaluatedKeyがある間,データを取得し続ける
	for {
		result, err := dc.GetAllRecords(&expr, exclusiveStartKey)
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

// FetchMyFavoritesDiaryFromDynamoDB - DynamoDB から該当するレコードを取得する
func (gd *GetDiaries) FetchMyFavoritesDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository, item map[string]*dynamodb.AttributeValue, limit string) (*dynamodb.QueryOutput, error) {
	// DynamoDB クエリ作成
	filter := expression.Name("reactioners").Contains(gd.DiariesGetter)

	expr, err := expression.NewBuilder().WithFilter(filter).Build()
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
		}
	}

	var intLimit int64

	if limit != "" {
		i, _ := strconv.Atoi(limit)
		intLimit = int64(i)
	}

	defaultCount := int64(0)
	var defaultItems []map[string]*dynamodb.AttributeValue
	var res = &dynamodb.QueryOutput{Count: &defaultCount, Items: defaultItems}

	// LastEvaluatedKeyがある間,データを取得し続ける
	for {
		result, err := dc.GetAllRecordsWithLimit(&expr, exclusiveStartKey, &intLimit)
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

	if *res.Count > 6 {
		res.Items = res.Items[0:6]
		*res.Count = 6
		return res, nil
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
			fmt.Printf("failed to unmarshal post_data. input: %s\n err: %v\n ", *item["post_data"], err)
			continue
		}
		// リアクションがあるかどうかで条件分岐
		reaction, ok := item["reaction"]
		if !ok {
			diary.Reaction = "0"
		} else {
			diary.Reaction = *reaction.S
			reactioners, ok := item["reactioners"]
			if !ok {
				diary.Reactioners = []string{}
			} else {
				for _, v := range reactioners.L {
					diary.Reactioners = append(diary.Reactioners, *v.S)
				}
			}
		}

		diary.ID = *item["id"].S
		diary.PostAt = *item["post_at"].N

		gd.Diaries = append(gd.Diaries, diary)
	}

	return gd.Diaries, nil
}
