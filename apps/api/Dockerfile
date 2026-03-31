FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

COPY . .

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node src/index.js"]
