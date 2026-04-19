using Momentum.Application.Features.Streak.Abstraction;
using Momentum.Core.Common.Auth;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Streak.GetCurrent;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/streak", async (
                IStreakService streakService,
                ICurrentUser user) =>
            {
                string? userId = user.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                var response = await streakService.GetCurrentAsync(userId);
                return Results.Ok(response);
            })
            .RequireAuthorization()
            .WithName("GetStreak");
    }
}
