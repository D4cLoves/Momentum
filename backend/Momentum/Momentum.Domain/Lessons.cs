namespace Momentum.Domain;

public sealed class Lessons
{
    private Lessons(Guid id)
    {
        this.Id = id;
    }

    public Guid Id { get; private set; }

}
