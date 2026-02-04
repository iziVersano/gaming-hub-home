# Consoltech Nexus - Product Management System

A modern e-commerce platform for Consoltech featuring a public-facing website and a complete admin management system.

## Project info

**URL**: https://lovable.dev/projects/672a05c6-9955-4d5a-8eb7-547d80d652a2

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/672a05c6-9955-4d5a-8eb7-547d80d652a2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

### Frontend
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **shadcn-ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Swiper** - Touch slider

### Backend
- **.NET 9.0** - Modern web framework
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core 9.0** - ORM
- **SQLite** - Lightweight database
- **JWT Authentication** - Secure token-based auth

## Admin Area Setup

### Backend API Setup

The backend is a .NET Web API that provides product management and authentication.

#### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) or later

#### Running the Backend

1. Navigate to the backend directory:
```sh
cd backend/Consoltech.AdminApi
```

2. Restore dependencies (first time only):
```sh
dotnet restore
```

3. Run the API:
```sh
dotnet run
```

The API will start on:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

The database will be automatically created at `backend/Consoltech.AdminApi/AppData/products.db` with seed data on first run.

#### API Endpoints

**Authentication**
- `POST /api/auth/login` - Login with credentials

**Products** (Public)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID

**Products** (Admin - Requires JWT Token)
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

#### Admin Credentials

**Email:** `admin@consoltech.com`
**Password:** `Admin123!`

> ⚠️ **Security Note**: These are demo credentials. In production, implement proper user management with hashed passwords and secure authentication.

#### JWT Configuration

The API uses JWT tokens for authentication. Token settings are in `appsettings.json`:
- **Secret Key**: Used to sign tokens (change in production!)
- **Issuer**: `Consoltech.AdminApi`
- **Audience**: `Consoltech.Frontend`
- **Expiration**: 8 hours

#### Deploying the Backend API to Production

