using Microsoft.EntityFrameworkCore;
using Consoltech.AdminApi.Models;

namespace Consoltech.AdminApi.Data;

public class ProductsDbContext : DbContext
{
    public ProductsDbContext(DbContextOptions<ProductsDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<ProductTranslation> ProductTranslations { get; set; }
    public DbSet<WarrantySubmissionEntity> WarrantySubmissions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationship: One Product has Many Translations
        modelBuilder.Entity<ProductTranslation>()
            .HasOne(pt => pt.Product)
            .WithMany(p => p.Translations)
            .HasForeignKey(pt => pt.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Create composite index for fast lookups by ProductId + Locale
        modelBuilder.Entity<ProductTranslation>()
            .HasIndex(pt => new { pt.ProductId, pt.Locale });

        // Configure WarrantySubmission entity
        modelBuilder.Entity<WarrantySubmissionEntity>()
            .HasIndex(w => w.RowKey)
            .IsUnique();

        modelBuilder.Entity<WarrantySubmissionEntity>()
            .HasIndex(w => w.SerialNumber);

        modelBuilder.Entity<WarrantySubmissionEntity>()
            .HasIndex(w => w.Email);

        // Seed Products (language-agnostic data only)
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Sku = "NS2-2024", ImageUrl = "/images/nintendo-switch-2-product.jpg", Price = 449.99m, Flags = "featured,new" },
            new Product { Id = 2, Sku = "PS5-STD", ImageUrl = "/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png", Price = 499.99m, Flags = "featured,new" },
            new Product { Id = 3, Sku = "XSX-2024", ImageUrl = "/images/78a95f48-606e-44b6-950e-af0555a3f04f.png", Price = 449.99m, Flags = "new" },
            new Product { Id = 4, Sku = "DRN-PRO", ImageUrl = "/images/07ba8bc0-8d14-4d62-a534-659913ac5f99.png", Price = 1299.99m, Flags = null },
            new Product { Id = 5, Sku = "EBIKE-SMART", ImageUrl = "/images/a0bd3ab6-05d5-4312-b6ec-f0e256d7a63a.png", Price = 1899.99m, Flags = null },
            new Product { Id = 6, Sku = "TV-4K-55", ImageUrl = "/images/6df37998-af04-426e-b749-365ffeb66787.png", Price = 799.99m, Flags = null },
            new Product { Id = 7, Sku = "GAME-ACC", ImageUrl = "/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png", Price = 149.99m, Flags = null },
            new Product { Id = 8, Sku = "SMART-HOME", ImageUrl = "/images/6df37998-af04-426e-b749-365ffeb66787.png", Price = 299.99m, Flags = null }
        );

