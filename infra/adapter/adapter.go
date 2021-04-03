package adapter

import (
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

// DynamoDBRepository は AWS SDK での DynamoDB へのアダプタインタフェースです
type DynamoDBRepository interface {
	Scan(input *dynamodb.ScanInput) (*dynamodb.ScanOutput, error)
	Query(input *dynamodb.QueryInput) (*dynamodb.QueryOutput, error)
	PutItem(input *dynamodb.PutItemInput) (*dynamodb.PutItemOutput, error)
	UpdateItem(input *dynamodb.UpdateItemInput) (*dynamodb.UpdateItemOutput, error)
}
