using Momentum.SharedKernel;
using Momentum.Domain.ValueObjects;
using Momentum.Domain.Entities;

namespace Momentum.Domain.Entities;
    public sealed class Area : Entity, IAggregateRoot
    {
        public string UserId { get; private set; }
        public NameValue Name { get; private set; }

        private readonly List<Project> _projects = new();
        public IReadOnlyCollection<Project> Projects => _projects.AsReadOnly();

#pragma warning disable CS8618
        private Area() { }
#pragma warning restore CS8618

        private Area(Guid id, string userId, NameValue name) : base(id)
        {
            UserId = userId;
            Name = name;
        }

        public static Result<Area> Create(string userId, string name)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return Errors.AccountNotFound;
            if (string.IsNullOrWhiteSpace(name))
                return Errors.ParamNull(nameof(name));

            var nameVO = new NameValue(name);
            var area = new Area(Guid.NewGuid(), userId, nameVO);

            return area;
        }

        public Result UpdateName(NameValue newName)
        {
            if (newName == null) return Errors.ParamNull(nameof(newName));
            Name = newName;
            UpdateTimestamp();
            return Result.Success();
        }
    }


