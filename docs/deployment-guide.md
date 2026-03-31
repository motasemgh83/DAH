# Deployment Guide

## Docker Compose
Use the provided `docker-compose.yml`.

## Recommended Production Hardening
- Replace default JWT secret
- Put web and api behind a reverse proxy
- Store attachment files in S3 or equivalent
- Use managed PostgreSQL
- Enable HTTPS
- Add centralized logging and monitoring

## Suggested Reverse Proxy Targets
- `/` -> Next.js web
- `/api` -> Express API
