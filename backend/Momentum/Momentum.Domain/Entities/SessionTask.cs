using System;
using Momentum.SharedKernel;
using Momentum.Domain.ValueObjects;

namespace Momentum.Domain.Entities
{
  public sealed class SessionTask : Entity
  {
    public Guid SessionId { get; private init; }
    public NameValue Description { get; private set; }
    public bool IsCompleted { get; private set; }
    public DateTime? CompletedAt { get; private set; }

#pragma warning disable CS8618
    private SessionTask() : base(Guid.Empty) { }
#pragma warning restore CS8618

    private SessionTask(Guid id, Guid sessionId, NameValue description) : base(id)
    {
      SessionId = sessionId;
      Description = description;
      IsCompleted = false;
    }

    public static Result<SessionTask> Create(Guid sessionId, string description)
    {
      if (sessionId == Guid.Empty)
        return Errors.ParamNull(nameof(sessionId));
      if (string.IsNullOrWhiteSpace(description))
        return Errors.ParamNull(nameof(description));

      var desc = new NameValue(description);
      return new SessionTask(Guid.NewGuid(), sessionId, desc);
    }

    public Result Complete()
    {
      if (IsCompleted)
        return Errors.TaskAlreadyCompleted;

      IsCompleted = true;
      CompletedAt = DateTime.UtcNow;
      UpdateTimestamp();
      return Result.Success();
    }

    public void Reopen()
    {
      if (IsCompleted)
      {
        IsCompleted = false;
        CompletedAt = null;
        UpdateTimestamp();
      }
    }

    public Result UpdateDescription(string newDescription)
    {
      if (string.IsNullOrWhiteSpace(newDescription))
        return Errors.ParamNull(nameof(newDescription));

      Description = new NameValue(newDescription);
      UpdateTimestamp();
      return Result.Success();
    }
  }
}


