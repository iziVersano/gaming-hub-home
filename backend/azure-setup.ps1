# Azure App Service Setup Script for Consoltech Admin Backend
# PowerShell version for Windows users

Write-Host "🚀 Consoltech Backend - Azure App Service Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$RESOURCE_GROUP = "consoltech-rg"
$APP_SERVICE_PLAN = "consoltech-plan"
$APP_NAME = "consoltech-api"
$LOCATION = "westeurope"
$RUNTIME = "DOTNET:9.0"

# Check if Azure CLI is installed
try {
    az --version | Out-Null
    Write-Host "✅ Azure CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it from: https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Login to Azure
Write-Host "🔐 Logging in to Azure..." -ForegroundColor Yellow
az login

Write-Host ""
Write-Host "📦 Creating Azure resources..." -ForegroundColor Cyan
Write-Host ""

# Create Resource Group
Write-Host "1️⃣ Creating resource group: $RESOURCE_GROUP" -ForegroundColor Yellow
az group create `
  --name $RESOURCE_GROUP `
  --location $LOCATION `
  --output table

Write-Host ""

# Create App Service Plan (Free tier)
Write-Host "2️⃣ Creating App Service plan: $APP_SERVICE_PLAN (Free tier)" -ForegroundColor Yellow
az appservice plan create `
  --name $APP_SERVICE_PLAN `
  --resource-group $RESOURCE_GROUP `
  --sku F1 `
  --is-linux `
  --output table

Write-Host ""

# Create Web App
Write-Host "3️⃣ Creating Web App: $APP_NAME" -ForegroundColor Yellow
az webapp create `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --plan $APP_SERVICE_PLAN `
  --runtime $RUNTIME `
  --output table

Write-Host ""

# Configure App Settings
Write-Host "4️⃣ Configuring application settings..." -ForegroundColor Yellow
az webapp config appsettings set `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --settings `
    ASPNETCORE_ENVIRONMENT=Production `
    "JwtSettings__SecretKey=ConsolTech-Production-SuperSecret-JWT-Key-2024-MinLength32Chars-ChangeInProduction!" `
  --output table

Write-Host ""

# Enable CORS
Write-Host "5️⃣ Enabling CORS..." -ForegroundColor Yellow
az webapp cors add `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --allowed-origins `
    https://consoltech.shop `
    https://www.consoltech.shop `
    http://localhost:8080

az webapp cors credentials set `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --enable true

Write-Host ""

# Get publish profile
Write-Host "6️⃣ Downloading publish profile..." -ForegroundColor Yellow
az webapp deployment list-publishing-profiles `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --xml > publish-profile.xml

Write-Host ""
Write-Host "✅ Azure resources created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  Resource Group: $RESOURCE_GROUP"
Write-Host "  App Service Plan: $APP_SERVICE_PLAN"
Write-Host "  Web App: $APP_NAME"
Write-Host "  URL: https://$APP_NAME.azurewebsites.net"
Write-Host ""
Write-Host "📄 Publish profile saved to: publish-profile.xml" -ForegroundColor Green
Write-Host ""
Write-Host "🔑 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Add the publish profile to GitHub Secrets:"
Write-Host "     - Go to: https://github.com/iziVersano/consoltech-nexus/settings/secrets/actions"
Write-Host "     - Create secret: AZURE_WEBAPP_PUBLISH_PROFILE"
Write-Host "     - Paste contents of publish-profile.xml"
Write-Host ""
Write-Host "  2. Push your code to trigger deployment:"
Write-Host "     git push"
Write-Host ""
Write-Host "  3. Test your API:"
Write-Host "     https://$APP_NAME.azurewebsites.net/api/products"
Write-Host ""

