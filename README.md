# Secure Task Manager

A production-ready Task Management Application built for the technical assessment described in the uploaded PDF. It includes authentication, JWT stored in HTTP-only cookies, task CRUD, encrypted task descriptions, pagination, filtering, search, and protected frontend routes. fileciteturn0file0

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- JWT + HTTP-only cookies
- AES-256-CBC encryption for task descriptions

## Features
- User registration and login
- Password hashing with bcryptjs
- JWT authentication in HTTP-only cookies
- Secure cookie configuration
- CRUD APIs for task management
- Authorization so users access only their own tasks
- Task listing pagination
- Task filtering by status
- Task search by title
- Protected frontend routes using middleware
- Validation using Zod
- Structured error responses and proper HTTP status codes
- Environment variables for secrets and DB connection

## Setup
1. Extract the zip.
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Fill in your PostgreSQL `DATABASE_URL`, `JWT_SECRET`, and `ENCRYPTION_KEY`
5. Run `npx prisma generate`
6. Run `npx prisma db push`
7. Run `npm run dev`

## Deploy
### Vercel + Neon / Railway PostgreSQL
- Push the project to GitHub
- Import the repo into Vercel
- Add environment variables from `.env.example`
- Make sure your Postgres database is reachable from Vercel
- Build command: `npm run build`
- Start command: `npm run start`

## API Examples
### Register
`POST /api/auth/register`
```json
{
  "name": "Aryan Kumar",
  "email": "aryan@example.com",
  "password": "StrongPass1"
}
```

### Login
`POST /api/auth/login`
```json
{
  "email": "aryan@example.com",
  "password": "StrongPass1"
}
```

### Create Task
`POST /api/tasks`
```json
{
  "title": "Prepare interview notes",
  "description": "Review architecture and auth flow",
  "status": "OPEN"
}
```

### List Tasks
`GET /api/tasks?page=1&limit=5&status=OPEN&search=interview`

## Architecture
- `src/app/api/*` contains backend API routes
- `src/lib/*` contains reusable utilities for auth, crypto, DB, and validation
- `prisma/schema.prisma` defines the database schema
- `middleware.ts` protects frontend routes
- `src/app/dashboard` contains the authenticated UI

## Notes
- Sensitive task description data is encrypted before storing in the database.
- Cookies are set as HTTP-only and secure in production.
- This project is ready for deployment after adding valid env values.
