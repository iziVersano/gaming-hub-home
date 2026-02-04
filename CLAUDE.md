# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Consoltech Nexus is an e-commerce platform with a React/TypeScript frontend and .NET 9.0 backend API. The frontend is a public-facing product catalog with an admin panel for product management.

## Development Commands

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:8080)
npm run build        # Production build
npm run lint         # ESLint check
```

### Backend (.NET API)
```bash
cd backend/Consoltech.AdminApi
dotnet restore       # Restore dependencies
dotnet run           # Start API server (http://localhost:8080)
dotnet build         # Build project
```

## Architecture

### Frontend (src/)
- **React 18 + Vite + TypeScript** with TanStack Query for data fetching
- **UI**: shadcn-ui components in `src/components/ui/` with Tailwind CSS
- **Routing**: React Router v6 in `App.tsx`
- **API Client**: `src/lib/api.ts` - centralized fetch wrapper with JWT auth, auto-redirect on 401
- **Path alias**: `@/` maps to `src/`

### Backend (backend/Consoltech.AdminApi/)
- **ASP.NET Core Web API** with Entity Framework Core 9.0
- **Database**: SQLite at `AppData/products.db` (auto-created with seed data)
- **Auth**: JWT tokens (8hr expiration)
- **Controllers**: `AuthController`, `ProductsController`, `UploadController`, `WarrantyController`
- **Azure Services**: `BlobStorageService` and `TableStorageService` for cloud storage

### Key Data Flow
- Public pages fetch from `/api/products` (no auth)
- Admin pages (`/admin/*`) require JWT token stored in `localStorage` as `adminToken`
- `src/lib/api.ts` has `FALLBACK_PRODUCTS` used when API is unavailable

### Routes
- Public: `/`, `/about`, `/products`, `/contact`, `/warranty`, `/accessibility`
- Admin: `/admin/login`, `/admin/products`, `/admin/products/new`, `/admin/products/edit/:id`, `/admin/warranty-records`

## Environment Configuration

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Backend JWT config in `appsettings.json` with issuer `Consoltech.AdminApi` and audience `Consoltech.Frontend`.

## Admin Credentials (Development)
- Email: `admin@consoltech.com`
- Password: `Admin123!`
