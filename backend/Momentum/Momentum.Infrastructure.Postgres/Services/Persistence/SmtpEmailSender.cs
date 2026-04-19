using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Momentum.Application.Abstractions.Auth;
using Momentum.Application.Abstractions.Persistence;

namespace Momentum.Infrastructure.Postgres.Services.Persistence;

public sealed class SmtpEmailSender : IEmailSender
{
	private readonly EmailSettings _settings;
	private readonly ILogger<SmtpEmailSender> _logger;

	public SmtpEmailSender(
		IOptions<EmailSettings> options,
		ILogger<SmtpEmailSender> logger)
	{
		_settings = options.Value;
		_logger = logger;
	}

	public async Task SendAsync(
		string toEmail,
		string subject,
		string htmlBody,
		CancellationToken cancellationToken = default)
	{
		if (string.IsNullOrWhiteSpace(_settings.Host)
		    || string.IsNullOrWhiteSpace(_settings.UserName)
		    || string.IsNullOrWhiteSpace(_settings.Password)
		    || string.IsNullOrWhiteSpace(_settings.FromEmail))
		{
			throw new InvalidOperationException("EmailSettings is not fully configured.");
		}

		// using (SmtpClient client = new SmtpClient(_settings.Host, _settings.Port))
		// {
		// 	
		// }
		var message = new MimeMessage();
		message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
		message.To.Add(MailboxAddress.Parse(toEmail));
		message.Subject = subject;
		message.Body = new BodyBuilder
		{
			HtmlBody = htmlBody,
			TextBody = htmlBody
		}.ToMessageBody();

		using var client = new SmtpClient();
		client.Timeout = 15_000;

		try
		{
			var secureSocketOptions = _settings.UseSsl
				? SecureSocketOptions.SslOnConnect
				: SecureSocketOptions.StartTls;

			await client.ConnectAsync(
				_settings.Host,
				_settings.Port,
				secureSocketOptions,
				cancellationToken);

			await client.AuthenticateAsync(
				_settings.UserName,
				_settings.Password,
				cancellationToken);

			await client.SendAsync(message, cancellationToken);
			await client.DisconnectAsync(true, cancellationToken);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Failed to send email to {Email}", toEmail);
			throw;
		}
	}
}
