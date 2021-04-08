.PHONY: build clean deploy

### ターゲットパラメーター
TARGETS = bin/receiver bin/getter

build: $(TARGETS)
clean:
	rm -rf ./bin
deploy: clean build
	sls deploy --verbose

### Lambda function のビルドルール
bin/receiver: functions/diary-receiver/main.go
	GOOS=linux go build -ldflags="-s -w" -o $@ $<

bin/getter: functions/diary-getter/main.go
	GOOS=linux go build -ldflags="-s -w" -o $@ $<