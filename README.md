# Momentum

<div align="center">

**Focus tracker platform with streak logic, session analytics, and clean full-stack architecture**

[![Backend](https://img.shields.io/badge/backend-ASP.NET%20Core-black)](#)
[![Frontend](https://img.shields.io/badge/frontend-React%2019%20%2B%20Vite-black)](#)
[![Database](https://img.shields.io/badge/database-PostgreSQL%2018-black)](#)
[![Cache](https://img.shields.io/badge/cache-Redis%207-black)](#)
[![Status](https://img.shields.io/badge/status-active%20development-black)](#)

</div>

---

## Product Idea

Momentum is a productivity system where every session matters.
You run focused sessions, keep your daily streak alive, and see meaningful statistics instead of noisy charts.

Core concept:
- consistency first
- clear daily feedback
- project-level time distribution
- simple UX without dashboard bloat

---

## Feature Set

### Cabinet
- current streak and best streak
- daily session status
- session management flow
- project and area navigation

### Statistics
- top productive days (rolling 30-day window)
- top projects by focused time
- activity insights tied to real session durations
- same dock navigation style as cabinet

### Auth and User Flow
- register/login/logout
- session refresh
- password recovery flow

---

## Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, Radix UI |
| Backend | ASP.NET Core, layered architecture, Serilog |
| Data | PostgreSQL, Redis |
| Quality | ESLint, TypeScript checks, .editorconfig, centralized NuGet versions |
| Infra | Docker Compose |

---

## Architecture

```text
frontend/momentum-web
  React app, UI pages, API client, dock navigation
  Dev server: http://localhost:5173
  /api proxy -> http://localhost:8080

backend/Momentum
  Momentum.Core                    API host, DI, HTTP pipeline, config
  Momentum.Application             use cases, handlers, application contracts
  Momentum.Domain                  entities, business rules
  Momentum.Infrastructure.Postgres repositories and DB integrations
  Momentum.SharedKernel            shared primitives/contracts
  Momentum.IntegrationTests        integration tests
```

Design principle:
- domain and use-case logic are isolated from transport and storage concerns.

---

## Quick Start

## 1) Docker (recommended for backend infra)

Set required email variables:

```powershell
$env:EMAIL_USERNAME="your_smtp_user"
$env:EMAIL_PASSWORD="your_smtp_password"
$env:EMAIL_FROM_EMAIL="you@example.com"
```

Start services:

```powershell
cd backend/Momentum
docker compose up -d --build
```

Service endpoints:
- API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

## 2) Local Development

### Backend

```powershell
cd backend/Momentum
dotnet restore Momentum.sln
dotnet build Momentum.sln
dotnet run --project Momentum.Core
```

Default launch URLs:
- `http://localhost:5271`
- `https://localhost:7206`

### Frontend

```powershell
cd frontend/momentum-web
npm install
npm run dev
```

Frontend URL:
- `http://localhost:5173`

---

## Common Commands

```powershell
# Backend
cd backend/Momentum
dotnet build Momentum.sln
dotnet test Momentum.sln

# Frontend
cd frontend/momentum-web
npm run dev
npm run build
npm run lint
```

---

## Configuration Map

- Backend app settings:
  `backend/Momentum/Momentum.Core/appsettings.json`
- Local launch profiles:
  `backend/Momentum/Momentum.Core/Properties/launchSettings.json`
- Docker services:
  `backend/Momentum/docker-compose.yml`
- Backend build/analyzers:
  `backend/Momentum/Directory.Build.props`
- Centralized NuGet versions:
  `backend/Momentum/Directory.Packages.props`
- Frontend proxy config:
  `frontend/momentum-web/vite.config.ts`

---

## Repository Layout

```text
.
|- backend/
|  `- Momentum/
|     |- Momentum.Core/
|     |- Momentum.Application/
|     |- Momentum.Domain/
|     |- Momentum.Infrastructure.Postgres/
|     |- Momentum.SharedKernel/
|     `- Momentum.IntegrationTests/
`- frontend/
   `- momentum-web/
```

---

## Documentation

- `backend/Momentum/docs/DependencyInjection.Guide.md`
- `backend/Momentum/docs/DependencyInjection.Guide.ru.md`

---

## Roadmap

- improve frontend build health (remove remaining TS lint/build noise)
- extend statistics with richer time-series views
- add CI quality gates for backend + frontend
- add release notes automation

---

## Project Status

Active development with recent focus on statistics UX, streak visibility, and cleaner cross-page navigation behavior.
