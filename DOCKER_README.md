# Personal Daily Planner - Docker セットアップガイド

## 概要
このプロジェクトをローカルのDockerで実行するためのガイドです。

## 前提条件
- Docker Desktop がインストールされていること
- Docker Compose が利用可能であること

## プロジェクト構成
```
personal-daily-planner/
├── client/                 # React フロントエンド
│   ├── Dockerfile         # 本番用 Dockerfile
│   ├── Dockerfile.dev     # 開発用 Dockerfile
│   ├── nginx.conf         # Nginx 設定
│   └── .dockerignore      # Docker ignore ファイル
├── server/                 # Node.js バックエンド
│   ├── Dockerfile         # 本番用 Dockerfile
│   ├── Dockerfile.dev     # 開発用 Dockerfile
│   └── .dockerignore      # Docker ignore ファイル
├── docker-compose.yml      # 本番用 Docker Compose
└── docker-compose.dev.yml # 開発用 Docker Compose
```

## 使用方法

### 本番モードで起動
```bash
# アプリケーションをビルドして起動
docker-compose up --build

# バックグラウンドで起動
docker-compose up -d --build
```

### 開発モードで起動（ホットリロード有効）
```bash
# 開発モードで起動
docker-compose -f docker-compose.dev.yml up --build

# バックグラウンドで起動
docker-compose -f docker-compose.dev.yml up -d --build
```

## アクセス URL

### 本番モード
- **フロントエンド**: http://localhost:3000
- **バックエンド API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

### 開発モード
- **フロントエンド**: http://localhost:3000 (ホットリロード有効)
- **バックエンド API**: http://localhost:5000/api (nodemon有効)
- **MongoDB**: localhost:27017

## Docker コマンド

### アプリケーションの停止
```bash
# 本番モード
docker-compose down

# 開発モード
docker-compose -f docker-compose.dev.yml down
```

### ボリュームも含めて完全削除
```bash
# 本番モード
docker-compose down -v

# 開発モード
docker-compose -f docker-compose.dev.yml down -v
```

### ログの確認
```bash
# 全サービスのログ
docker-compose logs

# 特定のサービスのログ
docker-compose logs server
docker-compose logs client
docker-compose logs mongo

# リアルタイムでログを追跡
docker-compose logs -f
```

### コンテナの状態確認
```bash
docker-compose ps
```

### コンテナに接続
```bash
# サーバーコンテナに接続
docker-compose exec server sh

# MongoDBコンテナに接続
docker-compose exec mongo mongosh
```

## 環境変数

### サーバー環境変数
- `PORT`: サーバーポート (デフォルト: 5000)
- `MONGODB_URI`: MongoDB接続文字列
- `JWT_SECRET`: JWT署名用シークレット
- `NODE_ENV`: 実行環境 (development/production)

### クライアント環境変数
- `REACT_APP_API_URL`: バックエンドAPIのURL

## データベース

### MongoDB データの永続化
データは Docker ボリュームに保存されます：
- 本番モード: `mongo_data`
- 開発モード: `mongo_data_dev`

### データベースの初期化
```bash
# データベースをリセット
docker-compose down -v
docker-compose up --build
```

## トラブルシューティング

### ポートが既に使用されている場合
```bash
# 使用中のポートを確認
netstat -an | findstr :3000
netstat -an | findstr :5000
netstat -an | findstr :27017

# プロセスを終了
taskkill /PID <プロセスID> /F
```

### イメージの再ビルド
```bash
# キャッシュを使わずに再ビルド
docker-compose build --no-cache

# 特定のサービスのみ再ビルド
docker-compose build --no-cache server
```

### Docker システムのクリーンアップ
```bash
# 未使用のイメージ、コンテナ、ネットワークを削除
docker system prune

# ボリュームも含めて削除
docker system prune -a --volumes
```

## 開発時の注意事項

1. **ホットリロード**: 開発モードではファイルの変更が自動的に反映されます
2. **ポート競合**: ローカルで既にサービスが動いている場合はポートを変更してください
3. **データ永続化**: 開発用と本番用でデータベースボリュームが分離されています
4. **環境変数**: 必要に応じて `.env.docker` ファイルを編集してください

## セキュリティ注意事項

1. **JWT_SECRET**: 本番環境では強力なランダム文字列を使用してください
2. **MongoDB**: 本番環境では認証を有効にしてください
3. **ネットワーク**: 必要に応じてファイアウォール設定を行ってください
