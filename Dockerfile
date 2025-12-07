FROM node:18-alpine

# Disable Husky during install
ENV HUSKY=0

# Can be overriden by setting build-args when building image
ARG DB_HOST="localhost"
ARG DB_PORT="5432"
ARG DB_USER="postgres"
ARG DB_PASSWORD="password"
ARG DB_NAME="postgres"
ARG SESSION_SECRET="secret"
ARG NODE_ENV="production"
# NOTE: The above args and the following ENVs are overridden
# by .env and .env.$NODE_ENV file contents if they exist
# so these apply ONLY when ./init-env.sh has not been run

RUN apk update && \
    apk add --no-cache wget && \
    wget https://github.com/peterldowns/pgmigrate/releases/download/v0.0.6%2Bcommit.4f90829/pgmigrate-linux-amd64 -O /usr/local/bin/pgmigrate && \
    chmod +x /usr/local/bin/pgmigrate

RUN apk add --no-cache postgresql-client

# OpenShift requires non-root user
RUN adduser -D nonroot
USER nonroot

WORKDIR /app/gradesa

# Copy package files from gradesa
COPY --chown=nonroot:nonroot gradesa/package*.json ./

# Set default environment variables for build
ENV SESSION_SECRET=$SESSION_SECRET \
    DB_HOST=$DB_HOST \
    DB_PORT=$DB_PORT \
    DB_USER=$DB_USER \
    DB_PASSWORD=$DB_PASSWORD \
    DB_NAME=$DB_NAME \
    NODE_ENV=$NODE_ENV

# Install ALL dependencies (including dev) for build
RUN npm ci

# Copy app files including .env.production
COPY --chown=nonroot:nonroot gradesa/ .

#This is for memory optimizing
ENV NODE_OPTIONS="--max-old-space-size=8192"

#this builds the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# Copy static files to .next/standalone, this is not done automatically
RUN cp -r .next/static .next/standalone/.next
RUN cp -r public .next/standalone/


# Next.js needs to listen on 8080
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "start:standalone"]
