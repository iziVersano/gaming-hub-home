using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Consoltech.AdminApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Sku = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    Flags = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WarrantySubmissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RowKey = table.Column<string>(type: "text", nullable: false),
                    CustomerName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Product = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SerialNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    InvoiceUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    InvoiceFileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarrantySubmissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProductId = table.Column<int>(type: "integer", nullable: false),
                    Locale = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    Badges = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductTranslations_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Flags", "ImageUrl", "Price", "Sku" },
                values: new object[,]
                {
                    { 1, "featured,new", "/images/nintendo-switch-2-product.jpg", 449.99m, "NS2-2024" },
                    { 2, "featured,new", "/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png", 499.99m, "PS5-STD" },
                    { 3, "new", "/images/78a95f48-606e-44b6-950e-af0555a3f04f.png", 449.99m, "XSX-2024" },
                    { 4, null, "/images/07ba8bc0-8d14-4d62-a534-659913ac5f99.png", 1299.99m, "DRN-PRO" },
                    { 5, null, "/images/a0bd3ab6-05d5-4312-b6ec-f0e256d7a63a.png", 1899.99m, "EBIKE-SMART" },
                    { 6, null, "/images/6df37998-af04-426e-b749-365ffeb66787.png", 799.99m, "TV-4K-55" },
                    { 7, null, "/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png", 149.99m, "GAME-ACC" },
                    { 8, null, "/images/6df37998-af04-426e-b749-365ffeb66787.png", 299.99m, "SMART-HOME" }
                });

            migrationBuilder.InsertData(
                table: "ProductTranslations",
                columns: new[] { "Id", "Badges", "Category", "Description", "Locale", "ProductId", "Title" },
                values: new object[,]
                {
                    { 1, "Featured,Hot", "New Arrivals", "The next generation of Nintendo gaming. Experience enhanced graphics, faster performance, and an expanded game library. Features a larger display, improved Joy-Con controllers, and backward compatibility.", "en", 1, "Nintendo Switch 2" },
                    { 2, "Featured", "New Arrivals", "Next-generation gaming console with ultra-fast SSD and ray tracing technology. Experience lightning-fast loading and stunning graphics.", "en", 2, "PlayStation 5" },
                    { 3, null, "New Arrivals", "The most powerful Xbox ever with 12 teraflops of GPU performance and Smart Delivery technology.", "en", 3, "Xbox Series X" },
                    { 4, null, "Drones", "High-performance drones for commercial photography, surveying, and recreational flying with advanced stabilization.", "en", 4, "Professional Drones" },
                    { 5, null, "E-Bikes", "Electric bikes with smart connectivity, long-range batteries, and advanced motor systems for urban mobility.", "en", 5, "Smart E-Bikes" },
                    { 6, null, "TVs", "Ultra-high definition smart TVs with AI upscaling, HDR support, and built-in streaming platforms.", "en", 6, "4K Smart TVs" },
                    { 7, null, "Gaming", "Premium gaming peripherals including controllers, headsets, and racing wheels from top brands.", "en", 7, "Gaming Accessories" },
                    { 8, null, "Electronics", "Connected home devices including smart speakers, security cameras, and automation systems.", "en", 8, "Smart Home Electronics" },
                    { 9, "מומלץ,לוהט", "מוצרים חדשים", "הדור הבא של משחקי נינטנדו. חוו גרפיקה משופרת, ביצועים מהירים יותר וספריית משחקים מורחבת. כולל מסך גדול יותר, בקרי Joy-Con משופרים ותאימות לאחור.", "he", 1, "נינטנדו סוויץ' 2" },
                    { 10, "מומלץ", "מוצרים חדשים", "קונסולת משחקים מהדור הבא עם SSD במהירות אולטרה וטכנולוגיית Ray Tracing. חוו טעינה במהירות הבזק וגרפיקה מדהימה.", "he", 2, "פלייסטיישן 5" },
                    { 11, null, "מוצרים חדשים", "ה-Xbox החזק ביותר אי פעם עם 12 teraflops של ביצועי GPU וטכנולוגיית Smart Delivery.", "he", 3, "אקסבוקס סדרה X" },
                    { 12, null, "רחפנים", "רחפנים בעלי ביצועים גבוהים לצילום מסחרי, סקרים וטיסות פנאי עם ייצוב מתקדם.", "he", 4, "רחפנים מקצועיים" },
                    { 13, null, "אופניים חשמליים", "אופניים חשמליים עם קישוריות חכמה, סוללות לטווח ארוך ומערכות מנוע מתקדמות לניידות עירונית.", "he", 5, "אופניים חשמליים חכמים" },
                    { 14, null, "טלוויזיות", "טלוויזיות חכמות ברזולוציה גבוהה במיוחד עם שדרוג AI, תמיכת HDR ופלטפורמות סטרימינג מובנות.", "he", 6, "טלוויזיות חכמות 4K" },
                    { 15, null, "משחקים", "ציוד היקפי משחקים פרימיום כולל בקרים, אוזניות והגאי מרוץ מהמותגים המובילים.", "he", 7, "אביזרי גיימינג" },
                    { 16, null, "אלקטרוניקה", "מכשירים מחוברים לבית כולל רמקולים חכמים, מצלמות אבטחה ומערכות אוטומציה.", "he", 8, "אלקטרוניקה לבית חכם" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductTranslations_ProductId_Locale",
                table: "ProductTranslations",
                columns: new[] { "ProductId", "Locale" });

            migrationBuilder.CreateIndex(
                name: "IX_WarrantySubmissions_Email",
                table: "WarrantySubmissions",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_WarrantySubmissions_RowKey",
                table: "WarrantySubmissions",
                column: "RowKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WarrantySubmissions_SerialNumber",
                table: "WarrantySubmissions",
                column: "SerialNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductTranslations");

            migrationBuilder.DropTable(
                name: "WarrantySubmissions");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
