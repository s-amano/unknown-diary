package domain

import (
	"errors"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"

	"github.com/stretchr/testify/assert"
)

// DynamoDBクライアントのモック
type dMock struct {
	debugError        string
	debugQueryOutput  *dynamodb.QueryOutput
	debugUpdateOutput *dynamodb.UpdateItemOutput
}

func (dm dMock) QueryByExpressionNoindex(expr *expression.Expression) (*dynamodb.QueryOutput, error) {
	var err error
	if dm.debugError != "" {
		err = errors.New(dm.debugError)
	}
	return dm.debugQueryOutput, err
}

func (dm dMock) UpdateItem(item map[string]*dynamodb.AttributeValue, expr *expression.Expression) (*dynamodb.UpdateItemOutput, error) {
	var err error
	if dm.debugError != "" {
		err = errors.New(dm.debugError)
	}
	return dm.debugUpdateOutput, err
}

func TestNewPostDiary(t *testing.T) {
	a := assert.New(t)

	request := events.APIGatewayProxyRequest{
		Body:              "{\"id\": \"c5214d83-ec15-421b-be12-d5d1085ed9fe\", \"post_at\": \"1619802426.512639068\"}",
		MultiValueHeaders: map[string][]string{"Content-Type": {"application/json"}},
	}

	diaryReactioner := "test-taro"

	// ターゲットメソッド実行
	p, err := NewPostDiary(request, diaryReactioner)

	a.Nil(err, "メソッド実行が成功する")

	a.Equal(request.Body, p.Body,
		"Body に適切な値がセットされている")

	a.Equal((map[string]interface{}{"id": "c5214d83-ec15-421b-be12-d5d1085ed9fe", "post_at": "1619802426.512639068"}), p.PostForm,
		"PostForm に適切な値がセットされていること")
}

func TestFetchOneDiaryFromDynamoDB(t *testing.T) {
	a := assert.New(t)

	rd := ReactionDiary{}

	count := int64(1)

	// デフォルトreactionが存在しないとき
	noReacionBar := "noReactionBar"

	noReactionFoo := dynamodb.AttributeValue{S: &noReacionBar}

	items := []map[string]*dynamodb.AttributeValue{{"noReactionFoo": &noReactionFoo}}

	dm := dMock{
		debugQueryOutput: &dynamodb.QueryOutput{Count: &count, Items: items},
	}

	postdiary := PostDiary{
		PostForm: map[string]interface{}{"id": "c5214d83-ec15-421b-be12-d5d1085ed9fe", "post_at": "1619802426.512639068"},
	}

	// ターゲットメソッドを実行(デフォルトreactionが存在しないとき)
	err := rd.FetchOneDiaryFromDynamoDB(&dm, &postdiary)

	a.Nil(err, "エラーが発生しないこと")

	a.Equal("c5214d83-ec15-421b-be12-d5d1085ed9fe", rd.ID, "ID:期待した値が返される事(reaction存在しなかったとき)")

	a.Equal("1619802426.512639068", rd.PostAt, "PostAt:期待した値が返される事(reaction存在しなかったとき)")

	a.Equal("0", rd.Reaction, "Reaction:期待した値が返されること(reaction存在しなかったとき)")

	a.Equal([]string{}, rd.Reactioners, "Reactioners: 期待した値が返されること(reaction存在しなかったとき)")

	// デフォルトreactionが存在するとき
	Reaction := "3"

	ReactionAttrivute := dynamodb.AttributeValue{S: &Reaction}

	Reactioner := "test-taro"

	ReactionerAttrivute := dynamodb.AttributeValue{S: &Reactioner}

	Reactioners := []*dynamodb.AttributeValue{&ReactionerAttrivute}

	ReactionersItem := dynamodb.AttributeValue{L: Reactioners}

	items = []map[string]*dynamodb.AttributeValue{{"reaction": &ReactionAttrivute, "reactioners": &ReactionersItem}}

	dm = dMock{
		debugQueryOutput: &dynamodb.QueryOutput{Count: &count, Items: items},
	}

	// ターゲットメソッドを実行(デフォルトreactionが存在しないとき)
	err = rd.FetchOneDiaryFromDynamoDB(&dm, &postdiary)

	a.Nil(err, "エラーが発生しないこと")

	a.Equal("c5214d83-ec15-421b-be12-d5d1085ed9fe", rd.ID, "ID:期待した値が返される事(reaction存在したとき)")

	a.Equal("1619802426.512639068", rd.PostAt, "PostAt:期待した値が返される事(reaction存在したとき)")

	a.Equal("3", rd.Reaction, "Reaction:期待した値が返されること(reaction存在したとき)")

	a.Equal([]string{"test-taro"}, rd.Reactioners, "Reactioners:期待した値が返されること(reaction存在したとき)")
}

func TestUpdateDiaryReaction(t *testing.T) {
	a := assert.New(t)

	// (共通)itemとdynamoDBクライアント
	item := map[string]*dynamodb.AttributeValue{
		"id": {
			S: aws.String("c5214d83-ec15-421b-be12-d5d1085ed9fe"),
		},
		"post_at": {
			N: aws.String("1619802426.512639068"),
		},
	}

	// (共通)updateした内容を返答するitem
	Reaction := "3"

	ReactionAttrivute := dynamodb.AttributeValue{S: &Reaction}

	responseItem := map[string]*dynamodb.AttributeValue{"reaction": &ReactionAttrivute}

	dm := dMock{
		debugUpdateOutput: &dynamodb.UpdateItemOutput{Attributes: responseItem},
	}

	// Reactionしてきた人がすでにreactioners配列にいた場合
	rdMinus := ReactionDiary{
		ID:             "c5214d83-ec15-421b-be12-d5d1085ed9fe",
		PostAt:         "1619802426.512639068",
		ThisReactioner: "test-taro",
		Reaction:       "1",
		Reactioners:    []string{"test-taro"},
	}

	// ターゲットメソッド実行(Reactionしてきた人がすでにreactioners配列にいた場合)
	_, err := rdMinus.UpdateDiaryReaction(item, &dm)

	a.Nil(err, "エラーが発生しないこと")

	a.Equal("0", rdMinus.Reaction, "Reaction:期待した値が返されること(reactioners含まれていたとき)")

	a.Equal([]string{}, rdMinus.Reactioners, "Reactioners:期待した値が返されること(reactioners含まれていたとき)")

	a.Equal(true, rdMinus.ReacionerFlag, "ReacionerFlag:期待した値が返されること(reactioners含まれていたとき)")

	// Reactionしてきた人がreactioners配列にいなかった場合

	rdPlus := ReactionDiary{
		ID:             "c5214d83-ec15-421b-be12-d5d1085ed9fe",
		PostAt:         "1619802426.512639068",
		ThisReactioner: "test-taro",
		Reaction:       "1",
		Reactioners:    []string{"test-hanako"},
	}

	// ターゲットメソッド実行(Reactionしてきた人がreactioners配列にいなかった場合)
	_, err = rdPlus.UpdateDiaryReaction(item, &dm)

	a.Nil(err, "エラーが発生しないこと")

	a.Equal("2", rdPlus.Reaction, "Reaction:期待した値が返されること(reactioners含まれていなかったとき)")

	a.Equal([]string{"test-hanako", "test-taro"}, rdPlus.Reactioners, "Reactioners:期待した値が返されること(reactioners含まれていなかったとき)")

	a.Equal(false, rdPlus.ReacionerFlag, "ReacionerFlag:期待した値が返されること(reactioners含まれていなかったとき)")

}
