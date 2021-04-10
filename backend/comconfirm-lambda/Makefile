.PHONY: build clean deploy

### プログラムパス
GO          = go
GO_BUILD    = $(GO) build
GO_LDFLAGS  = -ldflags="-s -w"
GOOS        = linux

### ターゲットパラメーター
TARGETS = bin/receiver bin/getter

### 環境 dev or prod prodの場合は 手動で指定
STAGE=dev

build: $(TARGETS)

clean:
	rm -rf ./bin

deploy: clean build serverless.yml
	SLS_DEBUG=* sls deploy --verbose --stage $(STAGE)

undeploy: clean build serverless.yml
	SLS_DEBUG=* sls remove --verbose --stage $(STAGE)

### Lambda function のビルドルール
bin/receiver: functions/diary-receiver/main.go
	GOOS=$(GOOS) $(GO_BUILD) $(GO_LDFLAGS) -o $@ $<

bin/getter: functions/diary-getter/main.go
	GOOS=$(GOOS) $(GO_BUILD) $(GO_LDFLAGS) -o $@ $<