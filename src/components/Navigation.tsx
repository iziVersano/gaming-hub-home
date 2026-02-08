import { useState, useEffect } from 'react';
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

  // Icons shown in the header bar on mobile (between logo and burger)
  const mobileHeaderIcons = [
    { href: '/about', icon: Building2, label: t('menu.about') },
    { href: '/products', icon: ShoppingBag, label: t('menu.products') },
    { href: '/contact', icon: Mail, label: t('menu.contact') },
    { href: '/accessibility', icon: Accessibility, label: t('menu.accessibility') },
  ];

  // Brand logos for the bottom of the full-screen menu
  const menuBrands = [
    { name: 'xbox', src: '/brands/xbox.svg' },
    { name: 'playstation', src: '/brands/playstation.svg' },
    { name: 'sony', src: '/brands/sony.svg' },
    { name: 'samsung', src: '/brands/samsung.svg' },
    { name: 'apple', src: '/brands/apple.svg' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // TODO: Uncomment to re-enable language toggle
  function LanguageToggleInline() {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 nav-glass" role="navigation" aria-label="Main navigation" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Force LTR so layout is always: [Logo] [Icons] [Burger] */}
          <div className="flex justify-between items-center h-16" dir="ltr">
            {/* Logo (left) */}
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
            <div className="hidden md:flex items-center gap-8" role="menubar" dir={lang === 'he' ? 'rtl' : 'ltr'}>
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

            {/* Mobile: Icon shortcuts (between logo and burger) */}
            <div className="flex md:hidden items-center gap-1">
              {mobileHeaderIcons.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-label={item.label}
                    className={`p-2.5 rounded-full transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-accent'
                        : 'text-white/70 hover:text-white active:text-accent'
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>

            {/* Mobile: Burger menu button (far right) */}
            <button
              className="flex md:hidden p-2.5 rounded-full text-white/90 hover:text-white transition-colors duration-200"
              onClick={() => setIsOpen(true)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu-overlay"
              aria-label="Open menu"
            >
              <Menu className="h-8 w-8" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      {isOpen && (
        <div
          id="mobile-menu-overlay"
          className="fixed inset-0 z-[60] md:hidden flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          dir={lang === 'he' ? 'rtl' : 'ltr'}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

          {/* Menu content */}
          <div className="relative flex flex-col h-full">
            {/* Header with logo + close button */}
            <div className="flex justify-between items-center h-16 px-5">
              <Link
                to="/"
                className="flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Gamepad2 className="h-8 w-8 text-white" aria-hidden="true" />
                <span className="logo-text text-2xl">
                  <span className="logo-consol">CONSOL</span><span className="logo-tech">TECH</span>
                </span>
              </Link>
              <button
                className="p-2 rounded-full text-white/80 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-8 w-8" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* Navigation items - centered vertically */}
            <div className="flex-1 flex flex-col justify-center px-8 -mt-16">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    role="menuitem"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`flex items-center gap-4 py-4 text-2xl font-semibold tracking-wide transition-colors duration-200 border-b border-white/5 ${
                      isActive(item.href)
                        ? 'text-accent'
                        : 'text-white hover:text-accent'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {/* Get Quote button */}
              <div className="mt-6">
                <Button className="btn-nav w-full" onClick={() => setIsOpen(false)}>
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">{t('menu.getQuote')}</span>
                </Button>
              </div>
            </div>

            {/* Brand logos at the bottom */}
            <div className="px-8 pb-8">
              <div className="flex items-center justify-center gap-6">
                {menuBrands.map((brand) => (
                  <img
                    key={brand.name}
                    src={brand.src}
                    alt={brand.name}
                    className="h-6 w-auto opacity-40"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
