namespace Momentum.Application.Abstractions.Auth;

public sealed class EmailApiSettings
{
	public const string SectionName = "EmailApi";
	public string BaseUrl { get; init; } = "https://api.resend.com";
	public string ApiKey { get; init; } = string.Empty;
	public string FromEmail { get; init; } = string.Empty;
	public string FromName { get; init; } = "Momentum";
}