using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Momentum.Core.Common.Auth;
using Momentum.Core.EndpointsSettings;
using Momentum.Infrastructure.Data.Identity;

namespace Momentum.Core.Features.Users.Me;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/me", async (
                ICurrentUser currentUser,
                UserManager<ApplicationUser> userManager) =>
            {
                string? userId = currentUser.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                ApplicationUser? user = await userManager.FindByIdAsync(userId);
                if (user is null)
                {
                    return Results.NotFound();
                }

                return Results.Ok(new CurrentUserResponse(
                    user.Id,
                    user.UserName,
                    user.Email));
            })
            .RequireAuthorization()
            .WithName("GetCurrentUser");
    }
}

public sealed record CurrentUserResponse(
    string Id,
    string? Name,
    string? Email);