⚠️ **Important**: The admin area will NOT work on the production website (https://consoltech.shop) until you deploy the backend API to a cloud service.

**Recommended Hosting Options:**

1. **Azure App Service** (Recommended for .NET)
   - Create an Azure account at https://azure.microsoft.com
   - Create a new App Service (Web App)
   - Deploy using Visual Studio, VS Code, or Azure CLI
   - Configure CORS to allow your domain: `https://consoltech.shop`
   - Update connection string for production database
   - Set environment variables for JWT secret

2. **Railway.app** (Easy deployment)
   - Sign up at https://railway.app
   - Connect your GitHub repository
   - Select the backend folder
   - Railway will auto-detect .NET and deploy
   - Add environment variables in Railway dashboard

3. **Render.com** (Free tier available)
   - Sign up at https://render.com
   - Create a new Web Service
   - Connect your GitHub repository
   - Set build command: `cd backend/Consoltech.AdminApi && dotnet publish -c Release -o out`
   - Set start command: `cd backend/Consoltech.AdminApi/out && ./Consoltech.AdminApi`

**After Deployment:**
1. Get your deployed API URL (e.g., `https://your-app.azurewebsites.net`)
2. Update `.env` file: `VITE_API_URL=https://your-app.azurewebsites.net/api`
3. Rebuild and redeploy the frontend: `yarn build` then push to GitHub
4. Update CORS settings in `Program.cs` to include your production domain

### Frontend Setup

#### Environment Variables

Create a `.env` file in the root directory (or copy `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

For production, update this to your deployed API URL.

#### Running Frontend with Backend

1. Start the backend API (see above)

2. In a new terminal, start the frontend:
```sh
npm run dev
```

3. Access the application:
- **Public Site**: `http://localhost:8080`
- **Admin Login**: `http://localhost:8080/admin/login`

### Admin UI Usage

#### Accessing the Admin Area

1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `admin@consoltech.com`
   - Password: `Admin123!`
3. Click "Login"

#### Managing Products

**View Products**
- After login, you'll see the products list at `/admin/products`
- View product images, titles, categories, and prices
- Use Edit or Delete buttons for each product

**Add New Product**
1. Click "Add Product" button
2. Fill in the form:
   - Title (required)
   - Description (required)
   - Category (required) - Select from: Gaming, Electronics, Drones, E-Bikes, TVs
   - Image URL (required) - Use existing Lovable uploads or external URLs
   - Price (required) - In USD
3. Click "Create Product"

**Edit Product**
1. Click the Edit icon on any product
2. Update the fields
3. Click "Update Product"

**Delete Product**
1. Click the Delete icon on any product
2. Confirm the deletion in the dialog

**Logout**
- Click "Logout" in the admin navigation bar

### How Frontend Connects to Backend

#### API Client (`src/lib/api.ts`)

The frontend uses a centralized API client that:

1. **Base URL Configuration**: Reads from `VITE_API_URL` environment variable
2. **Authentication**: Automatically includes JWT token in `Authorization` header
3. **Token Storage**: Stores JWT in `localStorage` as `adminToken`
4. **Error Handling**: Automatically redirects to login on 401 errors
5. **Type Safety**: Uses TypeScript interfaces for all API responses

#### Data Flow

**Public Pages** (`/products`)
- Fetch products from `GET /api/products` (no auth required)
- Display products in grid and slider
- Real-time updates when products are added/edited in admin

**Admin Pages** (`/admin/*`)
- Protected by authentication check
- All mutations (create/update/delete) require JWT token
- Token automatically included in requests
- Redirects to login if token is missing or expired

#### Authentication Flow

1. User submits login form
2. Frontend sends `POST /api/auth/login` with credentials
3. Backend validates and returns JWT token
4. Frontend stores token in `localStorage`
5. All subsequent admin API calls include token in headers
6. On logout, token is removed from `localStorage`

## How can I deploy this project?

### Frontend Deployment

Simply open [Lovable](https://lovable.dev/projects/672a05c6-9955-4d5a-8eb7-547d80d652a2) and click on Share -> Publish.

### Backend Deployment

Deploy the .NET API to:
- **Azure App Service**
- **AWS Elastic Beanstalk**
- **Docker Container**
- **Any hosting service supporting .NET 9.0**

Update `VITE_API_URL` in your frontend environment to point to the deployed API URL.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Project Structure

```
.
├── backend/
│   └── Consoltech.AdminApi/
│       ├── Controllers/          # API endpoints
│       ├── Data/                 # Database context
│       ├── DTOs/                 # Data transfer objects
│       ├── Models/               # Entity models
│       ├── AppData/              # SQLite database
│       ├── Program.cs            # App configuration
│       └── appsettings.json      # Configuration
├── src/
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn-ui components
│   │   ├── AdminLayout.tsx       # Admin page layout
│   │   ├── Navigation.tsx        # Public site nav
│   │   └── ProductSlider.tsx     # Product carousel
│   ├── pages/
│   │   ├── admin/                # Admin pages
│   │   │   ├── Login.tsx         # Admin login
│   │   │   ├── Products.tsx      # Products list
│   │   │   └── ProductForm.tsx   # Add/Edit form
│   │   ├── Index.tsx             # Home page
│   │   ├── Products.tsx          # Public products
│   │   └── ...
│   ├── lib/
│   │   └── api.ts                # API client
│   └── App.tsx                   # Route configuration
├── .env                          # Environment variables
└── package.json                  # Dependencies
```

## Troubleshooting

### Backend Issues

**Port already in use**
```sh
# Change port in launchSettings.json or use:
dotnet run --urls "http://localhost:5002"
```

**Database errors**
```sh
# Delete and recreate database:
rm -rf backend/Consoltech.AdminApi/AppData
dotnet run
```

### Frontend Issues

**API connection failed**
- Ensure backend is running on `http://localhost:5000`
- Check `.env` file has correct `VITE_API_URL`
- Verify CORS is enabled in backend

**Authentication not working**
- Clear browser localStorage
- Check JWT token in browser DevTools > Application > Local Storage
- Verify credentials: `admin@consoltech.com` / `Admin123!`

## License

This project is part of the Lovable platform.
