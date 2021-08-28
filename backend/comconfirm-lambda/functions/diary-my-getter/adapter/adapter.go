package adapter

import (
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
)

// DynamoDBClientRepository - DynamoDBを操作するためのインタフェース
// infraから使用するメソッドを列挙
type DynamoDBClientRepository interface {
	QueryByExpressionWithLimit(indexName string, expr *expression.Expression, exclusiveStartKey map[string]*dynamodb.AttributeValue, limit *int64) (*dynamodb.QueryOutput, error)
}
