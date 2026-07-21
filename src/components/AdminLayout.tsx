import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Package, LayoutDashboard, FileText, MapPin, Menu, X } from 'lucide-react';
import { removeAuthToken } from '@/lib/api';
import { useI18n } from '@/hooks/I18nContext';
import { featureFlags } from '@/lib/featureFlags';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/admin/login');
  };

  const isActive = (path: string, exact = false) =>
    exact
      ? location.pathname === path
      : location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { to: '/admin', label: t('admin.layout.dashboard'), icon: LayoutDashboard, exact: true, show: true },
    { to: '/admin/products', label: t('admin.layout.products'), icon: Package, exact: false, show: true },
    { to: '/admin/warranty-records', label: t('admin.layout.warranties'), icon: FileText, exact: false, show: featureFlags.WARRANTY_ENABLED },
    { to: '/admin/places', label: t('admin.layout.places'), icon: MapPin, exact: false, show: true },
  ].filter((item) => item.show);

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navbar */}
      <nav className="nav-glass border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/admin" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <span className="logo-text text-xl">
                  <span className="logo-consol">CONSOL</span>
                  <span className="logo-tech">TECH</span>
                </span>
                <span className="text-xs text-muted-foreground">{t('admin.layout.admin')}</span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-2">
                {navItems.map(({ to, label, icon: Icon, exact }) => (
                  <Button
                    key={to}
                    asChild
                    variant={isActive(to, exact) ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <Link to={to}>
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* Desktop logout */}
            <Button onClick={handleLogout} variant="ghost" size="sm" className="hidden md:inline-flex">
              <LogOut className="h-4 w-4" />
              <span>{t('admin.layout.logout')}</span>
            </Button>

            {/* Mobile hamburger toggle */}
            <Button
              onClick={() => setMobileOpen((open) => !open)}
              variant="ghost"
              size="sm"
              className="md:hidden"
              aria-label={t('admin.layout.menu')}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-1">
              {navItems.map(({ to, label, icon: Icon, exact }) => (
                <Button
                  key={to}
                  asChild
                  variant={isActive(to, exact) ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link to={to}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                </Button>
              ))}
              <Button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('admin.layout.logout')}</span>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
