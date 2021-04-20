.PHONY: all clean modclean mod build serve lint sync_s3

### レポジトリ上の定数等
NODE_MODULES_DIR = ./node_modules

### 環境パラメータ
STAGE=dev
# AWSプロフィール
AWS_PROFILE=amagai


# S3 同期用のコピー元
WEB_CONTENTS_SRC = ./build

# S3 同期用のコピー先
ifeq ($(STAGE),prod)
  WEB_CONTENTS_S3 = s3://prod.unknown-diary.com
else
  WEB_CONTENTS_S3 = s3://dev.unknown-diary.com
endif

all: build

clean:
	rm -rf $(WEB_CONTENTS_SRC)

mod:
	[ -d $(NODE_MODULES_DIR) ] || npm install

build: mod
	[ -d $(WEB_CONTENTS_SRC) ] || npm run $(STAGE)

serve: mod
	npm run serve

lint: mod
	npm run lint

sync_s3: build
	aws --profile $(AWS_PROFILE) s3 sync $(WEB_CONTENTS_SRC) $(WEB_CONTENTS_S3)