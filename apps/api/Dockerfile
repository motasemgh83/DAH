FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json* ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install
COPY . .
WORKDIR /app/apps/api
RUN npx prisma generate
EXPOSE 4000
CMD ["node", "src/index.js"]
