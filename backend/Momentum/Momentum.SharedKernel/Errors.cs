namespace Momentum.SharedKernel;

public static class Errors
{
    public static Error AccountNotFound { get; } = new("AccountNotFound", ErrorType.NotFound, "Account was not found.");
    public static Error AccessDenied { get; } = new("AccessDenied", ErrorType.Unauthorized, "Access denied.");

    public static Error ParamNull(string paramName) =>
        new("ParamIsNull", ErrorType.Validation, $"Parameter '{paramName}' cannot be null or empty.");

    public static Error ProjectNotFound { get; } = new("ProjectNotFound", ErrorType.NotFound, "Project was not found.");
    public static Error SessionNotFound { get; } = new("SessionNotFound", ErrorType.NotFound, "Session was not found.");
    public static Error TaskAlreadyExists { get; } = new("TaskAlreadyExists", ErrorType.Conflict, "Task already exists.");

    public static Error InvalidTaskTransition(string from, string to) =>
        new("InvalidTaskTransition", ErrorType.Validation, $"Task cannot transition from '{from}' to '{to}'.");

    public static Error TimerAlreadyRunning { get; } = new("TimerAlreadyRunning", ErrorType.Validation, "Timer is already running.");
    public static Error TimerNotRunning { get; } = new("TimerNotRunning", ErrorType.Validation, "Timer is not running.");

    public static Error AreaNotFound { get; } = new("AreaNotFound", ErrorType.NotFound, "Area was not found.");
    public static Error InvalidAreaId { get; } = new("InvalidAreaId", ErrorType.Validation, "Area id is invalid.");
    public static Error InvalidTargetHours { get; } = new("InvalidTargetHours", ErrorType.Validation, "Target hours must be between 1 and 10000.");
    public static Error SessionAlreadyActive { get; } = new("SessionAlreadyActive", ErrorType.Conflict, "Session already active.");
    public static Error ActiveSessionNotFound { get; } = new("ActiveSessionNotFound", ErrorType.NotFound, "Active session was not found.");
    public static Error SessionNotActive { get; } = new("SessionNotActive", ErrorType.Validation, "Session is not active.");
    public static Error InvalidSessionDuration { get; } = new("InvalidSessionDuration", ErrorType.Validation, "Session duration must be greater than zero.");
    public static Error TaskAlreadyCompleted { get; } = new("TaskAlreadyCompleted", ErrorType.Conflict, "Task already completed.");

    public static Error TaskNotFound { get; } = new("TaskNotFound", ErrorType.NotFound, "Task was not found.");

    public static Error IdentityError(string description) => new("IdentityError", ErrorType.Validation, description);

    public static Error PasswordIncorrect { get; } =
      new("PasswordIncorrect", ErrorType.Unauthorized, "Password is incorrect.");
}


