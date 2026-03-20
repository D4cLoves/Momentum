namespace Momentum.Application.Abstractions.Auth;

public interface IRefreshTokenService
{
    string CreateRefreshToken();

    string HashRefreshToken(string refreshToken, string refreshHmacKey);
}



