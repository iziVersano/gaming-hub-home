# Backend API Deployment Guide

## Quick Deploy to Azure App Service (Recommended)

### Prerequisites
- Azure account (free tier available at https://azure.microsoft.com/free/)
- Azure CLI installed (https://docs.microsoft.com/cli/azure/install-azure-cli)
- .NET 9.0 SDK installed

### Step 1: Prepare for Production

1. **Update CORS settings** in `Program.cs` to include your production domain:
```csharp
policy.WithOrigins("http://localhost:8080", "http://localhost:5173", "https://consoltech.shop")
```

2. **Change JWT Secret** in `appsettings.json` to a strong random key:
```json
"SecretKey": "YOUR-SUPER-SECRET-KEY-AT-LEAST-32-CHARACTERS-LONG!"
```

3. **Update Database** for production (optional - SQLite works but consider upgrading):
   - For small scale: Keep SQLite
   - For production: Consider Azure SQL Database or PostgreSQL

### Step 2: Deploy to Azure

#### Option A: Using Azure CLI (Fastest)

```bash
# Login to Azure
az login

# Create a resource group
az group create --name consoltech-rg --location eastus

# Create an App Service plan (Free tier)
az appservice plan create --name consoltech-plan --resource-group consoltech-rg --sku F1 --is-linux

# Create the web app
az webapp create --name consoltech-api --resource-group consoltech-rg --plan consoltech-plan --runtime "DOTNET|9.0"

# Deploy the code
cd backend/Consoltech.AdminApi
az webapp up --name consoltech-api --resource-group consoltech-rg

# Your API will be available at: https://consoltech-api.azurewebsites.net
```

#### Option B: Using Visual Studio

1. Right-click on `Consoltech.AdminApi` project
2. Select **Publish**
3. Choose **Azure** → **Azure App Service (Linux)**
4. Sign in to your Azure account
5. Create new App Service or select existing
6. Click **Publish**

#### Option C: Using VS Code

1. Install Azure App Service extension
2. Open Command Palette (Ctrl+Shift+P)
3. Run: **Azure App Service: Deploy to Web App**
4. Follow the prompts

### Step 3: Configure Environment Variables in Azure

```bash
# Set JWT secret
az webapp config appsettings set --name consoltech-api --resource-group consoltech-rg --settings JwtSettings__SecretKey="YOUR-SECRET-KEY"

# Enable HTTPS only
az webapp update --name consoltech-api --resource-group consoltech-rg --https-only true
```

### Step 4: Update Frontend Configuration

1. Update `.env` file:
```env
VITE_API_URL=https://consoltech-api.azurewebsites.net/api
```

2. Rebuild frontend:
```bash
yarn build
```

3. Commit and push to deploy:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### Step 5: Test the Deployment

1. Visit: `https://consoltech-api.azurewebsites.net/api/products`
2. You should see the products JSON response
3. Visit: `https://consoltech.shop/admin/login`
4. Login with demo credentials should now work!

## Alternative: Deploy to Railway.app (Easier)

1. Sign up at https://railway.app
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway will auto-detect .NET
5. Set root directory: `backend/Consoltech.AdminApi`
6. Add environment variables in Railway dashboard
7. Deploy!

Your API will be at: `https://your-app.railway.app`

## Alternative: Deploy to Render.com (Free Tier)

1. Sign up at https://render.com
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: consoltech-api
   - **Root Directory**: `backend/Consoltech.AdminApi`
   - **Build Command**: `dotnet publish -c Release -o out`
   - **Start Command**: `cd out && ./Consoltech.AdminApi`
5. Add environment variables
6. Deploy!

## Troubleshooting

### CORS Errors
- Ensure your production domain is in the CORS policy
- Check browser console for specific CORS errors

### Database Issues
- SQLite database will be created automatically on first run
- For persistent storage on Azure, use Azure Files or upgrade to SQL Database

### 500 Errors
- Check Azure logs: `az webapp log tail --name consoltech-api --resource-group consoltech-rg`
- Verify environment variables are set correctly

## Security Checklist

- [ ] Changed JWT secret key from default
- [ ] Enabled HTTPS only
- [ ] Updated CORS to only allow your domain
- [ ] Implemented proper user management (replace hardcoded credentials)
- [ ] Set up proper database with backups
- [ ] Enable Azure Application Insights for monitoring

