#!/bin/bash
set -e

# Rails の server.pid が残っている場合は削除
rm -f /app/tmp/pids/server.pid

# DB作成（存在しない場合のみ）& Ridgepoleでスキーマ適用
bundle exec rails db:prepare
bundle exec rake ridgepole:apply

exec "$@"
