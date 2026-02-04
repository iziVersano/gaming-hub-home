import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, FileText, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/AdminLayout';
import { isAuthenticated } from '@/lib/api';
import { USE_MOCK_DATA, getMockProducts, getMockWarrantyRecords } from '@/lib/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DashboardStats {
  productsCount: number;
  warrantyCount: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({ productsCount: 0, warrantyCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    const fetchStats = async () => {
      try {
        let products: unknown[] = [];
        let warranties: unknown[] = [];

        if (USE_MOCK_DATA) {
          // Use mock data for local development
          [products, warranties] = await Promise.all([
            getMockProducts(),
            getMockWarrantyRecords()
          ]);
        } else {
          // Fetch from API in production
          const [productsRes, warrantyRes] = await Promise.all([
            fetch(`${API_BASE_URL}/products`),
            fetch(`${API_BASE_URL}/warranty`)
          ]);

          products = productsRes.ok ? await productsRes.json() : [];
          warranties = warrantyRes.ok ? await warrantyRes.json() : [];
        }

        setStats({
          productsCount: Array.isArray(products) ? products.length : 0,
          warrantyCount: Array.isArray(warranties) ? warranties.length : 0,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard | Admin | Consoltech</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Consoltech Admin Panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products Card */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-3xl font-bold">{stats.productsCount}</span>
              )}
            </div>
            <h3 className="font-semibold mb-1">Products</h3>
            <p className="text-sm text-muted-foreground mb-4">Manage your product catalog</p>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/admin/products">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/admin/products/new">
                  <Plus className="h-4 w-4" />
                  Add
                </Link>
              </Button>
            </div>
          </div>

          {/* Warranties Card */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FileText className="h-6 w-6 text-green-500" />
              </div>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-3xl font-bold">{stats.warrantyCount}</span>
              )}
            </div>
            <h3 className="font-semibold mb-1">Warranty Records</h3>
            <p className="text-sm text-muted-foreground mb-4">Customer warranty registrations</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/admin/warranty-records">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Quick Links Card */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <ArrowRight className="h-6 w-6 text-accent" />
              </div>
            </div>
            <h3 className="font-semibold mb-1">Quick Links</h3>
            <p className="text-sm text-muted-foreground mb-4">Navigate to key areas</p>
            <div className="space-y-2">
              <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                <Link to="/" target="_blank">
                  View Website
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                <Link to="/warranty" target="_blank">
                  Warranty Form
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Management Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-muted-foreground">Products Management</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Add new products to catalog
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Edit product details and pricing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Upload product images
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Remove outdated products
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-muted-foreground">Warranty Management</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  View customer warranty registrations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Download invoice attachments
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Track serial numbers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Delete invalid records
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
