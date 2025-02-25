FROM node:18-alpine

WORKDIR /app/gradesa
# Disable Husky during install
ENV HUSKY=0

# Copy package files from gradesa
COPY gradesa/package*.json ./

# Install dependencies (including dev dependencies temporarily)
RUN npm ci --production=false

# Copy app files including .env.production
COPY gradesa/ .

#this builds the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# OpenShift requires non-root user
RUN adduser -D nonroot && chown -R nonroot:nonroot /app/gradesa
USER nonroot

# Next.js needs to listen on 8080
ENV PORT 8080
EXPOSE 8080

CMD ["npm", "start"]