# Momentum Backend

## Projects

- `Momentum.Core` - ASP.NET Core host, endpoints, DI, and runtime configuration.
- `Momentum.Domain` - domain entities and business rules.
- `Momentum.Infrastructure.Postgres` - infrastructure layer for PostgreSQL integrations.

## Build and run

```powershell
dotnet restore Momentum.sln
dotnet build Momentum.sln
dotnet run --project Momentum.Core
```
