FROM node:18-alpine

WORKDIR /app/gradesa
# Disable Husky during install
ENV HUSKY=0

# Set default environment variables for build

ENV SESSION_SECRET=secret \

    DB_HOST=localhost \

    DB_PORT=5432 \

    DB_USER=postgres \

    DB_PASSWORD=password \

    DB_NAME=postgres

RUN apk update && \
    apk add --no-cache wget && \
    wget https://github.com/peterldowns/pgmigrate/releases/download/v0.0.6%2Bcommit.4f90829/pgmigrate-linux-amd64 -O /usr/local/bin/pgmigrate && \
    chmod +x /usr/local/bin/pgmigrate

# Copy package files from gradesa
COPY gradesa/package*.json ./

# Install ALL dependencies (including dev) for build
RUN npm i

# Copy app files including .env.production
COPY gradesa/ .

#This is for memory optimizing
ENV NODE_OPTIONS="--max-old-space-size=8192"

#this builds the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# OpenShift requires non-root user
RUN adduser -D nonroot && chown -R nonroot:nonroot /app/gradesa
USER nonroot

# Next.js needs to listen on 8080
ENV PORT=8080
EXPOSE 8080



CMD ["npm", "start"]