#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

psql "postgres://ohtu:password@localhost:7742/gradesa" -c "DROP SCHEMA public CASCADE;CREATE SCHEMA public;"
cd ../
pnpm run db:migrate
echo "Migration DONE"