package domain

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/google/uuid"
)

// Post はクライアントからのポスト内容を表現する構造体です
type Post struct {
	ID                string
	Time              time.Time
	Author            string
	Status            string
	Body              string
	PostForm          interface{}
	MarshaledPostForm string
}

// NewPost - API Gateway のリクエスト情報から Post オブジェクトを生成
func NewPost(request events.APIGatewayProxyRequest, author string) (*Post, error) {
	var id uuid.UUID
	var err error

	result := &Post{}

	// 現在時刻を取得
	currentTime := time.Now()
	result.Time = currentTime

	// ID 用にランダムな UUID を生成
	if id, err = uuid.NewRandom(); err != nil {
		return nil, err
	}
	result.ID = id.String()

	// request から情報をコピー
	result.Body = request.Body

	fmt.Printf("request.Body: %+v\n", request.Body)

	// BODY 文字列をパースし PostForm に変換
	if err = json.Unmarshal([]byte(result.Body), &result.PostForm); err != nil {
		return nil, err
	}

	fmt.Printf("postForm: %+v\n", result.PostForm)

	// author　をセット
	result.Author = author

	// status　をセット
	result.Status = "false"

	// Marshaled 形式に変換
	if err := result.marshalJSON(); err != nil {
		return nil, err
	}

	fmt.Printf("result: %+v\n", result)

	return result, nil
}

// marshalJSON - PostForm を JSON エンコードし MarshaledPostForm に格納する
func (p *Post) marshalJSON() error {
	var err error
	var postForm []byte

	if postForm, err = json.Marshal(p.PostForm); err != nil {
		return err
	}

	p.MarshaledPostForm = string(postForm)

	return nil
}

// GetDynamoDBItemMap - dynamoDB に格納する item データを生成する
func (p *Post) GetDynamoDBItemMap() map[string]*dynamodb.AttributeValue {
	currentTimeStr := fmt.Sprintf(
		"%d.%09d", p.Time.Unix(), p.Time.Nanosecond())

	statusPostAt := fmt.Sprintf("%s_%s", p.Status, currentTimeStr)

	// DynamoDB に格納する item オブジェクトを生成
	item := map[string]*dynamodb.AttributeValue{
		"id": {
			S: aws.String(p.ID),
		},
		"post_at": {
			N: aws.String(currentTimeStr),
		},
		"post_data": {
			S: aws.String(p.MarshaledPostForm),
		},
		"author": {
			S: aws.String(p.Author),
		},
		"status": {
			S: aws.String(p.Status),
		},
		"status_post_at": {
			S: aws.String(statusPostAt),
		},
	}

	return item
}
