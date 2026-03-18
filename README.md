# Momentum

Backend-first ASP.NET Core project with layered architecture and strict static analysis defaults.

## Repository layout

- `backend/Momentum` - solution root.
- `backend/Momentum/Momentum.Core` - API host and application entry point.
- `backend/Momentum/Momentum.Domain` - domain model and business entities.
- `backend/Momentum/Momentum.Infrastructure.Postgres` - infrastructure layer for PostgreSQL integrations.

## Quality defaults

- Centralized package versions: `backend/Momentum/Directory.Packages.props`.
- Shared build settings and analyzers: `backend/Momentum/Directory.Build.props`.
- Style and code rules: `backend/Momentum/.editorconfig`.

## Run locally

```powershell
cd backend/Momentum
dotnet restore
dotnet run --project Momentum.Core
```

Default local URLs are configured in:

- `backend/Momentum/Momentum.Core/Properties/launchSettings.json`

## Build

```powershell
cd backend/Momentum
dotnet build Momentum.sln
```
