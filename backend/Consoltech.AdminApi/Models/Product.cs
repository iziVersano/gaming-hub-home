namespace Consoltech.AdminApi.Models;

/// <summary>
/// Core product entity containing language-agnostic data.
/// Localized content (title, description, category) is stored in ProductTranslations table.
/// </summary>
public class Product
{
    public int Id { get; set; }

    /// <summary>
    /// SKU or unique product identifier
    /// </summary>
    public string? Sku { get; set; }

    /// <summary>
    /// Product image URL (language-agnostic)
    /// </summary>
    public required string ImageUrl { get; set; }

    /// <summary>
    /// Product price (language-agnostic, currency conversion handled separately)
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Product flags for special handling (featured, new, etc.)
    /// Stored as comma-separated values (e.g., "featured,new")
    /// </summary>
    public string? Flags { get; set; }

    /// <summary>
    /// Navigation property to translations
    /// </summary>
    public ICollection<ProductTranslation>? Translations { get; set; }
}
