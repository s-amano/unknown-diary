package adapter

import (
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
)

// DynamoDBClientRepository - DynamoDBを操作するためのインタフェース
// infraから使用するメソッドを列挙
type DynamoDBClientRepository interface {
	QueryByExpressionNoindex(expr *expression.Expression) (*dynamodb.QueryOutput, error)
	UpdateItem(item map[string]*dynamodb.AttributeValue, expr *expression.Expression) (*dynamodb.UpdateItemOutput, error)
}
