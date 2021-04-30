# unknown-diary
旅行をした帰りの電車の窓から流れる人を見たとき、その人も僕と同じように楽しんだり悲しんだり苦闘しながら生きているのだろうかと思いました。そんな全く見ず知らずの人の人生について考えている時に作りたいと思ったアプリです。ボトルメールをイメージして作りました。[ボトルメールのWikipedia](https://ja.wikipedia.org/wiki/%E3%83%9C%E3%83%88%E3%83%AB%E3%83%A1%E3%83%BC%E3%83%AB)  

このアプリでは、貴方の感動した日、人生の転機になった日、良いことがあった日、失恋した日、奇跡が起きた日などを綴って日記としてPOSTして見知らぬ誰かに届けてください。  
逆に貴方は見知らぬ誰かの想い出のあの日を見ることで、他人の人生の1ページを覗いた気分になれます。

# URL
https://prod.unknown-diary.com/

create accout から
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
- React (UIフレームワークにMaterial UI)(フロントの開発環境はDockerで構築)
- AWS (serverlessframework + cloudformation で構築)
  - Lambda (APIとして利用, 言語はGolang)
  - DyanmoDB (データベース)
  - Cognito (認証)
  - Route53 (名前解決)
  - S3　(Webホスティング)
  - CloudFront (CDN)


# 構成図
<img width="775" alt="infra構成図" src="https://user-images.githubusercontent.com/53635209/114696010-2ac1ed80-9d57-11eb-94d4-a0bf1a3505bf.png">
  
# 機能一覧
- 誰かの日記を取得することができる
- 日記を送信することができる
- 自分の書いた日記を一覧で見ることができる
- 自分の書いた日記の詳細を見ることができる
- 日記にリアクションをつけることができ、それを著者が確認することができる

# 追加予定の機能

