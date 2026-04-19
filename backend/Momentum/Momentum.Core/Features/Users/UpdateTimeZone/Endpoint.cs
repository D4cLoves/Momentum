using Microsoft.AspNetCore.Identity;
using Momentum.Core.Common.Auth;
using Momentum.Core.EndpointsSettings;
using Momentum.Infrastructure.Data.Identity;
using System.Linq;

namespace Momentum.Core.Features.Users.UpdateTimeZone;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/users/me/timezone", async (
                UpdateUserTimeZoneRequest request,
                ICurrentUser currentUser,
                UserManager<ApplicationUser> userManager) =>
            {
                string? userId = currentUser.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(request.TimeZoneId))
                {
                    return Results.BadRequest("TimeZoneId is required.");
                }

                try
                {
                    _ = TimeZoneInfo.FindSystemTimeZoneById(request.TimeZoneId);
                }
                catch (TimeZoneNotFoundException)
                {
                    return Results.BadRequest("Unsupported timezone identifier.");
                }
                catch (InvalidTimeZoneException)
                {
                    return Results.BadRequest("Invalid timezone identifier.");
                }

                ApplicationUser? user = await userManager.FindByIdAsync(userId);
                if (user is null)
                {
                    return Results.NotFound();
                }

                user.TimeZoneId = request.TimeZoneId;
                IdentityResult updateResult = await userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    string errorDescription = updateResult.Errors.FirstOrDefault()?.Description
                        ?? "Failed to update timezone.";
                    return Results.BadRequest(errorDescription);
                }

                return Results.NoContent();
            })
            .RequireAuthorization()
            .WithName("UpdateCurrentUserTimeZone");
    }
}

public sealed record UpdateUserTimeZoneRequest(string TimeZoneId);
