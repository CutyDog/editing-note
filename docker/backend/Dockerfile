FROM ruby:3.3-slim

# 必要なパッケージのインストール
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    libpq-dev \
    libyaml-dev \
    pkg-config \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Gemfile を先にコピーして bundle install（キャッシュ効率化）
COPY Gemfile Gemfile.lock ./
RUN bundle install

# アプリケーションコードをコピー
COPY . .

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
