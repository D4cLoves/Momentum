# Dependency Injection Guide

This document explains how DI is organized in `Momentum.Core/Configuration/DependencyInjection.cs` and how to extend it safely.

## Why We Use `AddScoped`

`Scoped` means one instance per HTTP request.

Use `AddScoped` for:
- Handlers (`*Handler`)
- Use-cases (`*UseCase`)
- Repositories (`*Repository`)
- `UnitOfWork`
- Services that use `DbContext` or current request data

Why: `ApplicationDbContext` is scoped. Any service that depends on it must also be scoped.

## Lifetime Rules

Use `AddSingleton` for:
- Stateless services without request/user/db dependencies
- Pure helpers that only use constants/config snapshots

Use `AddTransient` for:
- Very lightweight objects
- Objects that should be recreated every resolve

Do not inject scoped services into singleton services.

## Current Registration Map

In `DependencyInjection.cs` you currently register:
- Feature handlers (Areas, Projects, Sessions, Users)
- Auth/context adapters (`ICurrentUser`, `ICurrentUserProvider`)
- EF Core + Identity
- Repositories
- Use-cases and auth token services
- Logging/OpenAPI/endpoints scan

This is a good start. Next step is modularization.

## How To Add A New Feature (Template)

Example: add `Tasks` feature.

1. Create handler in Application layer.
2. Create endpoint in Core layer.
3. Add repository interface in Domain/Application contracts.
4. Implement repository in Infrastructure.
5. Register all pieces in DI:

```csharp
services.AddScoped<CreateTaskHandler>();
services.AddScoped<ITaskRepository, TaskRepository>();
```

6. Build + test endpoint.

## How To Refactor DI File (Professional Style)

Goal: keep `AddConfiguration` small and readable.

Recommended split:
- `AddFeatureHandlers()`
- `AddPersistence()`
- `AddAuth()`
- `AddUseCases()`
- `AddObservability()`

Then `AddConfiguration` becomes an orchestrator:

```csharp
services
    .AddFeatureHandlers()
    .AddPersistence(configuration)
    .AddAuth(builder.Configuration)
    .AddUseCases()
    .AddObservability(configuration)
    .AddOpenApiSpec()
    .AddEndpoints(typeof(Program).Assembly);
```

## Practical Checklist Before Commit

- Chosen lifetime matches dependencies (`DbContext` => scoped)
- No scoped dependency inside singleton
- Feature has both handler and endpoint registration
- Interface-to-implementation registration exists
- App starts without DI validation errors
- Basic API call passes (happy path)

## Common DI Mistakes

- Registering repository as singleton while it depends on `DbContext`
- Forgetting to register a new handler
- Duplicating interface registrations with different implementations accidentally
- Putting business logic into endpoints instead of handlers/use-cases

## Your Team Convention (Suggested)

- Default for application/infrastructure services: `AddScoped`
- `AddSingleton` only with explicit reason in code review
- Keep DI grouped by module, not by random order
- Update this file when architecture changes
