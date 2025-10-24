#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"
echo $(pwd)
echo "Migrating"
# Get database connection details from environment variables if available, otherwise use defaults
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-7742}
DB_USER=${DB_USER:-ohtu}
DB_PASSWORD=${DB_PASSWORD:-password}
DB_NAME=${DB_NAME:-gradesa}

# Construct the database connection string
DB_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Run the migration
pgmigrate migrate -d "$DB_URL" -m migrations
echo "Migrating done"

# Check if --skip-schema-gen flag is provided
if [[ "$*" == *--skip-schema-gen* ]]; then
  echo "Skipping schema generation"
  exit 0
fi


# We generate the schema file to make sure that the schema is up to date
# The github workflow will check for uncommitted changes and fail if there is 
# a difference between the schema file and the actual schema in the database

# Create a temporary schema file inside the container
pgmigrate dump -d $DB_URL --out schema.sql

echo "Dumping done"
