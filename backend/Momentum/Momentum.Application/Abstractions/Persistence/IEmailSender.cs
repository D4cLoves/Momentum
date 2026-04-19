namespace Momentum.Application.Abstractions.Persistence;

public interface IEmailSender
{
	Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default);
}