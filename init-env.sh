#!/usr/bin/env bash

touch gradesa/.env
echo "TZ=UTC" >> gradesa/.env
cp gradesa/.env.template gradesa/.env.development
cp gradesa/.env.template gradesa/.env.test
cp gradesa/.env.template gradesa/.env.production

echo "Created .env files"
