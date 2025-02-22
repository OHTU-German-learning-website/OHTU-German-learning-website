FROM node:18-alpine

WORKDIR /app/gradesa
COPY package*.json ./
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