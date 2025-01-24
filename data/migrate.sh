#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

echo "Migrating"
echo "$(dirname "$0")"
echo "$(pwd "$0")"
ls -la
pgmigrate migrate -d postgres://ohtu:password@localhost:6543/gradesa -m migrations
echo "Migrating done"

# We generate the schema file to make sure that the schema is up to date
# The github workflow will check for uncommitted changes and fail if there is 
# a difference between the schema file and the actual schema in the database
pgmigrate dump -d postgres://ohtu:password@localhost:6543/gradesa --out schema.sql
echo "Dumping done"
