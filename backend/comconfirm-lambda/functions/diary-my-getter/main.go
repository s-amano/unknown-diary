package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"

	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-my-getter/controller"
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
	diaryGetter             string
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

	// GETしたユーザー名取得
	diaryGetter = apiGWEvent.RequestContext.Authorizer["claims"].(map[string]interface{})["cognito:username"].(string)

	fmt.Printf("getter: %v\n", diaryGetter)

	// コントローラの作成
	src := controller.GetterController{
		DynamoDBClientRepo: dynamoDBClient,
		DiaryGetter:        diaryGetter,
	}

	items, err := src.Run(context.Background())
	if err != nil {
		fmt.Printf("items作成 : %v\n", err)
	}

	j, err := json.Marshal(items)
	if err != nil {
		fmt.Printf("j作成 : %s\n", err)
	}

	result := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                 "text/html",
			"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "GET",
		},
		Body: string(j),
	}
	fmt.Printf("main result : %+v\n", result)
	return result, err
}

func main() {
	lambda.Start(handler)
}
