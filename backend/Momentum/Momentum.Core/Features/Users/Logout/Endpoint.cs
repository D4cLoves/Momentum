using Microsoft.AspNetCore.Routing;
using Momentum.Core.EndpointsSettings;
using Momentum.SharedKernel.Http;

namespace Momentum.Core.Features.Users.Logout;

public class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/users/logout", (HttpContext context) =>
            {
                AuthCookie.ClearAuthCookies(context);
                return Results.NoContent();
            })
            .AllowAnonymous()
            .WithName("LogoutUser");
    }
}
