using System.Threading;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Options;
using Momentum.Application.Features.Users.Refresh;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;
using Momentum.Application.Abstractions.Auth;

namespace Momentum.Core.Features.Users.Refresh;

public class Endpoint : IEndpoint
{
	public void MapEndpoint(IEndpointRouteBuilder app)
	{
		app.MapPost("/api/users/refresh", async (
				[FromServices] RefreshTokensHandler handler,
				IOptions<AuthSettings> authSettings,
				HttpContext context,
				[FromBody] RefreshRequest request,
				CancellationToken ct) =>
			{
				string? refreshToken = request.refreshTokens;
				if (string.IsNullOrWhiteSpace(refreshToken))
				{
					refreshToken = context.Request.Cookies[AuthCookie.RefreshTokenCookieName];
				}

				var result = await handler.Handle(new RefreshRequest(refreshToken ?? string.Empty), ct);
				if (!result.IsSuccess)
				{
					return result.Error.ToHttp();
				}

				AuthCookie.SetAccessCookie(context, result.Value.AccessToken, authSettings);
				AuthCookie.SetRefreshCookie(context, result.Value.RefreshToken, authSettings);

				return Results.NoContent();
			})
			.AllowAnonymous()
			.WithName("RefreshToken");
	}
}


