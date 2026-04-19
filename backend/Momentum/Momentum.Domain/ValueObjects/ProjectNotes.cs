using System;

namespace Momentum.Domain.ValueObjects
{
    /// <summary>
    /// Value Object РґР»СЏ Р·Р°РјРµС‚РѕРє Рє РїСЂРѕРµРєС‚Сѓ. РњРѕР¶РµС‚ Р±С‹С‚СЊ null РёР»Рё РїСѓСЃС‚С‹Рј.
    /// РњР°РєСЃРёРјР°Р»СЊРЅР°СЏ РґР»РёРЅР° вЂ” 10000 СЃРёРјРІРѕР»РѕРІ.
    /// </summary>
    public record ProjectNotes
    {
        public string Value { get; init; }

        public ProjectNotes(string? value)
        {
            Value = ValidateAndFormat(value, nameof(value));
        }

        private static string ValidateAndFormat(string? value, string paramName)
        {
            // Р Р°Р·СЂРµС€Р°РµРј null/empty
            if (string.IsNullOrEmpty(value))
                return string.Empty;

            var trimmed = value.TrimEnd(); // Trim С‚РѕР»СЊРєРѕ РІ РєРѕРЅС†Рµ, С‡С‚РѕР±С‹ СЃРѕС…СЂР°РЅРёС‚СЊ С„РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ

            if (trimmed.Length > 10000)
                throw new ArgumentException("Notes cannot exceed 10000 characters.", paramName);

            return trimmed;
        }

        public bool HasContent => !string.IsNullOrEmpty(Value);

        public override string ToString() => Value;

        public static implicit operator string(ProjectNotes notes) => notes.Value;
        public static explicit operator ProjectNotes(string value) => new(value);
    }
}



