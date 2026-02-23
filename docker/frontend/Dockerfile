FROM node:20-slim

WORKDIR /app

# npm install のためのビルド用パッケージ（必要に応じて追加）
# RUN apt-get update && apt-get install -y git

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
