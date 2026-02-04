import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Package, LayoutDashboard, FileText } from 'lucide-react';
import { removeAuthToken } from '@/lib/api';
import { useI18n } from '@/hooks/I18nContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navbar */}
      <nav className="nav-glass border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/admin" className="flex items-center gap-2">
                <span className="logo-text text-xl">
                  <span className="logo-consol">CONSOL</span>
                  <span className="logo-tech">TECH</span>
                </span>
                <span className="text-xs text-muted-foreground">{t('admin.layout.admin')}</span>
              </Link>

              <div className="hidden md:flex items-center gap-2">
                <Button
                  asChild
                  variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Link to="/admin">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={isActive('/admin/products') ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Link to="/admin/products">
                    <Package className="h-4 w-4" />
                    <span>{t('admin.layout.products')}</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={isActive('/admin/warranty-records') ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Link to="/admin/warranty-records">
                    <FileText className="h-4 w-4" />
                    <span>Warranties</span>
                  </Link>
                </Button>
              </div>
            </div>

            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
              <span>{t('admin.layout.logout')}</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
