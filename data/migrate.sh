#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"
cd ..

pgmigrate migrate -d postgres://ohtu:password@localhost:6543/gradesa -m data/migrations
