# ☁️ Azure App Service Deployment Guide - Consoltech Admin Backend

## Complete Step-by-Step Instructions

### Prerequisites
- Azure account (free tier available at https://azure.microsoft.com/free/)
- GitHub account with consoltech-nexus repository
- Azure CLI installed (optional but recommended)

---

## Part 1: Create Azure App Service

### Option A: Using Azure Portal (Recommended for First-Time Setup)

#### Step 1: Sign in to Azure Portal
1. Go to https://portal.azure.com
2. Sign in with your Microsoft account
3. If you don't have an account, click "Start free" to create one

#### Step 2: Create a Resource Group
1. In the Azure Portal, search for **"Resource groups"**
2. Click **"+ Create"**
3. Fill in the details:
   - **Subscription:** Select your subscription
   - **Resource group name:** `consoltech-rg`
   - **Region:** `West Europe` or `Germany West Central`
4. Click **"Review + create"** → **"Create"**

#### Step 3: Create App Service
1. In the Azure Portal, search for **"App Services"**
2. Click **"+ Create"** → **"Web App"**
3. Fill in the **Basics** tab:
   - **Subscription:** Select your subscription
   - **Resource Group:** `consoltech-rg`
   - **Name:** `consoltech-api` (this will be your URL: consoltech-api.azurewebsites.net)
   - **Publish:** `Code`
   - **Runtime stack:** `.NET 9 (STS)`
   - **Operating System:** `Linux`
   - **Region:** `West Europe` or `Germany West Central`
   
4. **App Service Plan:**
   - Click **"Create new"**
   - Name: `consoltech-plan`
   - **Pricing plan:** Click "Explore pricing plans"
   - Select **"Free F1"** (1 GB RAM, 60 minutes/day compute)
   - Click **"Select"**

5. Click **"Review + create"** → **"Create"**
6. Wait for deployment to complete (1-2 minutes)
7. Click **"Go to resource"**

#### Step 4: Configure App Service Settings
1. In your App Service, go to **"Configuration"** (left menu under Settings)
2. Click **"Application settings"** tab
3. Click **"+ New application setting"** and add:

   **Setting 1:**
   - Name: `ASPNETCORE_ENVIRONMENT`
   - Value: `Production`
   
   **Setting 2:**
   - Name: `JwtSettings__SecretKey`
   - Value: `ConsolTech-Production-SuperSecret-JWT-Key-2024-MinLength32Chars-ChangeInProduction!`

4. Click **"Save"** at the top
5. Click **"Continue"** when prompted

#### Step 5: Enable CORS
1. In your App Service, go to **"CORS"** (left menu under API)
2. Under **"Allowed Origins"**, add:
   ```
   https://consoltech.shop
   ```
   ```
   https://www.consoltech.shop
   ```
   ```
   http://localhost:8080
   ```
3. Check **"Enable Access-Control-Allow-Credentials"**
4. Click **"Save"**

---

## Part 2: Set Up GitHub Actions Deployment

#### Step 6: Get Publish Profile
1. In your App Service, click **"Get publish profile"** (top toolbar)
2. This downloads a `.PublishSettings` file
3. Open the file in a text editor and copy ALL the contents

#### Step 7: Add GitHub Secret
1. Go to your GitHub repository: https://github.com/iziVersano/consoltech-nexus
2. Click **"Settings"** tab
3. Go to **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Fill in:
   - **Name:** `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Secret:** Paste the entire contents of the publish profile file
6. Click **"Add secret"**

#### Step 8: Update Workflow File (Already Done)
The GitHub Actions workflow is already created at `.github/workflows/azure-backend-deploy.yml`

#### Step 9: Trigger Deployment
1. Commit and push the changes (we'll do this together)
2. Go to GitHub → **"Actions"** tab
3. Watch the **"Deploy Backend to Azure App Service"** workflow run
4. Wait for green checkmark ✅ (takes 2-5 minutes)

---

## Part 3: Verify Backend Deployment

#### Step 10: Test Your Backend API
1. Open your browser and visit:
   ```
   https://consoltech-api.azurewebsites.net/api/products
   ```
2. You should see JSON data with products
3. If you see products, the backend is working! ✅

#### Step 11: Check Azure Logs (If Issues)
1. In Azure Portal, go to your App Service
2. Click **"Log stream"** (left menu under Monitoring)
3. Watch for any errors during startup

---

## Part 4: Update Frontend Configuration

#### Step 12: Update Environment Variable
1. Update `.env` file in your project:
   ```env
   VITE_API_URL=https://consoltech-api.azurewebsites.net/api
   ```

2. Update `.env.example`:
   ```env
   # For production
   VITE_API_URL=https://consoltech-api.azurewebsites.net/api
   ```

#### Step 13: Rebuild Frontend
```bash
yarn build
```

#### Step 14: Commit and Push
```bash
git add .
git commit -m "Connect frontend to Azure App Service backend"
git push
```

#### Step 15: Wait for Frontend Deployment
1. Go to GitHub → **"Actions"** tab
2. Wait for **"Deploy to GitHub Pages"** to complete
3. Look for ✅ green checkmark (2-3 minutes)

---

## Part 5: Test Production Admin Login

#### Step 16: Test the Admin Area
1. Go to https://consoltech.shop/admin/login
2. Enter demo credentials:
   - **Email:** admin@consoltech.com
   - **Password:** Admin123!
3. Click **"Login"**
4. You should be redirected to the admin products page ✅

#### Step 17: Verify Full Functionality
- ✅ Login works
- ✅ Products list loads
- ✅ Can add new products
- ✅ Can edit products
- ✅ Can delete products

---

## Option B: Using Azure CLI (Advanced)

If you prefer command line:

```bash
# Login to Azure
az login

# Create resource group
az group create --name consoltech-rg --location westeurope

# Create App Service plan (Free tier)
az appservice plan create \
  --name consoltech-plan \
  --resource-group consoltech-rg \
  --sku F1 \
  --is-linux

# Create web app
az webapp create \
  --name consoltech-api \
  --resource-group consoltech-rg \
  --plan consoltech-plan \
  --runtime "DOTNET:9.0"

# Configure app settings
az webapp config appsettings set \
  --name consoltech-api \
  --resource-group consoltech-rg \
  --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    JwtSettings__SecretKey="ConsolTech-Production-SuperSecret-JWT-Key-2024-MinLength32Chars-ChangeInProduction!"

# Enable CORS
az webapp cors add \
  --name consoltech-api \
  --resource-group consoltech-rg \
  --allowed-origins https://consoltech.shop https://www.consoltech.shop

# Deploy from local
cd backend/Consoltech.AdminApi
az webapp up --name consoltech-api --resource-group consoltech-rg
```

---

## Troubleshooting

### Issue: "Application Error" on Azure
**Solution:**
- Check Azure logs: App Service → Log stream
- Verify .NET 9 runtime is selected
- Check environment variables are set correctly

### Issue: CORS Error
**Solution:**
- Verify CORS settings in Azure Portal include your domain
- Check browser console for specific CORS error
- Ensure "Enable Access-Control-Allow-Credentials" is checked

### Issue: 500 Internal Server Error
**Solution:**
- Check Azure Application Insights or Log stream
- Verify JWT secret is set in Application Settings
- Check database path is writable

### Issue: GitHub Actions Deployment Fails
**Solution:**
- Verify publish profile secret is correctly added
- Check workflow file syntax
- Ensure app name matches in workflow and Azure

---

## Azure Free Tier Limits

- **Compute:** 60 minutes/day
- **Storage:** 1 GB
- **Bandwidth:** 165 MB/day outbound
- **Custom domains:** Not available on Free tier
- **SSL:** Free SSL for *.azurewebsites.net domain

**For production use, consider upgrading to Basic B1 ($13/month) for:**
- Unlimited compute time
- Custom domains
- More storage and bandwidth

---

## Success Checklist

- [ ] Azure account created
- [ ] Resource group created
- [ ] App Service created with .NET 9 runtime
- [ ] Application settings configured
- [ ] CORS enabled for consoltech.shop
- [ ] Publish profile downloaded
- [ ] GitHub secret added
- [ ] Backend deployed via GitHub Actions
- [ ] Backend API tested (visit /api/products)
- [ ] Frontend `.env` updated with Azure URL
- [ ] Frontend rebuilt and deployed
- [ ] Admin login tested at https://consoltech.shop/admin/login
- [ ] Full CRUD operations working

---

## Your Deployment URLs

**Backend API (Azure):**
```
https://consoltech-api.azurewebsites.net
```

**API Endpoints:**
```
https://consoltech-api.azurewebsites.net/api/products
https://consoltech-api.azurewebsites.net/api/auth/login
```

**Frontend (GitHub Pages):**
```
https://consoltech.shop
```

**Admin Login:**
```
https://consoltech.shop/admin/login
```

---

## Next Steps After Deployment

1. **Monitor Usage:** Check Azure Portal → App Service → Metrics
2. **Set Up Alerts:** Configure alerts for downtime or errors
3. **Enable Application Insights:** For detailed monitoring and logging
4. **Upgrade Plan:** If you exceed free tier limits
5. **Implement Real Auth:** Replace hardcoded credentials
6. **Add Database Backups:** Set up regular backups

---

## Quick Reference Commands

### View Azure Logs
```bash
az webapp log tail --name consoltech-api --resource-group consoltech-rg
```

### Restart App Service
```bash
az webapp restart --name consoltech-api --resource-group consoltech-rg
```

### Update Environment Variable
```bash
az webapp config appsettings set \
  --name consoltech-api \
  --resource-group consoltech-rg \
  --settings KEY=VALUE
```

---

**Need Help?**
- Azure Documentation: https://docs.microsoft.com/azure/app-service/
- Azure Support: https://azure.microsoft.com/support/

