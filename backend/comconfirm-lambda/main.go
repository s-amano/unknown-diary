package main

import (
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Response struct {
	Body string `body`
}

// ss

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	res := Response{Body: "Secret API!"}
	jsonBytes, _ := json.Marshal(res)

	return events.APIGatewayProxyResponse{
		Body:       string(jsonBytes),
		Headers:    map[string]string{"Access-Control-Allow-Origin": "*"},
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handler)
}
