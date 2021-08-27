.PHONY: build clean deploy

### プログラムパス
GO          = go
GO_BUILD    = $(GO) build
GO_LDFLAGS  = -ldflags="-s -w"
GOOS        = linux

### ターゲットパラメーター
TARGETS = bin/receiver bin/getter bin/getter-my-diaries bin/reaction-diary bin/update-diary

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

bin/getter-my-diaries: functions/diary-my-getter/main.go
	GOOS=$(GOOS) $(GO_BUILD) $(GO_LDFLAGS) -o $@ $<

bin/reaction-diary: functions/diary-reaction/main.go
	GOOS=$(GOOS) $(GO_BUILD) $(GO_LDFLAGS) -o $@ $<

bin/update-diary: functions/diary-update/main.go
	GOOS=$(GOOS) $(GO_BUILD) $(GO_LDFLAGS) -o $@ $<