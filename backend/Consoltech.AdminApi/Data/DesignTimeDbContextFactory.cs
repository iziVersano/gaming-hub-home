using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Consoltech.AdminApi.Data;

/// <summary>
/// Design-time factory for EF Core migrations.
/// Forces PostgreSQL provider for migration generation to ensure compatibility with Render.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ProductsDbContext>
{
    public ProductsDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ProductsDbContext>();

        // Use PostgreSQL for migrations (matches Render production environment)
        // This is a dummy connection string - only used for generating migration SQL
        optionsBuilder.UseNpgsql("Host=localhost;Database=consoltech;Username=postgres;Password=postgres");

        return new ProductsDbContext(optionsBuilder.Options);
    }
}
