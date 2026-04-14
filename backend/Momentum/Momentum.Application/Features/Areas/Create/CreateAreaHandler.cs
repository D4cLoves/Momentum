using Momentum.Application.Features.Areas.Common;
using Momentum.Application.Abstractions.Persistence;
using Momentum.SharedKernel;
using Momentum.Domain.Entities;
using Momentum.Domain.Interfaces;
 
namespace Momentum.Application.Features.Areas.Create;

public sealed class CreateAreaHandler
{
    private readonly IAreaRepository _areaRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateAreaHandler(IAreaRepository areaRepository, IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(areaRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _areaRepository = areaRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AreaResponse>> Handle(string userId, CreateAreaRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        ArgumentNullException.ThrowIfNull(request);

        Result<Area> areaResult = Area.Create(userId, request.Name);
        if (!areaResult.IsSuccess)
        {
            return areaResult.Error;
        }

        await _areaRepository.AddAsync(areaResult.Value);
        await _unitOfWork.SaveChangesAsync();
        return areaResult.Value.ToResponse();
    }
}


