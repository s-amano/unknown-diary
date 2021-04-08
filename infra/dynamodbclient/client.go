package dynamodbclient

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/s-amano/unknown-diary/infra/adapter"
)

// DynamoDBClient ...
type DynamoDBClient struct {
	tableName string
	dynamo    adapter.DynamoDBRepository
}

// NewDynamoDBClient 新たにdynamoDBClientを作成する関数
func NewDynamoDBClient(region string, tableName string) *DynamoDBClient {
	sess := session.Must(session.NewSession())
	config := aws.Config{
		Region: aws.String(region),
	}

	dynamodbClient := DynamoDBClient{
		tableName: tableName,
		dynamo:    dynamodb.New(sess, &config),
	}

	return &dynamodbClient
}

// GetAllRecords dynamoDBのレコードを全て取得する関数
func (c *DynamoDBClient) GetAllRecords(expr *expression.Expression, exclusiveStartKey map[string]*dynamodb.AttributeValue) (*dynamodb.ScanOutput, error) {
	s := &dynamodb.ScanInput{
		// AttributesToGet:   attributesToGet,
		TableName:                 aws.String(c.tableName),
		FilterExpression:          expr.Filter(),
		ExclusiveStartKey:         exclusiveStartKey,
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		ProjectionExpression:      expr.Projection(),
	}
	return c.dynamo.Scan(s)
}

// QueryByExpression 検索してレコードを取得する関数
func (c *DynamoDBClient) QueryByExpression(indexName string, expr *expression.Expression, exclusiveStartKey map[string]*dynamodb.AttributeValue) (*dynamodb.QueryOutput, error) {
	q := &dynamodb.QueryInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		FilterExpression:          expr.Filter(),
		IndexName:                 aws.String(indexName),
		KeyConditionExpression:    expr.KeyCondition(),
		ProjectionExpression:      expr.Projection(),
		TableName:                 aws.String(c.tableName),
		ExclusiveStartKey:         exclusiveStartKey,
	}
	return c.dynamo.Query(q)
}

// PutItem dynamoDBにデータをPUTする関数
func (c *DynamoDBClient) PutItem(item map[string]*dynamodb.AttributeValue) (*dynamodb.PutItemOutput, error) {
	p := &dynamodb.PutItemInput{
		Item:      item,
		TableName: aws.String(c.tableName),
	}
	return c.dynamo.PutItem(p)
}

// UpdateItem dynamoDBのデータをUPDATEする関数
func (c *DynamoDBClient) UpdateItem(item map[string]*dynamodb.AttributeValue, expr *expression.Expression) (*dynamodb.UpdateItemOutput, error) {
	u := &dynamodb.UpdateItemInput{
		TableName:                 aws.String(c.tableName),
		Key:                       item,
		ExpressionAttributeNames:  expr.Names(),
		ConditionExpression:       expr.Condition(),
		ExpressionAttributeValues: expr.Values(),
		UpdateExpression:          expr.Update(),
		ReturnValues:              aws.String(dynamodb.ReturnValueAllNew),
	}
	return c.dynamo.UpdateItem(u)
}
