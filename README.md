# Dar Al HAI Maintenance Management System

A production-style monorepo for a bilingual maintenance management platform.

## Stack

- **Frontend:** Next.js 14
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Containerization:** Docker + docker-compose

## Repository Structure

```text
apps/
  api/        Express + Prisma API
  web/        Next.js UI
packages/
  shared/     shared constants and bilingual normalization
docs/         architecture, API, setup and deployment docs
infra/        extra infrastructure notes
```

## Features Included

- JWT authentication
- RBAC and permission guards
- English admin interface
- Arabic technician interface with RTL
- Bilingual normalization layer
- Maintenance requests
- Work orders
- Scheduling
- Technicians
- Preventive maintenance
- Assets
- Inventory
- Clients / properties / branches / units
- Notifications
- SLA management
- Escalation rules
- Dashboards
- Reporting
- Audit logs
- Attachments metadata
- Internal vs external comments
- Reopen flow
- Approval flow
- KPI tracking
- Cost tracking
- Company settings
- Working hours / holidays
- Search / filters / tags / service categories
- Custom status readiness
- Custom fields readiness

## Demo Credentials

All demo passwords for local development are:

```text
Password123!
```

Demo users:

- superadmin@daralhai.com
- manager@daralhai.com
- supervisor@daralhai.com
- technician1@daralhai.com

## Quick Start (Docker)

1. Copy environment file:

```bash
cp .env.example .env
```

2. Start the system:

```bash
docker-compose up --build
```

3. Run Prisma migration and seed inside the API container:

```bash
docker-compose exec api npx prisma migrate deploy
docker-compose exec api npm run seed
```

4. Open:
- Web: http://localhost:3000
- API: http://localhost:4000
- Health: http://localhost:4000/health

## Quick Start (Local)

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

## Workspace Scripts

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run format
npm run seed
```

## Environment Notes

The root `.env.example` is shared by both apps. The web app only needs `NEXT_PUBLIC_API_URL`.

## API Summary

- `POST /auth/login`
- `GET /auth/me`
- `GET /requests`
- `POST /requests`
- `POST /requests/:id/comments`
- `POST /requests/:id/attachments`
- `POST /requests/:id/approve`
- `POST /requests/:id/reopen`
- `GET /work-orders`
- `POST /work-orders`
- `POST /work-orders/:id/schedule`
- `GET /assets`
- `GET /inventory`
- `GET /reports/dashboard`
- `GET /reports/kpis`
- `GET /reports/costs`
- `GET /settings/company`
- `GET /settings/calendar`
- `GET /admin/overview`
- `GET /technician/overview`

## Notes

- English is the canonical internal workflow language.
- Arabic is used on technician-facing pages only.
- Normalization utilities live in `packages/shared/src/normalization.js`.
