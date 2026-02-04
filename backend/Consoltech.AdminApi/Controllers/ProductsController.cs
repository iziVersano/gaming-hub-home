using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Consoltech.AdminApi.Data;
using Consoltech.AdminApi.Models;

namespace Consoltech.AdminApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductsDbContext _context;
    private const string DefaultLocale = "en";

    public ProductsController(ProductsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all products with localized content.
    /// Accepts optional 'locale' or 'lang' query parameter (default: en).
    /// Falls back to English if translation is missing.
    /// </summary>
    /// <param name="locale">Language code (en, he)</param>
    /// <param name="lang">Alternative language parameter</param>
    /// <returns>List of localized products</returns>
    // GET: api/products?locale=he or api/products?lang=he
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LocalizedProductDto>>> GetProducts(
        [FromQuery] string? locale = null,
        [FromQuery] string? lang = null)
    {
        // Accept both 'locale' and 'lang' parameters, default to 'en'
        var requestedLocale = locale ?? lang ?? DefaultLocale;

        // Join products with their translations
        var products = await _context.Products
            .Select(p => new
            {
                Product = p,
                // Get requested locale translation
                RequestedTranslation = p.Translations!.FirstOrDefault(t => t.Locale == requestedLocale),
                // Get fallback English translation
                FallbackTranslation = p.Translations!.FirstOrDefault(t => t.Locale == DefaultLocale)
            })
            .ToListAsync();

        // Map to DTO with fallback logic
        var localizedProducts = products.Select(item =>
        {
            // Use requested translation if available, otherwise fall back to English
            var translation = item.RequestedTranslation ?? item.FallbackTranslation;

            return new LocalizedProductDto
            {
                Id = item.Product.Id,
                Sku = item.Product.Sku,
                ImageUrl = item.Product.ImageUrl,
                Price = item.Product.Price,
                Flags = item.Product.Flags,
                Title = translation?.Title ?? "Untitled",
                Description = translation?.Description ?? "No description available",
                Category = translation?.Category ?? "Uncategorized",
                Badges = translation?.Badges
            };
        }).ToList();

        return Ok(localizedProducts);
    }

    /// <summary>
    /// Get a specific product by ID with localized content.
    /// Accepts optional 'locale' or 'lang' query parameter (default: en).
    /// Falls back to English if translation is missing.
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="locale">Language code (en, he)</param>
    /// <param name="lang">Alternative language parameter</param>
    /// <returns>Localized product</returns>
    // GET: api/products/5?locale=he or api/products/5?lang=he
    [HttpGet("{id}")]
    public async Task<ActionResult<LocalizedProductDto>> GetProduct(
        int id,
        [FromQuery] string? locale = null,
        [FromQuery] string? lang = null)
    {
        var requestedLocale = locale ?? lang ?? DefaultLocale;

        var product = await _context.Products
            .Where(p => p.Id == id)
            .Select(p => new
            {
                Product = p,
                RequestedTranslation = p.Translations!.FirstOrDefault(t => t.Locale == requestedLocale),
                FallbackTranslation = p.Translations!.FirstOrDefault(t => t.Locale == DefaultLocale)
            })
            .FirstOrDefaultAsync();

        if (product == null)
        {
            return NotFound();
        }

        var translation = product.RequestedTranslation ?? product.FallbackTranslation;

        var localizedProduct = new LocalizedProductDto
        {
            Id = product.Product.Id,
            Sku = product.Product.Sku,
            ImageUrl = product.Product.ImageUrl,
            Price = product.Product.Price,
            Flags = product.Product.Flags,
            Title = translation?.Title ?? "Untitled",
            Description = translation?.Description ?? "No description available",
            Category = translation?.Category ?? "Uncategorized",
            Badges = translation?.Badges
        };

        return Ok(localizedProduct);
    }

    // POST: api/products
    [HttpPost]
    // [Authorize] - Temporarily disabled for credential-free admin mode
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    // [Authorize] - Temporarily disabled for credential-free admin mode
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest();
        }

        _context.Entry(product).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    // [Authorize] - Temporarily disabled for credential-free admin mode
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProductExists(int id)
    {
        return _context.Products.Any(e => e.Id == id);
    }
}
