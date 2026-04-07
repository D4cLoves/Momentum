# Momentum Backend

## Projects

- `Momentum.Core` - ASP.NET Core host, endpoints, DI, and runtime configuration.
- `Momentum.Application` - use-case handlers and application contracts (ports).
- `Momentum.Domain` - domain entities and business rules.
- `Momentum.Infrastructure.Postgres` - infrastructure layer for PostgreSQL integrations.
- `Momentum.SharedKernel` - shared contracts (`Result`, `Error`, auth constants/settings).
- `Momentum.IntegrationTests` - end-to-end API integration tests for auth and protected flows.

## Build and run

```powershell
dotnet restore Momentum.sln
dotnet build Momentum.sln
dotnet run --project Momentum.Core
dotnet test Momentum.sln
```

## Docs

- DI guide: `E:\bjmbf\LifeCoding\C shurp\c sharp\Momentum\backend\Momentum\docs\DependencyInjection.Guide.md`
- DI guide (RU): `E:\bjmbf\LifeCoding\C shurp\c sharp\Momentum\backend\Momentum\docs\DependencyInjection.Guide.ru.md`
