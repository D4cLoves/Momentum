using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Projects.Create;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Projects.Create;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/projects", async (
                [FromServices] CreateProjectHandler handler,
                [FromServices] ICurrentUser user,
                [FromBody] CreateProjectRequest request) =>
            {
                string? userId = user.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                var result = await handler.Handle(userId, request);
                if (!result.IsSuccess)
                {
                    return result.Error.ToHttp();
                }

                return Results.Created($"/api/projects/{result.Value.Id}", result.Value);
            })
            .RequireAuthorization()
            .WithName("CreateProject");
    }
}


