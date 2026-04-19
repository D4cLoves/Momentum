using Momentum.Application.Abstractions.Persistence;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Areas.Delete;

public sealed class DeleteAreaHandler
{
    private readonly IAreaRepository _areaRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteAreaHandler(IAreaRepository areaRepository, IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(areaRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _areaRepository = areaRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(Guid id, string userId)
    {
        if (id == Guid.Empty)
        {
            return Errors.InvalidAreaId;
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Errors.AccountNotFound;
        }

        var area = await _areaRepository.GetByIdAsync(id);
        if (area is null)
        {
            return Errors.AreaNotFound;
        }

        if (!string.Equals(area.UserId, userId, StringComparison.Ordinal))
        {
            return Errors.AccessDenied;
        }

        await _areaRepository.DeleteAsync(area);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }
}


