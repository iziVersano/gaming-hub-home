namespace Consoltech.AdminApi.Models;

/// <summary>
/// Stores localized product content (title, description, badges) for multi-language support.
/// Each product can have multiple translations (one per locale: en, he, etc.)
/// </summary>
public class ProductTranslation
{
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to the Product table
    /// </summary>
    public int ProductId { get; set; }

    /// <summary>
    /// Language/locale code (e.g., "en", "he")
    /// </summary>
    public required string Locale { get; set; }

    /// <summary>
    /// Localized product title
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Localized product description
    /// </summary>
    public required string Description { get; set; }

    /// <summary>
    /// Localized category name (e.g., "New Arrivals" in English, "מוצרים חדשים" in Hebrew)
    /// </summary>
    public required string Category { get; set; }

    /// <summary>
    /// Optional comma-separated badges (e.g., "Featured,Hot Deal")
    /// </summary>
    public string? Badges { get; set; }

    /// <summary>
    /// Navigation property to parent product
    /// </summary>
    public Product? Product { get; set; }
}
