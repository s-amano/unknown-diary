package domain

import (
	"errors"
	"testing"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/stretchr/testify/assert"
)

// DynamoDBクライアントのモック
type dMock struct {
	debugError               string
	debugUpdateItemOutput    *dynamodb.UpdateItemOutput
	debugGetAllRecordsOutput *dynamodb.ScanOutput
}

func (dm dMock) UpdateItem(item map[string]*dynamodb.AttributeValue, expr *expression.Expression) (*dynamodb.UpdateItemOutput, error) {
	var err error

	if dm.debugError != "" {
		err = errors.New(dm.debugError)
	}
	return dm.debugUpdateItemOutput, err
}

func (dm dMock) GetAllRecords(expr *expression.Expression, exclusiveStartKey map[string]*dynamodb.AttributeValue) (*dynamodb.ScanOutput, error) {
	var err error

	if dm.debugError != "" {
		err = errors.New(dm.debugError)
	}
	return dm.debugGetAllRecordsOutput, err
}

func TestFetchRandomOneDiaryFromDynamoDB(t *testing.T) {
	a := assert.New(t)

	gd := GetDiary{
		DiaryGetter: "testUser",
	}

	count := int64(1)

	bar := "bar"

	foo := dynamodb.AttributeValue{S: &bar}

	items := []map[string]*dynamodb.AttributeValue{{"foo": &foo}}
	dm := dMock{
		debugGetAllRecordsOutput: &dynamodb.ScanOutput{Count: &count, Items: items},
	}

	// ターゲットメソッドを実行(正常系)
	res, err := gd.FetchRandomOneDiaryFromDynamoDB(&dm)
	a.Nil(err, "エラーが発生しないこと")

	a.Equal("bar", *res["foo"].S,
		"期待した値が返されること")
}

func TestSetDiary(t *testing.T) {
	a := assert.New(t)

	gd := GetDiary{
		DiaryGetter: "testUser",
	}

	postAt := "1111.1111"
	id := "abcdefg"
	postData := `{"content":"今日は楽しかった"}`

	daPostAt := dynamodb.AttributeValue{N: &postAt}
	daID := dynamodb.AttributeValue{S: &id}
	daPostData := dynamodb.AttributeValue{S: &postData}

	item := map[string]*dynamodb.AttributeValue{
		"post_at":   &daPostAt,
		"id":        &daID,
		"post_data": &daPostData,
	}

	res, err := gd.SetDiary(item)
	a.Nil(err, "エラーが発生しないこと")

	a.Equal("1111.1111", res.PostAt,
		"PostAtに想定された値が入っている")

	a.Equal("abcdefg", res.ID,
		"IDに想定された値が入っていること")

	a.Equal("今日は楽しかった", res.Content,
		"日記のcontentに想定された値が入っていること")

}

func TestAlterReceiverAndStatus(t *testing.T) {
	a := assert.New(t)

	gd := GetDiary{
		DiaryGetter: "testUser",
	}

	postAt := "1111.1111"
	id := "abcdefg"
	postData := `{"content":"今日は楽しかった"}`
	author := "testAuthor"

	daPostAt := dynamodb.AttributeValue{N: &postAt}
	daID := dynamodb.AttributeValue{S: &id}
	daPostData := dynamodb.AttributeValue{S: &postData}
	daAuthor := dynamodb.AttributeValue{S: &author}

	item := map[string]*dynamodb.AttributeValue{
		"post_at":   &daPostAt,
		"id":        &daID,
		"post_data": &daPostData,
		"author":    &daAuthor,
	}

	dm := dMock{
		debugUpdateItemOutput: &dynamodb.UpdateItemOutput{},
	}

	err := gd.AlterReceiverAndStatus(item, &dm)

	a.Nil(err, "エラーが発生しないこと")
}
