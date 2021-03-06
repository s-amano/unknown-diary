package domain

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-getter/adapter"

	"math/rand"
)

// Diary - 日記の内容を表現する構造体です
type Diary struct {
	ID          string   `json:"id"`      // id
	PostAt      string   `json:"post_at"` // ポストされた日時
	Title       string   `json:"title"`   // 日記のタイトル
	Content     string   `json:"content"` // 日記の本文
	Date        *string  `json:"date"`    // 日記の日付
	Reaction    string   `json:"reaction"`
	Comments    []string `json:"comments"`
	Commenters  []string `json:"commenters"`
	Author      string   `json:"author"`
	Reactioners []string `json:"reactioners"`
}

// GetDiary - 日記を表現する構造体です
type GetDiary struct {
	DiaryGetter string
	DiaryID     string
	Diary       Diary // 日記内容の構造体
}

// FetchRandomOneDiaryFromDynamoDB - dynamoDBからstatusがfalseのものをランダムで１つ取り出す
func (gd *GetDiary) FetchRandomOneDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository) (map[string]*dynamodb.AttributeValue, error) {
	var err error

	// author が　getをした当人ではない　reactionersに自分が含まれていない
	filter := expression.Not(expression.Or(expression.Name("reactioners").Contains(gd.DiaryGetter), expression.ConditionBuilder(expression.Name("author").Equal(expression.Value(gd.DiaryGetter)))))
	// クエリ用 expression の生成
	expr, err := expression.NewBuilder().WithFilter(filter).Build()
	if err != nil {
		fmt.Printf("expsakuseierr %v\n getter %v\n", err, gd.DiaryGetter)
		return nil, err
	}

	var exclusiveStartKey map[string]*dynamodb.AttributeValue = nil

	defaultCount := int64(0)
	var defaultItems []map[string]*dynamodb.AttributeValue
	var res = &dynamodb.QueryOutput{Count: &defaultCount, Items: defaultItems}

	for {
		result, err := dc.GetAllRecords(&expr, exclusiveStartKey)
		if err != nil {
			fmt.Printf("exp %v\n getter %v\n", err, gd.DiaryGetter)
			return nil, err
		}
		res.Items = append(res.Items, result.Items...)

		*res.Count = *res.Count + *result.Count

		exclusiveStartKey = result.LastEvaluatedKey

		if result.LastEvaluatedKey == nil {
			break
		}
	}

	if *res.Count == int64(0) {
		return nil, err
	}

	// 返されたres.Itemsのランダム番目を取得
	num := rand.Intn(len(res.Items))

	return res.Items[num], err
}

// FetchSpecificOneDiaryFromDynamoDB は特定の１つの日記を取得する関数です
func (gd *GetDiary) FetchSpecificOneDiaryFromDynamoDB(dc adapter.DynamoDBClientRepository) (map[string]*dynamodb.AttributeValue, error) {
	var err error

	// キー条件の生成
	keyCond := expression.Key("id").Equal(expression.Value(gd.DiaryID))

	// クエリ用 expression の生成
	expr, err := expression.NewBuilder().WithKeyCondition(keyCond).Build()
	if err != nil {
		fmt.Printf("exp create err %v\n", err)
		return nil, err
	}

	res, err := dc.QueryByExpressionNoindex(&expr)
	if err != nil {
		return nil, err
	}

	if *res.Count == int64(0) {
		return nil, err
	}

	return res.Items[0], err
}

// SetDiary - クエリ結果を Diary に入れる
func (gd *GetDiary) SetDiary(item map[string]*dynamodb.AttributeValue) (Diary, error) {
	var err error
	var diary Diary

	// post_data を パースし Diary に変換
	err = json.Unmarshal([]byte(*item["post_data"].S), &diary)
	if err != nil {
		fmt.Printf("failed to unmarshal post_data. input: %s", *item["post_data"])
		return diary, err
	}

	// リアクションがない場合とある場合で条件分岐 リアクションがある場合はreactionersをresponseに加える
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

	//　コメントがない場合とある場合で条件分岐
	commenters, ok := item["commenters"]
	if !ok {
		diary.Comments = []string{}
		diary.Commenters = []string{}
		fmt.Printf("既存コメントがない %+v\n", diary)
	} else {
		fmt.Printf("commentersSlice L %+v\n", commenters.L)
		for _, v := range commenters.L {
			diary.Commenters = append(diary.Commenters, *v.S)
		}
		comments, ok := item["comments"]
		if !ok {
			diary.Comments = []string{}
		} else {
			for _, v := range comments.L {
				diary.Comments = append(diary.Comments, *v.S)
			}
		}
	}

	diary.ID = *item["id"].S
	diary.PostAt = *item["post_at"].N
	diary.Author = *item["author"].S

	return diary, nil
}

// AlterReceiverAndStatus - 受け取った日記のreceiverをgetした人のusernameへ更新し、statusをfalseにする。
func (gd *GetDiary) AlterReceiverAndStatus(item map[string]*dynamodb.AttributeValue, dc adapter.DynamoDBClientRepository) error {
	var err error

	updateItem := expression.UpdateBuilder{}.Set(expression.Name("receiver"), expression.Value(gd.DiaryGetter)).Set(expression.Name("status"), expression.Value("true"))

	// keyを生成

	updateItemKey := map[string]*dynamodb.AttributeValue{
		"id": {
			S: aws.String(*item["id"].S),
		},
		"post_at": {
			N: aws.String(*item["post_at"].N),
		},
	}

	expr, err := expression.NewBuilder().WithUpdate(updateItem).Build()
	if err != nil {
		return err
	}

	fmt.Printf("aleter item: %v", item)
	_, err = dc.UpdateItem(updateItemKey, &expr)
	if err != nil {
		return err
	}

	return nil
}
