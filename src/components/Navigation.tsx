import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Gamepad2, House, Building2, ShoppingBag, Mail, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/I18nContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useI18n();

  const navigation = [
    { name: t('menu.home'), href: '/', icon: House },
    { name: t('menu.about'), href: '/about', icon: Building2 },
    { name: t('menu.products'), href: '/products', icon: ShoppingBag },
    { name: t('menu.contact'), href: '/contact', icon: Mail },
    { name: t('menu.accessibility'), href: '/accessibility', icon: Accessibility },
  ];

  const isActive = (path: string) => location.pathname === path;

  // TODO: Uncomment to re-enable language toggle
  function LanguageToggleInline() {
    return null;
    // return (
    //   <button
    //     aria-label={lang === 'en' ? 'Switch to Hebrew' : 'החלף לאנגלית'}
    //     className="ms-2 px-2 py-1 border rounded text-xs font-medium bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    //     onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
    //     style={{ minWidth: 48 }}
    //   >
    //     {lang === 'en' ? t('toggle.he') : t('toggle.en')}
    //   </button>
    // );
  }

  return (
    <nav className="fixed top-0 w-full z-50 nav-glass" role="navigation" aria-label="Main navigation" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
            aria-label="Consoltech - Home"
          >
            <div className="relative">
              <Gamepad2 className="h-8 w-8 md:h-10 md:w-10 text-white group-hover:text-accent transition-colors duration-300" aria-hidden="true" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            <span className="logo-text text-2xl md:text-3xl lg:text-4xl">
              <span className="logo-consol">CONSOL</span><span className="logo-tech">TECH</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8" role="menubar">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  role="menuitem"
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`flex items-center gap-2 py-1 font-semibold text-[15px] tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded ${
                    isActive(item.href)
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-white hover:text-accent'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Button className="btn-nav">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              <span>{t('menu.getQuote')}</span>
              <LanguageToggleInline />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="mobile-menu"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-border animate-fade-in" role="menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    role="menuitem"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`flex items-center gap-3 px-4 py-3 font-semibold text-[15px] tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded ${
                      isActive(item.href)
                        ? 'text-accent'
                        : 'text-white hover:text-accent'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="px-3 pt-2">
                <Button className="btn-nav w-full">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  <span>{t('menu.getQuote')}</span>
                  <LanguageToggleInline />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;