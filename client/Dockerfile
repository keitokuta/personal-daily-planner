# Node.js 18を使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# 環境変数を設定
ARG REACT_APP_API_URL=http://localhost:5000/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# アプリケーションのソースコードをコピー
COPY . .

# Reactアプリをビルド
RUN npm run build

# Nginxを使用して静的ファイルを配信
FROM nginx:alpine

# ビルドされたファイルをNginxの公開ディレクトリにコピー
COPY --from=0 /app/build /usr/share/nginx/html

# Nginxの設定ファイルをコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ポート80を公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]
