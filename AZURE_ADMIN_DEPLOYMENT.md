# Azure Admin UI Deployment Guide

## Overview

This guide explains how to deploy the Consoltech Admin UI to Azure Web App at:
**https://consoltech-admin.azurewebsites.net**

## Project Structure

The Admin UI is part of the main React application located in the **root directory**:

```
consoltech-nexus/
├── src/
│   ├── pages/
│   │   ├── admin/           # Admin pages
│   │   │   ├── Login.tsx
│   │   │   ├── Products.tsx
│   │   │   └── ProductForm.tsx
│   │   ├── Index.tsx        # Public homepage
│   │   ├── About.tsx        # Public pages
│   │   └── ...
│   └── components/
│       └── AdminLayout.tsx  # Admin layout wrapper
├── public/
│   └── 404.html            # SPA fallback for Azure
├── vite.config.ts          # Vite configuration
├── package.json
└── index.html
```

## Configuration

### 1. Vite Configuration (`vite.config.ts`)

Already configured for Azure deployment:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "/",  // Root deployment for Azure
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
});
```

### 2. SPA Fallback (`public/404.html`)

Already created - this file is a copy of `index.html` and ensures Azure serves the React app for all routes like `/admin/products`.

## GitHub Actions Workflow

### Workflow File: `.github/workflows/deploy-admin-ui.yml`

The workflow automatically deploys to Azure when changes are pushed to the `main` branch.

**Triggers on changes to:**
- `src/**`
- `public/**`
- `vite.config.ts`
- `package.json`
- `index.html`
- The workflow file itself

**Deployment Steps:**
1. Checkout repository
2. Setup Node.js 18
3. Install dependencies (`npm install`)
4. Build project (`npm run build`)
5. Deploy `dist` folder to Azure Web App

## Azure Setup Required

### Step 1: Create Azure Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Web App** with these settings:
   - **Name:** `consoltech-admin`
   - **Runtime:** Node 18 LTS
   - **Operating System:** Linux
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Choose appropriate tier

### Step 2: Download Publish Profile

1. In Azure Portal, go to your Web App
2. Click **"Get publish profile"** in the Overview section
3. Download the `.PublishSettings` file
4. Open the file and copy its entire contents

### Step 3: Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Name: `AZURE_ADMIN_PUBLISH_PROFILE`
5. Value: Paste the entire publish profile content
6. Click **"Add secret"**

### Step 4: Configure Azure for SPA

In Azure Portal, configure your Web App:

1. Go to **Configuration → General settings**
2. Set **Startup Command:** (leave empty for static sites)
3. Go to **Configuration → Application settings**
4. Add these settings if needed:
   - `WEBSITE_NODE_DEFAULT_VERSION`: `18-lts`

## Deployment Process

### Automatic Deployment

Once the GitHub secret is configured, the workflow will automatically deploy when you push changes to `main`:

```bash
git add .
git commit -m "Update admin UI"
git push origin main
```

### Manual Deployment

You can also trigger the workflow manually:

1. Go to **Actions** tab in GitHub
2. Select **"Deploy Admin UI to Azure"**
3. Click **"Run workflow"**
4. Select branch and click **"Run workflow"**

## Verification

After deployment completes:

1. Visit: **https://consoltech-admin.azurewebsites.net**
2. Test these routes:
   - `/admin/login` - Admin login page
   - `/admin/products` - Products management (requires login)
   - `/admin/products/new` - Add new product (requires login)

## Important Notes

### What Gets Deployed

The entire React application (including both public and admin routes) is deployed to Azure. However, users will primarily access the `/admin/*` routes.

### What's NOT Affected

- ✅ Public website at `https://consoltech.shop` (GitHub Pages) - **unchanged**
- ✅ Backend API at `backend/` - **unchanged**
- ✅ DNS settings - **unchanged**

### Admin Routes

The following admin routes are available:
- `/admin/login` - Login page
- `/admin/products` - Products list (protected)
- `/admin/products/new` - Add product (protected)
- `/admin/products/edit/:id` - Edit product (protected)

## Troubleshooting

### Workflow Fails

- Check that `AZURE_ADMIN_PUBLISH_PROFILE` secret is correctly set
- Verify the publish profile is from the correct Azure Web App
- Check workflow logs in GitHub Actions

### 404 Errors on Routes

- Ensure `public/404.html` exists and is a copy of `index.html`
- Verify Azure is serving static files correctly

### Build Fails

- Check Node.js version (should be 18)
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

## Local Testing

Test the build locally before deploying:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the build
npm run preview
```

Then visit `http://localhost:4173/admin/login` to test admin routes.

## Support

For issues with:
- **Azure deployment:** Check Azure Portal logs
- **GitHub Actions:** Check workflow run logs
- **Application errors:** Check browser console and network tab

