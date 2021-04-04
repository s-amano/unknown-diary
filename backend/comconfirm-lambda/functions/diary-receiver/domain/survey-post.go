package domain

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"

	"github.com/google/uuid"
)

// Post はクライアントからのポスト内容を表現する構造体です
type Post struct {
	ID                   string
	Time                 time.Time
	Header               url.Values
	MarshaledHeader      string
	QueryString          url.Values
	MarshaledQueryString string
	Body                 string
	PostForm             interface{}
	MarshaledPostForm    string
}

// NewPost - API Gateway のリクエスト情報から Post オブジェクトを生成
func NewPost(request events.APIGatewayProxyRequest, campaignRecordName, categoryRecordName string) (*Post, error) {
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
	result.Header = request.MultiValueHeaders
	result.QueryString = request.MultiValueQueryStringParameters
	result.Body = request.Body

	// BODY 文字列をパースし PostForm にセット
	if err := result.parseRequestBody(); err != nil {
		return nil, err
	}

	// Marshaled* メンバをセット
	if err := result.marshalJSON(); err != nil {
		return nil, err
	}

	return result, nil
}

// parseRequestBody - ヘッダから Content-Type を抽出し、その型に従って Body をパースする
func (sp *Post) parseRequestBody() error {
	var err error
	var contentType = ""
	// Content-Type ヘッダとして認識する文字列。ある程度のバリエーションに対応する
	var contentTypeKeys = []string{
		"content-type", "Content-Type", "CONTENT-TYPE",
	}

	// ヘッダから Content-Type の文字列を参照する
	for _, contentTypeKey := range contentTypeKeys {
		// Content-Type をあらかじめ小文字に変換して使用する
		contentType = strings.ToLower(sp.Header.Get(contentTypeKey))
		// 何か値の入っているものがヒットした場合にはループ処理を抜ける
		if contentType != "" {
			break
		}
	}

	// Content-Type に "json" が含まれる場合
	if strings.Index(contentType, "json") >= 0 {
		// Body を JSON デコードする
		if err = json.Unmarshal([]byte(sp.Body), &sp.PostForm); err != nil {
			return err
		}
		return nil
	}

	if strings.Index(contentType, "urlencoded") >= 0 {
		var postForm url.Values
		if postForm, err = url.ParseQuery(sp.Body); err != nil {
			return err
		}
		sp.PostForm = postForm

		return nil
	}
	return fmt.Errorf("invalid Content-Type specified : %s", contentType)
}

// marshalJSON - Header, QueryString を JSON エンコードし MarshaledHeader, MarshaledQueryString に格納する
func (sp *Post) marshalJSON() error {
	var err error
	var header, queryString, postForm []byte

	if header, err = json.Marshal(sp.Header); err != nil {
		return err
	}
	if queryString, err = json.Marshal(sp.QueryString); err != nil {
		return err
	}
	if postForm, err = json.Marshal(sp.PostForm); err != nil {
		return err
	}

	sp.MarshaledHeader = string(header)
	sp.MarshaledQueryString = string(queryString)
	sp.MarshaledPostForm = string(postForm)

	return nil
}
