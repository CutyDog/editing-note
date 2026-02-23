#!/bin/bash
set -e

# Rails の server.pid が残っている場合は削除
rm -f /app/tmp/pids/server.pid

exec "$@"
