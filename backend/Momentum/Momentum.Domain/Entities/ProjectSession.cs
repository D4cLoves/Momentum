using System;
using System.Collections.Generic;
using Momentum.SharedKernel;
using Momentum.Domain.ValueObjects;

namespace Momentum.Domain.Entities
{
  public sealed class ProjectSession : Entity
  {
    public Guid ProjectId { get; private init; }
    public NameValue? Title { get; private set; }
    public NameValue? Goal { get; private set; }
    public DateTime StartedAt { get; private set; }
    public DateTime? EndedAt { get; private set; }
    public TimeSpan Duration { get; private set; }
    public ProjectNotes? Notes { get; private set; }

    private readonly List<SessionTask> _tasks = new();
    public IReadOnlyCollection<SessionTask> Tasks => _tasks.AsReadOnly();

    public bool IsActive => EndedAt is null;

    private ProjectSession() : base(Guid.Empty) { }

    private ProjectSession(Guid id, Guid projectId, NameValue title, NameValue goal, DateTime startedAt) : base(id)
    {
      ProjectId = projectId;
      Title = title;
      Goal = goal;
      StartedAt = startedAt;
      Duration = TimeSpan.Zero;
    }

    public static Result<ProjectSession> Start(Guid projectId, string title, string goal, DateTime? startedAt = null)
    {
      if (projectId == Guid.Empty)
        return Errors.ParamNull(nameof(projectId));
      if (string.IsNullOrWhiteSpace(title))
        return Errors.ParamNull(nameof(title));
      if (string.IsNullOrWhiteSpace(goal))
        return Errors.ParamNull(nameof(goal));

      NameValue titleValue;
      NameValue goalValue;
      try
      {
        titleValue = new NameValue(title);
        goalValue = new NameValue(goal);
      }
      catch (ArgumentException ex)
      {
        return Errors.ParamNull(ex.ParamName ?? nameof(title));
      }

      var start = startedAt ?? DateTime.UtcNow;
      return new ProjectSession(Guid.NewGuid(), projectId, titleValue, goalValue, start);
    }

    public Result End(string? notes = null)
    {
      if (!IsActive)
        return Errors.SessionNotActive;

      EndedAt = DateTime.UtcNow;
      Duration = EndedAt.Value - StartedAt;
      Notes = string.IsNullOrWhiteSpace(notes) ? null : new ProjectNotes(notes);
      UpdateTimestamp();
      return Result.Success();
    }

    public Result AddTask(SessionTask task)
    {
      if (task == null) return Errors.ParamNull(nameof(task));
      if (!IsActive) return Errors.SessionNotActive;
      if (_tasks.Contains(task)) return Errors.TaskAlreadyExists;

      _tasks.Add(task);
      return Result.Success();
    }

    public Result DeleteTask(SessionTask task)
    {
      if (task == null) return Errors.ParamNull(nameof(task));
      if (!IsActive) return Errors.SessionNotActive;

      _tasks.Remove(task);
      return Result.Success();
    }
  }
}

