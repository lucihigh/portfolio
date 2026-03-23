# Fullstack Portfolio For Render

Modern fullstack personal portfolio with:

- `client/`: React + Vite + TypeScript + TailwindCSS + React Hook Form + Framer Motion
- `server/`: Express + TypeScript + Prisma + PostgreSQL + JWT auth
- Demo seed data for an IT student / fullstack developer profile
- Public site and protected admin CMS in one project
- Render-ready deployment config via `render.yaml`

## Features

### Public site

- Hero section with avatar, headline, CTA buttons, and CV download
- About, strengths, and career goals
- Skills grouped by category
- Activity / experience timeline
- Projects with tech stack, GitHub, and demo links
- Achievements and certificates
- Testimonials
- Contact section
- Basic SEO support: title, description, favicon
- Responsive layout with light motion and dark mode toggle

### Admin site

- Admin login with email + password
- JWT-protected admin routes
- Dashboard overview
- CRUD management for:
  - profile
  - skills
  - activities
  - projects
  - achievements
  - testimonials
  - contact links
  - site settings
- Confirmation dialog before delete
- Toast notifications for success / error

## Project structure

```text
.
├─ client/
├─ server/
├─ render.yaml
├─ .env.example
└─ README.md
```

## Tech stack

- Frontend: React, Vite, TypeScript
- UI: TailwindCSS, custom reusable UI components
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT
- Password hashing: bcryptjs
- Validation: Zod
- HTTP client: Axios
- Forms: React Hook Form
- Animation: Framer Motion
- Icons: Lucide React

## Local setup

### 1. Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+

### 2. Install dependencies

From the repo root:

```bash
npm install
```

### 3. Create env files

Copy these files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Update values as needed.

### 4. Create PostgreSQL database

Create a database named `portfolio_db`, then set `DATABASE_URL` in `server/.env`.

Example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_db?schema=public
```

### 5. Generate Prisma client

```bash
npm run prisma:generate
```

### 6. Run migrations

```bash
cd server
npx prisma migrate deploy
```

For local development, `prisma migrate dev` also works:

```bash
cd server
npx prisma migrate dev --name init
```

### 7. Seed demo data

```bash
npm run seed
```

Notes:

- The seed is safe to run multiple times.
- It creates demo content only when a table is empty.
- It also creates or updates the admin account from env.

### 8. Start development servers

Terminal 1:

```bash
npm run dev:server
```

Terminal 2:

```bash
npm run dev:client
```

Default URLs:

- Public site: `http://localhost:5173`
- API: `http://localhost:5000`
- Admin login: `http://localhost:5173/admin/login`

## Default demo admin

From env defaults:

- Email: `admin@example.com`
- Password: `Admin@12345`

Change these in `server/.env` before production.

## API overview

Base URL:

```text
/api
```

Public endpoint:

- `GET /public`

Auth:

- `POST /auth/login`

Protected admin endpoints:

- `GET /profile`
- `PUT /profile`
- `GET /skills`
- `POST /skills`
- `PUT /skills/:id`
- `DELETE /skills/:id`
- `GET /activities`
- `POST /activities`
- `PUT /activities/:id`
- `DELETE /activities/:id`
- `GET /projects`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`
- `GET /achievements`
- `POST /achievements`
- `PUT /achievements/:id`
- `DELETE /achievements/:id`
- `GET /testimonials`
- `POST /testimonials`
- `PUT /testimonials/:id`
- `DELETE /testimonials/:id`
- `GET /contacts`
- `POST /contacts`
- `PUT /contacts/:id`
- `DELETE /contacts/:id`
- `GET /settings`
- `PUT /settings`

## Render deployment

This repo includes `render.yaml`.

### Option A: Blueprint deploy

1. Push the repository to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Connect your GitHub repo.
4. Render will read `render.yaml` and propose:
   - PostgreSQL database
   - backend web service
   - frontend static site
5. Fill in required environment variables:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
6. Deploy.

### Option B: Manual deploy

#### 1. Create PostgreSQL on Render

1. In Render, click `New +` -> `PostgreSQL`.
2. Name it `portfolio-db`.
3. Copy the internal or external connection string.
4. Set that value as `DATABASE_URL` in the backend service.

#### 2. Deploy backend service

Create a new Web Service with:

- Root directory: `server`
- Build command:

```bash
npm install && npm run prisma:generate && npm run build
```

- Start command:

```bash
npm run start
```

- Pre-deploy command:

```bash
npm run prisma:migrate:deploy && npm run seed
```

Environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=https://your-frontend-domain.onrender.com`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SERVER_PORT=10000`

#### 3. Deploy frontend static site

Create a new Static Site with:

- Root directory: `client`
- Build command:

```bash
npm install && npm run build
```

- Publish directory:

```text
dist
```

Environment variables:

- `VITE_API_URL=https://your-backend-domain.onrender.com/api`

Static site rewrite rule:

- Source: `/*`
- Destination: `/index.html`

### Important production notes

- Set `CLIENT_URL` on the backend to your real frontend domain.
- Set `VITE_API_URL` on the frontend to your real backend API domain.
- Use a strong random `JWT_SECRET`.
- Change `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Because uploaded files are URL-based, no local file storage is required.

## Build commands summary

Root:

```bash
npm run build
```

Backend only:

```bash
npm run build --workspace server
```

Frontend only:

```bash
npm run build --workspace client
```

## Useful scripts

Root:

```bash
npm run dev:server
npm run dev:client
npm run build
npm run seed
npm run prisma:generate
```

Server:

```bash
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
npm run seed
```

## Notes for customization

- Replace all demo profile content from the admin dashboard.
- Replace demo image URLs, social links, and CV URL.
- Update seed content if you want a different default persona.
- The current admin UI uses URL-based media fields to stay Render-friendly.

## Current status

- Client build: passed
- Server build: passed
- Prisma migration: included in `server/prisma/migrations/0001_init`
