using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Areas.GetAll;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Areas.GetAll;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/areas", async (
                GetAreasHandler handler,
                ICurrentUser user) =>
            {
                string? userId = user.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                var result = await handler.Handle(userId);
                if (!result.IsSuccess)
                {
                    return result.Error.ToHttp();
                }

                return Results.Ok(result.Value);
            })
            .RequireAuthorization()
            .WithName("GetAreas");
    }
}

