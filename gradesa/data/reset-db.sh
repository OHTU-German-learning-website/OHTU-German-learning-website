#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

psql "postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}" -c "DROP SCHEMA public CASCADE;CREATE SCHEMA public;"
cd ../../
npm run db:migrate
echo "Migration DONE"
