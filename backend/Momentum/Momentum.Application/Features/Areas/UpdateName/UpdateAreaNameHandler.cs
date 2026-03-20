using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Areas.Common;
using Momentum.SharedKernel;
using Momentum.Domain.ValueObjects;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Areas.UpdateName;

public sealed class UpdateAreaNameHandler
{
    private readonly IAreaRepository _areaRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateAreaNameHandler(IAreaRepository areaRepository, IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(areaRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _areaRepository = areaRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AreaResponse>> Handle(Guid id, string userId, UpdateAreaNameRequest request)
    {
        if (id == Guid.Empty)
        {
            return Errors.InvalidAreaId;
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Errors.AccountNotFound;
        }

        if (request is null || string.IsNullOrWhiteSpace(request.Name))
        {
            return Errors.ParamNull(nameof(request));
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

        Result updateResult;
        try
        {
            updateResult = area.UpdateName(new NameValue(request.Name));
        }
        catch (ArgumentException ex)
        {
            return Errors.IdentityError(ex.Message);
        }

        if (!updateResult.IsSuccess)
        {
            return updateResult.Error;
        }

        await _areaRepository.UpdateAsync(area);
        await _unitOfWork.SaveChangesAsync();
        return area.ToResponse();
    }
}


