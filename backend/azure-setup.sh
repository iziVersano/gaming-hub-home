#!/bin/bash

# Azure App Service Setup Script for Consoltech Admin Backend
# This script automates the creation of Azure resources

set -e

echo "🚀 Consoltech Backend - Azure App Service Setup"
echo "================================================"
echo ""

# Configuration
RESOURCE_GROUP="consoltech-rg"
APP_SERVICE_PLAN="consoltech-plan"
APP_NAME="consoltech-api"
LOCATION="westeurope"
RUNTIME="DOTNET:9.0"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed."
    echo "Please install it from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

echo "✅ Azure CLI found"
echo ""

# Login to Azure
echo "🔐 Logging in to Azure..."
az login

echo ""
echo "📦 Creating Azure resources..."
echo ""

# Create Resource Group
echo "1️⃣ Creating resource group: $RESOURCE_GROUP"
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --output table

echo ""

# Create App Service Plan (Free tier)
echo "2️⃣ Creating App Service plan: $APP_SERVICE_PLAN (Free tier)"
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku F1 \
  --is-linux \
  --output table

echo ""

# Create Web App
echo "3️⃣ Creating Web App: $APP_NAME"
az webapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --runtime "$RUNTIME" \
  --output table

echo ""

# Configure App Settings
echo "4️⃣ Configuring application settings..."
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    JwtSettings__SecretKey="ConsolTech-Production-SuperSecret-JWT-Key-2024-MinLength32Chars-ChangeInProduction!" \
  --output table

echo ""

# Enable CORS
echo "5️⃣ Enabling CORS..."
az webapp cors add \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --allowed-origins \
    https://consoltech.shop \
    https://www.consoltech.shop \
    http://localhost:8080

az webapp cors credentials set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --enable true

echo ""

# Get publish profile
echo "6️⃣ Downloading publish profile..."
az webapp deployment list-publishing-profiles \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --xml > publish-profile.xml

echo ""
echo "✅ Azure resources created successfully!"
echo ""
echo "📋 Summary:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  App Service Plan: $APP_SERVICE_PLAN"
echo "  Web App: $APP_NAME"
echo "  URL: https://$APP_NAME.azurewebsites.net"
echo ""
echo "📄 Publish profile saved to: publish-profile.xml"
echo ""
echo "🔑 Next steps:"
echo "  1. Add the publish profile to GitHub Secrets:"
echo "     - Go to: https://github.com/iziVersano/consoltech-nexus/settings/secrets/actions"
echo "     - Create secret: AZURE_WEBAPP_PUBLISH_PROFILE"
echo "     - Paste contents of publish-profile.xml"
echo ""
echo "  2. Push your code to trigger deployment:"
echo "     git push"
echo ""
echo "  3. Test your API:"
echo "     https://$APP_NAME.azurewebsites.net/api/products"
echo ""

