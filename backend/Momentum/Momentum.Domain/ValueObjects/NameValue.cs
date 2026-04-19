namespace Momentum.Domain.ValueObjects;

/// <summary>
/// Value Object РґР»СЏ РїСЂРµРґСЃС‚Р°РІР»РµРЅРёСЏ РёРјРµРЅРё РёР»Рё РЅР°Р·РІР°РЅРёСЏ
/// </summary>
public record NameValue
{
    public string Value { get; init; }

    public NameValue(string value)
    {
        Value = Validate(value, nameof(value));
    }

    private static string Validate(string? value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Value cannot be null or whitespace.", paramName);

        var trimmed = value.Trim();

        if (trimmed.Length == 0)
            throw new ArgumentException("Value cannot consist only of whitespace characters.", paramName);

        if (trimmed.Length > 100) // РћРіСЂР°РЅРёС‡РµРЅРёРµ РґР»РёРЅС‹ РёРјРµРЅРё
            throw new ArgumentException("Value cannot exceed 100 characters.", paramName);

        return trimmed;
    }

    public override string ToString() => Value;

    public static implicit operator string(NameValue nameValue) => nameValue.Value;

    public static explicit operator NameValue(string value) => new NameValue(value);
}


