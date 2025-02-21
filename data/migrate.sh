#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

echo "Migrating"
pgmigrate migrate -d postgres://ohtu:password@localhost:7742/gradesa -m migrations
echo "Migrating done"

# We generate the schema file to make sure that the schema is up to date
# The github workflow will check for uncommitted changes and fail if there is 
# a difference between the schema file and the actual schema in the database
pgmigrate dump -d postgres://ohtu:password@localhost:7742/gradesa --out schema.sql
echo "Dumping done"