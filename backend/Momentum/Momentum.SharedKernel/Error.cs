namespace Momentum.SharedKernel;

public record Error(string Id, ErrorType Type, string Description)
{
	public static readonly Error None = new(string.Empty, default, string.Empty);
}