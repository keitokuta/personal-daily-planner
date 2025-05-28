# Node.js 18を使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# アプリケーションのソースコードをコピー
COPY . .

# ポート5000を公開
EXPOSE 5000

# 非rootユーザーを作成してセキュリティを向上
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# アプリケーションファイルの所有者を変更
RUN chown -R nodejs:nodejs /app
USER nodejs

# アプリケーションを起動
CMD ["npm", "start"]
