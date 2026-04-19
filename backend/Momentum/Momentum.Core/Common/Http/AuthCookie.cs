using Microsoft.Extensions.Options;
using Momentum.Application.Abstractions.Auth;

namespace Momentum.SharedKernel.Http;

public static class AuthCookie
{
	public const string AccessTokenCookieName = "access_token";
	public const string RefreshTokenCookieName = "refresh_token";

	public static void SetAccessCookie(HttpContext context, string accessToken, IOptions<AuthSettings> settings)
	{
		context.Response.Cookies.Append(
			AccessTokenCookieName,
			accessToken,
			new CookieOptions
			{
				HttpOnly = true,
				Secure = context.Request.IsHttps,
				SameSite = SameSiteMode.Lax,
				Path = "/",
				Expires = DateTime.UtcNow.Add(settings.Value.Expires),
			});
	}

	public static void SetRefreshCookie(HttpContext context, string refreshToken, IOptions<AuthSettings> settings)
	{
		context.Response.Cookies.Append(
			RefreshTokenCookieName,
			refreshToken,
			new CookieOptions
			{
				HttpOnly = true,
				Secure = context.Request.IsHttps,
				SameSite = SameSiteMode.Lax,
				Path = "/api/users/refresh",
				Expires = DateTimeOffset.UtcNow.Add(settings.Value.RefreshExpires),
			});
	}

    public static void ClearAuthCookies(HttpContext context)
    {
        context.Response.Cookies.Delete(
            AccessTokenCookieName,
            new CookieOptions
            {
                Path = "/",
                SameSite = SameSiteMode.Lax,
                Secure = context.Request.IsHttps,
            });

        context.Response.Cookies.Delete(
            RefreshTokenCookieName,
            new CookieOptions
            {
                Path = "/api/users/refresh",
                SameSite = SameSiteMode.Lax,
                Secure = context.Request.IsHttps,
            });
    }
}

