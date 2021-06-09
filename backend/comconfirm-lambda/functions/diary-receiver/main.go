package main

import (
	"context"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"

	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-receiver/controller"
	"github.com/s-amano/unknown-diary/infra/dynamodbclient"
)

const (
	envNameDiaryStoreDynamoDBTable = "DIARY_STORE_DYNAMODB_TABLE"
	envLocalOfflineFlag            = "IS_OFFLINE"
)

var (
	region                  string
	dynamoDBClient          *dynamodbclient.DynamoDBClient
	diaryStoreDynamoDBTable string
	author                  string
	localOfflineFlag        string
)

func init() {
	region = "ap-northeast-1"

	diaryStoreDynamoDBTable = os.Getenv(envNameDiaryStoreDynamoDBTable)

	localOfflineFlag = os.Getenv(envLocalOfflineFlag)

	// DynamoDB クライアントの初期化
	dynamoDBClient = dynamodbclient.NewDynamoDBClient(region, diaryStoreDynamoDBTable, localOfflineFlag)
}

func handler(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	result := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                     "text/html",
			"Access-Control-Allow-Origin":      "*",
			"Access-Control-Allow-Credentials": "true",
		},
		Body:            "",
		IsBase64Encoded: false,
	}

	// POSTしたユーザー名取得
	author = apiGWEvent.RequestContext.Authorizer["claims"].(map[string]interface{})["cognito:username"].(string)

	fmt.Printf("author: %v", author)

	// コントローラの作成
	src := controller.ReceiverController{
		DynamoDBClientRepo: dynamoDBClient,
		Author:             author,
	}
	// DynamoDB への書き込み
	err := src.Run(context.Background(), apiGWEvent, &result)
	if err != nil {
		fmt.Printf("%s\n", err)
	}

	return result, err
}

func main() {
	lambda.Start(handler)
}
