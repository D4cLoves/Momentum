namespace Momentum.Application.Abstractions.Persistence;

public interface IResetCodeGeneratorService
{
	string CodeGenerator(int length);
}
