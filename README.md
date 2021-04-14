# unknown-diary
見知らぬ誰かの人生の1ページを覗くことができるアプリです。
逆に自分の日記をこっそり見知らぬ誰かに送ることができます。

# URL
https://unknown-diary.com/
一意なユーザー名とパスワードでアカウントを作成し、ログインしてください。

# 使用した技術など
- React
- AWS (serverlessframework + cloudformation で構築)
  - Lambda (APIとして利用, 言語はGolang)
  - DyanmoDB (データベース)
  - Cognito (認証)
  - Route53 (名前解決)
  - S3　(Webホスティング)
  - CloudFront (CDN)
  
# 機能一覧
- 誰かの日記を取得することができる
- 日記を送信することができる

# 追加予定の機能
- 自分の書いた日記を一覧で見ることができる
- 日記にリアクションをつけることができ、それを著者が確認することができる
