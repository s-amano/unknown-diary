package domain

import (
	"testing"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestNewPost(t *testing.T) {
	a := assert.New(t)

	request := events.APIGatewayProxyRequest{
		Body:              "{\"content\": \"今日も楽しかった。\"}",
		MultiValueHeaders: map[string][]string{"Content-Type": {"application/json"}},
	}

	author := "testUser"

	p, err := NewPost(request, author)

	a.Nil(err, "メソッド実行が成功する")

	// 実行結果の確認
	a.NotEmpty(p.ID, "IDがセットされている")

	a.Equal(request.Body, p.Body,
		"Body に適切な値がセットされている")

	a.Equal((map[string]interface{}{"content": "今日も楽しかった。"}), p.PostForm,
		"PostForm に適切な値がセットされていること")

}

func TestGetDynamoDBItemMap(t *testing.T) {
	a := assert.New(t)

	p := Post{}

	id, _ := uuid.NewRandom()
	p.ID = id.String()

	// Unixtimeで 123456789.012345678
	p.Time = time.Date(1973, 11, 29, 21, 33, 9, 12345678, time.UTC)

	p.MarshaledPostForm = `{"test":"data"}`

	result := p.GetDynamoDBItemMap()

	// 実行結果の確認
	a.Equal(p.ID, *result["id"].S,
		"id に期待された値が格納されている")
	a.Equal("123456789.012345678", *result["post_at"].N,
		"post_at に期待された値が格納されていること")
	a.Equal(`{"test":"data"}`, *result["post_data"].S,
		"post_data に期待された値が格納されていること")
}
