# Architecture Overview

## Applications
- **apps/api**: Express API using Prisma
- **apps/web**: Next.js frontend with English admin and Arabic technician experience
- **packages/shared**: canonical workflow constants, bilingual normalization, shared mappings

## Data Flow
1. User authenticates with JWT
2. API enforces permission checks using canonical English permissions
3. Technician-facing Arabic inputs are normalized into English enums/events
4. Prisma persists normalized records to PostgreSQL
5. Dashboard and reporting endpoints aggregate operational metrics

## Security
- JWT auth
- RBAC + permission middleware
- Audit logging on mutating operations
- Input validation through Zod

## Localization
- Admin UI in English
- Technician UI in Arabic with RTL
- Internal canonical enums in English
