using System;
using System.Collections.Generic;
using System.Linq;
using Momentum.SharedKernel;
using Momentum.Domain.ValueObjects;

namespace Momentum.Domain.Entities
{
  public sealed class Project : Entity, IAggregateRoot
  {
    public string UserId { get; private set; }
    public Guid AreaId { get; private set; }
    public NameValue Name { get; private set; }
    public NameValue Goal { get; private set; }
    public NameValue? PrimaryTask { get; private set; }
    public ProjectNotes? Notes { get; private set; }
    public int? TargetHours { get; private set; }

    private readonly List<ProjectSession> _sessions = new();
    public IReadOnlyCollection<ProjectSession> Sessions => _sessions.AsReadOnly();


#pragma warning disable CS8618
    private Project() { }
#pragma warning restore CS8618

    private Project(Guid id, string userId, Guid areaId, NameValue name, NameValue goal, NameValue? primaryTask, int? targetHours, ProjectNotes? note) : base(id)
    {
      UserId = userId;
      AreaId = areaId;
      Name = name;
      Goal = goal;
      PrimaryTask = primaryTask;
      TargetHours = targetHours;
      Notes = note;
    }

    public static Result<Project> Create(string userId, Guid areaId, string name, string goal, string? primaryTask, int? targetHours, string? notes = null)
    {
      if (string.IsNullOrWhiteSpace(userId))
        return Errors.AccountNotFound;
      if (areaId == Guid.Empty)
        return Errors.InvalidAreaId;
      if (string.IsNullOrWhiteSpace(name))
        return Errors.ParamNull(nameof(name));
      if (string.IsNullOrWhiteSpace(goal))
        return Errors.ParamNull(nameof(goal));
      if (targetHours is <= 0 or > 10000)
        return Errors.InvalidTargetHours;

      var nameVO = new NameValue(name);
      var goalVO = new NameValue(goal);
      var taskVO = string.IsNullOrWhiteSpace(primaryTask) ? null : new NameValue(primaryTask);
      var notesVO = string.IsNullOrWhiteSpace(notes) ? null : new ProjectNotes(notes);
      var project = new Project(Guid.NewGuid(), userId, areaId, nameVO, goalVO, taskVO, targetHours, notesVO);

      return project;
    }

    public Result UpdateName(NameValue newName)
    {
      if (newName == null) return Errors.ParamNull(nameof(newName));
      Name = newName;
      UpdateTimestamp();
      return Result.Success();
    }

    public Result UpdateGoal(NameValue newGoal)
    {
      if (newGoal == null) return Errors.ParamNull(nameof(newGoal));
      Goal = newGoal;
      UpdateTimestamp();
      return Result.Success();
    }

    public Result UpdatePrimaryTask(string? primaryTask)
    {
      if (string.IsNullOrWhiteSpace(primaryTask))
      {
        PrimaryTask = null;
        UpdateTimestamp();
        return Result.Success();
      }

      PrimaryTask = new NameValue(primaryTask);
      UpdateTimestamp();
      return Result.Success();
    }

    public Result UpdateTargetHours(int? targetHours)
    {
      if (targetHours is <= 0 or > 10000)
        return Errors.InvalidTargetHours;

      TargetHours = targetHours;
      UpdateTimestamp();
      return Result.Success();
    }

    public void UpdateNotes(ProjectNotes? newNote)
    {
      Notes = newNote?.Value?.Trim() is { Length: > 0 } ? newNote : null;
      UpdateTimestamp();
    }

    public Result<ProjectSession> StartSession(string title, string goal)
    {
      if (_sessions.Any(s => s.IsActive))
        return Errors.SessionAlreadyActive;

      var sessionResult = ProjectSession.Start(Id, title, goal);
      if (sessionResult.IsFailure) return sessionResult.Error;

      _sessions.Add(sessionResult.Value);
      UpdateTimestamp();
      return sessionResult.Value;
    }
  }
}


