using System.Security.Cryptography;
using Momentum.Application.Abstractions.Persistence;

namespace Momentum.Infrastructure.Postgres.Services;

public sealed class ResetCodeGeneratorService : IResetCodeGeneratorService
{
	public string CodeGenerator(int length)
	{
		Span<byte> bytes = stackalloc byte[length];
		RandomNumberGenerator.Fill(bytes);

		var chars = new char[length];
		for (var i = 0; i < length; i++)
			chars[i] = (char)('0' + (bytes[i] % 10));

		return new string(chars);
	}
}
