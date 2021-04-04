package usecase

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/s-amano/unknown-diary/backend/comconfirm-lambda/functions/diary-receiver/adapter"
)

// ReceiverJob は、受け取ったポストデータをを処理するジョブを表すレポジトリです
type ReceiverJob struct {
	DynamoDBRepo adapter.DynamoDBClientRepository
}

// Run メソッドは、受け取ったポストデータを実際に処理します
func (c *ReceiverJob) Run(ctx context.Context, apiGWEvent events.APIGatewayProxyRequest, result *events.APIGatewayProxyResponse) error {
	var err error

	return err
}
