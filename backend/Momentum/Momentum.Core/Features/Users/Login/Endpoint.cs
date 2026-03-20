using System.Threading;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Options;
using Momentum.Application.Features.Users.Login;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;
using Momentum.Application.Abstractions.Auth;

namespace Momentum.Core.Features.Users.Login;

public class Endpoint : IEndpoint
{
	public void MapEndpoint(IEndpointRouteBuilder app)
	{
		app.MapPost("/api/users/login", async (
				[FromServices] LoginUserHandler handler,
				[FromBody] LoginUserRequest request,
				HttpContext context,
				IOptions<AuthSettings> authSettings,
				CancellationToken ct) =>
			{
				var result = await handler.Handle(request, ct);
				if (!result.IsSuccess)
				{
					return result.Error.ToHttp();
				}
				
				AuthCookie.SetAccessCookie(context, result.Value.AccessToken, authSettings);
				AuthCookie.SetRefreshCookie(context, result.Value.RefreshToken, authSettings);
				

				return Results.Ok(new LoginUserResponse(result.Value.AccessToken));
			})
			.AllowAnonymous()
			.WithName("LoginUser");
	}
}


