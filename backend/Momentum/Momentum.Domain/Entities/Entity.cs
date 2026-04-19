namespace Momentum.Domain.Entities;

/// <summary>
/// Р‘Р°Р·РѕРІС‹Р№ РєР»Р°СЃСЃ РґР»СЏ РІСЃРµС… СЃСѓС‰РЅРѕСЃС‚РµР№ РІ СЃРёСЃС‚РµРјРµ
/// </summary>
public abstract class Entity : IEquatable<Entity>
{
    protected Entity() { }
    protected Entity(Guid id) => Id = id;

    /// <summary>
    /// РЈРЅРёРєР°Р»СЊРЅС‹Р№ РёРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ СЃСѓС‰РЅРѕСЃС‚Рё
    /// </summary>
    public Guid Id { get; init; }

    /// <summary>
    /// Р”Р°С‚Р° Рё РІСЂРµРјСЏ СЃРѕР·РґР°РЅРёСЏ СЃСѓС‰РЅРѕСЃС‚Рё
    /// </summary>
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

    /// <summary>
    /// Р”Р°С‚Р° Рё РІСЂРµРјСЏ РїРѕСЃР»РµРґРЅРµРіРѕ РѕР±РЅРѕРІР»РµРЅРёСЏ СЃСѓС‰РЅРѕСЃС‚Рё
    /// </summary>
    public DateTime UpdatedAt { get; protected set; } = DateTime.UtcNow;

    public static bool operator ==(Entity? first, Entity? second) =>
        first is not null && second is not null && first.Equals(second);

    public static bool operator !=(Entity? first, Entity? second) => !(first == second);

    public bool Equals(Entity? other) =>
        other is not null && other.GetType() == GetType() && other.Id == Id;

    public override bool Equals(object? obj) =>
        obj is Entity entity && Equals(entity);

    public override int GetHashCode() => Id.GetHashCode();

    /// <summary>
    /// РњРµС‚РѕРґ РґР»СЏ РѕР±РЅРѕРІР»РµРЅРёСЏ РІСЂРµРјРµРЅРё РїРѕСЃР»РµРґРЅРµРіРѕ РёР·РјРµРЅРµРЅРёСЏ СЃСѓС‰РЅРѕСЃС‚Рё
    /// </summary>
    protected void UpdateTimestamp() => UpdatedAt = DateTime.UtcNow;
}