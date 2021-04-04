package adapter

import (
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
)

// DynamoDBClientRepository - DynamoDBを操作するためのインタフェース
// infraから使用するメソッドを列挙
type DynamoDBClientRepository interface {
	PutItem(item map[string]*dynamodb.AttributeValue) (*dynamodb.PutItemOutput, error)
	QueryByExpression(indexName string, expr *expression.Expression, exclusiveStartKey map[string]*dynamodb.AttributeValue) (*dynamodb.QueryOutput, error)
}
