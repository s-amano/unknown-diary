# unknown-diary
旅行をした帰りの電車の窓から流れる人を見たとき、その人も僕と同じように楽しんだり悲しんだり苦闘しながら生きているのだろうかと思いました。そんな全く見ず知らずの人の人生について考えている時に作りたいと思ったアプリです。ボトルメールをイメージして作りました。[ボトルメールのWikipedia](https://ja.wikipedia.org/wiki/%E3%83%9C%E3%83%88%E3%83%AB%E3%83%A1%E3%83%BC%E3%83%AB)  

このアプリでは、貴方の感動した日、人生の転機になった日、良いことがあった日、失恋した日、奇跡が起きた日などを綴って日記としてPOSTして見知らぬ誰かに届けてください。  
逆に貴方は見知らぬ誰かの想い出のあの日を見ることで、他人の人生の1ページを覗いた気分になれます。

# URL
https://prod.unknown-diary.com/

create accout リンクから
一意なユーザー名とパスワードでアカウントを作成し、ログインしてください。

アカウントを作成せずに動作確認したいだけと言う方は、
https://dev.unknown-diary.com/
こちらへ、
```
username: テスト太郎  
password: 12345678
```
へログインしてください。

# 使用した技術など
- React (UIフレームワークにMaterial UI, CSSフレームワークにTailwindCSS)(フロントの開発環境はDockerで構築)
- AWS (serverlessframework + cloudformation で構築)
  - Lambda (APIとして利用, 言語はGolang, 単体テスト)
  - DynamoDB (データベース)
  - Cognito (認証)
  - Route53 (名前解決)
  - S3　(Webホスティング)
  - CloudFront (CDN)

## 補足
フロントエンドはS3 のWebホスティング + CloudFrontで、バックエンドAPIはLambdaで実装、データベースにはDynamoDBという感じです。
認証にはAWS cognitoを利用しています。Amplifyのライブラリを利用しているので、ログイン画面のUIと機能は全てAWSが行ってくれています。
また、デプロイ作業を簡略化できるようにMakefileを作りデプロイコマンドを簡素化した上で、Github Actionsで自動デプロイ環境を作っています。


# 構成図
<img width="775" alt="infra構成図" src="https://user-images.githubusercontent.com/53635209/114696010-2ac1ed80-9d57-11eb-94d4-a0bf1a3505bf.png">

# DynamoDB
				
| HASH Key    | RANGE Key |            |                          |          |                                                        | | |
| ----------- | --------- | ---------- | ------------------------ | -------- | ------------------------------------------------------ |--|--|
| uuid        | post_at   | author               | post_data                | reaction | reactioners                                            | commenters |comments|
| 12345.67890 | 988999898 | テスト太郎 |   {"title":"日記タイトル",content":"テスト日記","date":"2021/08/14"} | 2        | [ { "S" : " テストさん" }, { "S" : "サンプルユーザ" }] | [ { "S" : " abcさん" }, { "S" : "サンプルさん" }] | [ { "S" : " コメントです" }, { "S" : "サンプルコメントです" }] |

## グローバルインデックス
- author-status_post_at-index
HASH KeyをauthorにRANGE Keyをpost_atに指定。  
自分の日記一覧を取得する際に利用
  
# 機能一覧
- 誰かの日記を取得することができる
- 日記を送信することができる
- 自分の書いた日記を一覧で見ることができる
- 自分の書いた日記の詳細を見ることができる
- 日記にリアクションをつけることができ、それを著者が確認することができる
- 日記にコメントを残せる

## API機能補足
### 誰かの日記を取得する
dynamoDBから全件取得したあと、authorが自分でないものをFilterして、ランダムな1件をresponseする

### 日記にリアクションをつけることができ、それを著者が確認することができる
日記のリアクションボタンを押すと、該当の日記をDynamoDBから取得する。押したUserがreactioners配列に含まれていれば、reacrtionの数を1つ減らし、reactionersからUserを排除する。  
押したUserがreactioners配列に含まれていなければ、reactionの数を1つ増やし、reactionersへUserを追加する。

### 日記にコメントを残せる
日記へのコメントは1つのみ残せる。
