FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

COPY . .

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node src/index.js"]
