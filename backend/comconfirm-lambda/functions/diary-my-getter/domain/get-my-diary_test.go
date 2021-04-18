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
	debugError       string
	debugQueryOutput *dynamodb.QueryOutput
}

func (dm dMock) QueryByExpression(indexName string, expr *expression.Expression, exclusiveStartKey map[string]*dynamodb.AttributeValue) (*dynamodb.QueryOutput, error) {
	var err error
	if dm.debugError != "" {
		err = errors.New(dm.debugError)
	}
	return dm.debugQueryOutput, err
}

func TestFetchMyDiaryFromDynamoDB(t *testing.T) {
	a := assert.New(t)

	gd := GetDiaries{
		DiariesGetter: "testUser",
	}

	count := int64(2)

	bar := "bar"

	foo := dynamodb.AttributeValue{S: &bar}

	items := []map[string]*dynamodb.AttributeValue{{"foo": &foo}}
	dm := dMock{
		debugQueryOutput: &dynamodb.QueryOutput{Count: &count, Items: items},
	}

	res, err := gd.FetchMyDiaryFromDynamoDB(&dm)
	a.Nil(err, "エラーが発生しないこと")

	a.Equal("bar", *res.Items[0]["foo"].S,
		"期待した値が返されること")
}

func TestAddDiaries(t *testing.T) {
	a := assert.New(t)

	var gd GetDiaries

	postAt := "1111.1111"
	id := "abcdefg"
	postData := `{"content":"今日は楽しかった"}`

	daPostAt := dynamodb.AttributeValue{N: &postAt}
	daID := dynamodb.AttributeValue{S: &id}
	daPostData := dynamodb.AttributeValue{S: &postData}

	count := int64(1)

	res := dynamodb.QueryOutput{
		Count: &count,
		Items: []map[string]*dynamodb.AttributeValue{
			0: {
				"post_at":   &daPostAt,
				"id":        &daID,
				"post_data": &daPostData,
			},
		},
	}

	resItem, err := gd.AddDiaries(&res)

	a.Nil(err, "エラーが発生しない")

	a.Equal("1111.1111", resItem[0].PostAt,
		"PostAtに想定された値が入っている")

	a.Equal("abcdefg", resItem[0].ID,
		"IDに想定された値が入っていること")

	a.Equal("今日は楽しかった", resItem[0].Content,
		"日記のcontentに想定された値が入っていること")
}
