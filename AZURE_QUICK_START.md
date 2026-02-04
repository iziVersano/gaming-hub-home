# ⚡ Azure Deployment - Quick Start Guide

## 🎯 Goal
Deploy the Consoltech Admin backend to Azure App Service so the admin login works on production.

---

## 📋 Prerequisites Checklist

- [ ] Azure account (get free at https://azure.microsoft.com/free/)
- [ ] Azure CLI installed (https://aka.ms/installazurecli)
- [ ] GitHub account access to consoltech-nexus repository

---

## 🚀 Quick Deployment (3 Options)

### Option 1: Automated Script (Fastest - 5 minutes)

**For Windows (PowerShell):**
```powershell
cd backend
.\azure-setup.ps1
```

**For Mac/Linux (Bash):**
```bash
cd backend
chmod +x azure-setup.sh
./azure-setup.sh
```

This script will:
- ✅ Create Azure resource group
- ✅ Create App Service (Free tier)
- ✅ Configure environment variables
- ✅ Enable CORS
- ✅ Download publish profile

### Option 2: Azure Portal (Manual - 10 minutes)

1. **Go to Azure Portal:** https://portal.azure.com
2. **Create Web App:**
   - Name: `consoltech-api`
   - Runtime: `.NET 9`
   - Region: `West Europe`
   - Plan: `Free F1`
3. **Configure Settings:**
   - Add environment variables (see guide)
   - Enable CORS for consoltech.shop
4. **Download publish profile**

### Option 3: Azure CLI (Command Line - 5 minutes)

```bash
# Login
az login

# Create resources
az group create --name consoltech-rg --location westeurope
az appservice plan create --name consoltech-plan --resource-group consoltech-rg --sku F1 --is-linux
az webapp create --name consoltech-api --resource-group consoltech-rg --plan consoltech-plan --runtime "DOTNET:9.0"

# Configure
az webapp config appsettings set --name consoltech-api --resource-group consoltech-rg \
  --settings ASPNETCORE_ENVIRONMENT=Production \
  JwtSettings__SecretKey="ConsolTech-Production-SuperSecret-JWT-Key-2024-MinLength32Chars-ChangeInProduction!"

# Enable CORS
az webapp cors add --name consoltech-api --resource-group consoltech-rg \
  --allowed-origins https://consoltech.shop https://www.consoltech.shop
```

---

## 🔑 After Azure Setup - GitHub Configuration

### Step 1: Get Publish Profile
- In Azure Portal → Your App Service → Click "Get publish profile"
- Save the downloaded `.PublishSettings` file

### Step 2: Add to GitHub Secrets
1. Go to: https://github.com/iziVersano/consoltech-nexus/settings/secrets/actions
2. Click "New repository secret"
3. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Value: Paste entire contents of publish profile file
5. Click "Add secret"

### Step 3: Trigger Deployment
The GitHub Actions workflow will automatically deploy when you push to main.
Check progress at: https://github.com/iziVersano/consoltech-nexus/actions

---

## 🧪 Test Backend Deployment

Once deployed, test your API:

```bash
# Test products endpoint
curl https://consoltech-api.azurewebsites.net/api/products

# Or open in browser:
https://consoltech-api.azurewebsites.net/api/products
```

You should see JSON with product data ✅

---

## 🌐 Update Frontend

### Step 1: Update .env file
```env
VITE_API_URL=https://consoltech-api.azurewebsites.net/api
```

### Step 2: Rebuild and Deploy
```bash
yarn build
git add .
git commit -m "Connect to Azure backend"
git push
```

### Step 3: Wait for GitHub Actions
- Go to: https://github.com/iziVersano/consoltech-nexus/actions
- Wait for "Deploy to GitHub Pages" to complete (2-3 min)

---

## ✅ Test Production Admin

1. Go to: https://consoltech.shop/admin/login
2. Login with:
   - Email: `admin@consoltech.com`
   - Password: `Admin123!`
3. Should redirect to admin products page ✅

---

## 🆘 Troubleshooting

### Backend not deploying?
- Check GitHub Actions logs
- Verify publish profile secret is added correctly
- Ensure app name matches in workflow file

### CORS errors?
- Verify CORS settings in Azure Portal include your domain
- Check browser console for specific error

### 500 errors?
- Check Azure logs: App Service → Log stream
- Verify environment variables are set

---

## 📚 Full Documentation

For detailed step-by-step instructions, see:
- **AZURE_DEPLOYMENT_GUIDE.md** - Complete guide with screenshots
- **backend/DEPLOYMENT.md** - General deployment options

---

## 🎉 Success Checklist

- [ ] Azure App Service created
- [ ] Publish profile added to GitHub Secrets
- [ ] Backend deployed (check GitHub Actions)
- [ ] Backend API tested (visit /api/products)
- [ ] Frontend .env updated
- [ ] Frontend rebuilt and deployed
- [ ] Admin login tested and working

---

## 📞 Your URLs

**Backend API:**
```
https://consoltech-api.azurewebsites.net
```

**Frontend:**
```
https://consoltech.shop
```

**Admin Login:**
```
https://consoltech.shop/admin/login
```

---

## 💰 Cost

**Azure Free Tier:**
- 60 minutes/day compute
- 1 GB storage
- Perfect for development/testing

**Upgrade to Basic B1 ($13/month) for:**
- Unlimited compute
- Custom domains
- More resources

---

**Need help?** Check the full guide in AZURE_DEPLOYMENT_GUIDE.md