        // Seed Product Translations - ENGLISH (en)
        modelBuilder.Entity<ProductTranslation>().HasData(
            // Product 1 - Nintendo Switch 2 (EN)
            new ProductTranslation
            {
                Id = 1,
                ProductId = 1,
                Locale = "en",
                Title = "Nintendo Switch 2",
                Description = "The next generation of Nintendo gaming. Experience enhanced graphics, faster performance, and an expanded game library. Features a larger display, improved Joy-Con controllers, and backward compatibility.",
                Category = "New Arrivals",
                Badges = "Featured,Hot"
            },
            // Product 2 - PlayStation 5 (EN)
            new ProductTranslation
            {
                Id = 2,
                ProductId = 2,
                Locale = "en",
                Title = "PlayStation 5",
                Description = "Next-generation gaming console with ultra-fast SSD and ray tracing technology. Experience lightning-fast loading and stunning graphics.",
                Category = "New Arrivals",
                Badges = "Featured"
            },
            // Product 3 - Xbox Series X (EN)
            new ProductTranslation
            {
                Id = 3,
                ProductId = 3,
                Locale = "en",
                Title = "Xbox Series X",
                Description = "The most powerful Xbox ever with 12 teraflops of GPU performance and Smart Delivery technology.",
                Category = "New Arrivals",
                Badges = null
            },
            // Product 4 - Professional Drones (EN)
            new ProductTranslation
            {
                Id = 4,
                ProductId = 4,
                Locale = "en",
                Title = "Professional Drones",
                Description = "High-performance drones for commercial photography, surveying, and recreational flying with advanced stabilization.",
                Category = "Drones",
                Badges = null
            },
            // Product 5 - Smart E-Bikes (EN)
            new ProductTranslation
            {
                Id = 5,
                ProductId = 5,
                Locale = "en",
                Title = "Smart E-Bikes",
                Description = "Electric bikes with smart connectivity, long-range batteries, and advanced motor systems for urban mobility.",
                Category = "E-Bikes",
                Badges = null
            },
            // Product 6 - 4K Smart TVs (EN)
            new ProductTranslation
            {
                Id = 6,
                ProductId = 6,
                Locale = "en",
                Title = "4K Smart TVs",
                Description = "Ultra-high definition smart TVs with AI upscaling, HDR support, and built-in streaming platforms.",
                Category = "TVs",
                Badges = null
            },
            // Product 7 - Gaming Accessories (EN)
            new ProductTranslation
            {
                Id = 7,
                ProductId = 7,
                Locale = "en",
                Title = "Gaming Accessories",
                Description = "Premium gaming peripherals including controllers, headsets, and racing wheels from top brands.",
                Category = "Gaming",
                Badges = null
            },
            // Product 8 - Smart Home Electronics (EN)
            new ProductTranslation
            {
                Id = 8,
                ProductId = 8,
                Locale = "en",
                Title = "Smart Home Electronics",
                Description = "Connected home devices including smart speakers, security cameras, and automation systems.",
                Category = "Electronics",
                Badges = null
            },

            // Seed Product Translations - HEBREW (he)
            // Product 1 - Nintendo Switch 2 (HE)
            new ProductTranslation
            {
                Id = 9,
                ProductId = 1,
                Locale = "he",
                Title = "נינטנדו סוויץ' 2",
                Description = "הדור הבא של משחקי נינטנדו. חוו גרפיקה משופרת, ביצועים מהירים יותר וספריית משחקים מורחבת. כולל מסך גדול יותר, בקרי Joy-Con משופרים ותאימות לאחור.",
                Category = "מוצרים חדשים",
                Badges = "מומלץ,לוהט"
            },
            // Product 2 - PlayStation 5 (HE)
            new ProductTranslation
            {
                Id = 10,
                ProductId = 2,
                Locale = "he",
                Title = "פלייסטיישן 5",
                Description = "קונסולת משחקים מהדור הבא עם SSD במהירות אולטרה וטכנולוגיית Ray Tracing. חוו טעינה במהירות הבזק וגרפיקה מדהימה.",
                Category = "מוצרים חדשים",
                Badges = "מומלץ"
            },
            // Product 3 - Xbox Series X (HE)
            new ProductTranslation
            {
                Id = 11,
                ProductId = 3,
                Locale = "he",
                Title = "אקסבוקס סדרה X",
                Description = "ה-Xbox החזק ביותר אי פעם עם 12 teraflops של ביצועי GPU וטכנולוגיית Smart Delivery.",
                Category = "מוצרים חדשים",
                Badges = null
            },
            // Product 4 - Professional Drones (HE)
            new ProductTranslation
            {
                Id = 12,
                ProductId = 4,
                Locale = "he",
                Title = "רחפנים מקצועיים",
                Description = "רחפנים בעלי ביצועים גבוהים לצילום מסחרי, סקרים וטיסות פנאי עם ייצוב מתקדם.",
                Category = "רחפנים",
                Badges = null
            },
            // Product 5 - Smart E-Bikes (HE)
            new ProductTranslation
            {
                Id = 13,
                ProductId = 5,
                Locale = "he",
                Title = "אופניים חשמליים חכמים",
                Description = "אופניים חשמליים עם קישוריות חכמה, סוללות לטווח ארוך ומערכות מנוע מתקדמות לניידות עירונית.",
                Category = "אופניים חשמליים",
                Badges = null
            },
            // Product 6 - 4K Smart TVs (HE)
            new ProductTranslation
            {
                Id = 14,
                ProductId = 6,
                Locale = "he",
                Title = "טלוויזיות חכמות 4K",
                Description = "טלוויזיות חכמות ברזולוציה גבוהה במיוחד עם שדרוג AI, תמיכת HDR ופלטפורמות סטרימינג מובנות.",
                Category = "טלוויזיות",
                Badges = null
            },
            // Product 7 - Gaming Accessories (HE)
            new ProductTranslation
            {
                Id = 15,
                ProductId = 7,
                Locale = "he",
                Title = "אביזרי גיימינג",
                Description = "ציוד היקפי משחקים פרימיום כולל בקרים, אוזניות והגאי מרוץ מהמותגים המובילים.",
                Category = "משחקים",
                Badges = null
            },
            // Product 8 - Smart Home Electronics (HE)
            new ProductTranslation
            {
                Id = 16,
                ProductId = 8,
                Locale = "he",
                Title = "אלקטרוניקה לבית חכם",
                Description = "מכשירים מחוברים לבית כולל רמקולים חכמים, מצלמות אבטחה ומערכות אוטומציה.",
                Category = "אלקטרוניקה",
                Badges = null
            }
        );
    }
}
