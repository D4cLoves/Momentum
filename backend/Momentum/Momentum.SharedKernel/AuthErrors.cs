namespace Momentum.SharedKernel;

public static class AuthErrors
{
    public static Error RefreshTokenMissing { get; } =
        new("RefreshTokenMissing", ErrorType.Unauthorized, "Refresh token is missing.");

    public static Error RefreshTokenInvalid { get; } =
        new("RefreshTokenInvalid", ErrorType.Unauthorized, "Invalid refresh token.");

    public static Error RefreshTokenExpired { get; } =
        new("RefreshTokenExpired", ErrorType.Unauthorized, "Refresh token expired.");
}


