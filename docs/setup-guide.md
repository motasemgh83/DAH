# Setup Guide

## Docker
1. Copy `.env.example` to `.env`
2. Run `docker-compose up --build`
3. Run:
   - `docker-compose exec api npx prisma migrate deploy`
   - `docker-compose exec api npm run seed`

## Local
1. Ensure Node.js 20+ and PostgreSQL 16+
2. Create database `daralhai`
3. Copy `.env.example` to `.env`
4. Run:
   - `npm install`
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
   - `npm run seed`
   - `npm run dev`
