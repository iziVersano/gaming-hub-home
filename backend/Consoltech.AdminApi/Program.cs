// Consoltech Admin API - Backend Service for Render
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Consoltech.AdminApi.Data;
using Consoltech.AdminApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure for Render - listen on PORT environment variable
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL Database (Render) or SQLite (local development)
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
if (!string.IsNullOrEmpty(databaseUrl))
{
    // Parse Render PostgreSQL connection string format: postgres://user:password@host:port/database
    var connectionString = ConvertPostgresUrlToConnectionString(databaseUrl);
    builder.Services.AddDbContext<ProductsDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    // Local development fallback to SQLite
    var dbPath = Path.Combine(builder.Environment.ContentRootPath, "AppData", "products.db");
    var dbDirectory = Path.GetDirectoryName(dbPath);
    if (!Directory.Exists(dbDirectory))
    {
        Directory.CreateDirectory(dbDirectory!);
    }
    builder.Services.AddDbContext<ProductsDbContext>(options =>
        options.UseSqlite($"Data Source={dbPath}"));
}

// Register Local Storage service (for warranty uploads)
builder.Services.AddSingleton<LocalStorageService>();

// Configure JWT Authentication
var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
    ?? builder.Configuration["JwtSettings:SecretKey"]
    ?? "ConsolTechSuperSecretKey2024!@#$%^&*()";
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
    ?? builder.Configuration["JwtSettings:Issuer"]
    ?? "Consoltech.AdminApi";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
    ?? builder.Configuration["JwtSettings:Audience"]
    ?? "Consoltech.Frontend";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
    };
});

builder.Services.AddAuthorization();

// Configure CORS - allow frontend origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://consoltech.shop",
            "https://www.consoltech.shop",
            "http://localhost:5173",
            "https://localhost:5173",
            "http://localhost:8080",
            "https://localhost:8080"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});


var app = builder.Build();

// Initialize database and run migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ProductsDbContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline
// Swagger enabled in all environments
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Consoltech API V1");
    c.RoutePrefix = "swagger";
});

// Serve static files (for uploaded images and warranty invoices)
app.UseStaticFiles();

// Serve warranty uploads from AppData/warranty-uploads
var warrantyUploadsPath = Path.Combine(builder.Environment.ContentRootPath, "AppData", "warranty-uploads");
if (!Directory.Exists(warrantyUploadsPath))
{
    Directory.CreateDirectory(warrantyUploadsPath);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(warrantyUploadsPath),
    RequestPath = "/warranty-uploads"
});

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Helper function to convert Render's DATABASE_URL format to Npgsql connection string
static string ConvertPostgresUrlToConnectionString(string databaseUrl)
{
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');
    var host = uri.Host;
    var port = uri.Port > 0 ? uri.Port : 5432;
    var database = uri.AbsolutePath.TrimStart('/');
    var username = userInfo[0];
    var password = userInfo.Length > 1 ? userInfo[1] : "";

    return $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
}
