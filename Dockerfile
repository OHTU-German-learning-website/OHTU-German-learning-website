FROM node:18-alpine

WORKDIR /app/gradesa
# Disable Husky during install
ENV HUSKY=0

COPY package*.json ./
COPY gradesa/package*.json ./

RUN npm ci --omit=dev
COPY . .

RUN npm run build

# OpenShift requires non-root user
RUN adduser -D nonroot && chown -R nonroot:nonroot /app/gradesa
USER nonroot

# Next.js needs to listen on 8080
ENV PORT 8080
EXPOSE 8080

CMD ["npm", "start"]