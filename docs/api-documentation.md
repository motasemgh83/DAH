# API Documentation

## Authentication
### POST /auth/login
```json
{"email":"technician1@daralhai.com","password":"Password123!"}
```

### GET /auth/me
Returns current user and permissions.

## Requests
### GET /requests
Supports query params: status, priority, search, clientId, assignedToId

### POST /requests
Create maintenance request.

### POST /requests/:id/comments
Add comment.

### POST /requests/:id/attachments
Add attachment metadata.

### POST /requests/:id/approve
Approval flow.

### POST /requests/:id/reopen
Reopen flow.

## Work Orders
### GET /work-orders
### POST /work-orders
### POST /work-orders/:id/schedule

## Reporting
- `GET /reports/dashboard`
- `GET /reports/kpis`
- `GET /reports/costs`

## Settings
- `GET /settings/company`
- `PUT /settings/company`
- `GET /settings/calendar`
- `PUT /settings/calendar`
