namespace Consoltech.AdminApi.Models;

/// <summary>
/// DTO for returning localized product data to the frontend.
/// Combines language-agnostic product data with locale-specific translations.
/// </summary>
public class LocalizedProductDto
{
    public int Id { get; set; }
    public string? Sku { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Flags { get; set; }

    // Localized fields from ProductTranslation
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Badges { get; set; }
}
