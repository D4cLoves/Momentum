namespace Momentum.Application.Abstractions.Auth;

public sealed class EmailSettings
{
	public const string SectionName = "EmailSettings";

	public string Host { get; init; } = string.Empty;
	public int Port { get; init; }
	public bool UseSsl { get; init; }
	public string UserName { get; init; } = string.Empty;
	public string Password { get; init; } = string.Empty;
	public string FromEmail { get; init; } = string.Empty;
	public string FromName { get; init; } = string.Empty;
}