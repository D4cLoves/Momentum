namespace Momentum.Application.Abstractions.Auth;

public sealed class AuthSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public TimeSpan Expires { get; set; }
    public TimeSpan RefreshExpires { get; set; }
    public string RefreshHmacKey { get; set; } = string.Empty;
}


