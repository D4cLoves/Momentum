using System.Net;
using System.Net.Http.Json;
using Momentum.Application.Features.Areas.Create;
using Momentum.Application.Features.Users.Login;
using Momentum.Application.Features.Users.Refresh;
using Momentum.Application.Features.Users.Register;

namespace Momentum.IntegrationTests;

public sealed class AuthFlowTests : IClassFixture<TestApplicationFixture>
{
    private readonly TestApplicationFixture _fixture;

    public AuthFlowTests(TestApplicationFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task Login_CreateArea_Refresh_ShouldWork()
    {
        var client = _fixture.Client;

        string suffix = Guid.NewGuid().ToString("N");
        var register = new RegisterUserRequest(
            $"user_{suffix}",
            $"user_{suffix}@example.com",
            "Qwerty123!");

        HttpResponseMessage registerResponse = await client.PostAsJsonAsync("/api/users/register", register);
        Assert.Equal(HttpStatusCode.NoContent, registerResponse.StatusCode);

        var login = new LoginUserRequest(register.Email, register.Password);
        HttpResponseMessage loginResponse = await client.PostAsJsonAsync("/api/users/login", login);
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        string? accessToken = ExtractCookieValue(loginResponse, "access_token");
        Assert.False(string.IsNullOrWhiteSpace(accessToken));

        var createAreaRequest = new HttpRequestMessage(HttpMethod.Post, "/api/areas")
        {
            Content = JsonContent.Create(new CreateAreaRequest("Work"))
        };
        createAreaRequest.Headers.Add("Cookie", $"access_token={accessToken}");

        HttpResponseMessage createAreaResponse = await client.SendAsync(createAreaRequest);
        Assert.Equal(HttpStatusCode.Created, createAreaResponse.StatusCode);

        string? refreshToken = ExtractCookieValue(loginResponse, "refresh_token");
        Assert.False(string.IsNullOrWhiteSpace(refreshToken));

        HttpResponseMessage refreshResponse = await client.PostAsJsonAsync(
            "/api/users/refresh",
            new RefreshRequest(refreshToken!));

        Assert.Equal(HttpStatusCode.NoContent, refreshResponse.StatusCode);
        Assert.Null(refreshResponse.Headers.Location);
    }

    private static string? ExtractCookieValue(HttpResponseMessage response, string cookieName)
    {
        if (!response.Headers.TryGetValues("Set-Cookie", out var values))
        {
            return null;
        }

        foreach (string header in values)
        {
            string prefix = cookieName + "=";
            if (!header.StartsWith(prefix, StringComparison.Ordinal))
            {
                continue;
            }

            int end = header.IndexOf(';');
            string value = end >= 0 ? header[prefix.Length..end] : header[prefix.Length..];
            return Uri.UnescapeDataString(value);
        }

        return null;
    }
}


