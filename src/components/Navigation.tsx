import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Gamepad2, House, Building2, ShoppingBag, Mail, Accessibility, ShieldCheck } from 'lucide-react';
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
    { href: '/', icon: House, label: t('menu.home') },
    { href: '/about', icon: Building2, label: t('menu.about') },
    { href: '/products', icon: ShoppingBag, label: t('menu.products') },
    { href: '/contact', icon: Mail, label: t('menu.contact') },
    { href: '/warranty', icon: ShieldCheck, label: t('menu.warranty', 'Warranty') },
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
          {/* Force LTR so layout is always: [Logo] [Burger] */}
          <div className="flex flex-col" dir="ltr">
            {/* Row 1: Logo + Burger */}
            <div className="flex justify-between items-center h-16">
              {/* Logo (left) */}
              <Link
                to="/"
                className="flex items-center gap-1.5 sm:gap-3 group shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
                aria-label="Consoltech - Home"
              >
                <div className="relative">
                  <Gamepad2 className="h-10 w-10 sm:h-10 sm:w-10 md:h-10 md:w-10 text-white group-hover:text-accent transition-colors duration-300" aria-hidden="true" />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <span className="logo-text text-2xl sm:text-2xl md:text-3xl lg:text-4xl">
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

              {/* Mobile: Burger only (right side) */}
              <button
                className="md:hidden p-3 rounded-full text-white hover:text-accent transition-colors duration-200"
                onClick={() => setIsOpen(true)}
                aria-expanded={isOpen}
                aria-controls="mobile-menu-overlay"
                aria-label="Open menu"
              >
                <Menu className="h-9 w-9" strokeWidth={3} aria-hidden="true" />
              </button>
            </div>

            {/* Row 2: Mobile nav icon shortcuts (below logo, always visible) */}
            <div className="flex md:hidden items-center justify-center gap-4 pb-2.5 pt-2.5 border-t border-white/20 bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
              {mobileHeaderIcons.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-label={item.label}
                    className={`p-2.5 rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-accent bg-accent/10'
                        : 'text-white hover:text-accent active:text-accent'
                    }`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Half-width slide-in mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu-overlay"
          className="fixed inset-0 z-[60] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          dir={lang === 'he' ? 'rtl' : 'ltr'}
        >
          {/* Backdrop - click to close */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu panel - half width, right side */}
          <div className="absolute top-0 right-0 h-full w-[55%] bg-[#0a0a0f] border-l border-white/10 flex flex-col shadow-2xl">
            {/* Close button */}
            <div className="flex justify-end items-center h-16 px-4">
              <button
                className="p-2 rounded-full text-white hover:text-accent transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>

            {/* Navigation items */}
            <div className="flex flex-col px-5 pt-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    role="menuitem"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`flex items-center gap-3 py-3.5 text-lg font-semibold tracking-wide transition-colors duration-200 border-b border-white/5 ${
                      isActive(item.href)
                        ? 'text-accent'
                        : 'text-white hover:text-accent'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Brand logos */}
            <div className="px-4 pb-4 mt-auto">
              <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                {menuBrands.map((brand) => (
                  <img
                    key={brand.name}
                    src={brand.src}
                    alt={brand.name}
                    className="h-6 w-auto brightness-0 invert opacity-90"
                  />
                ))}
              </div>
              {/* Company logo */}
              <Link
                to="/"
                className="flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Gamepad2 className="h-5 w-5 text-white/40" aria-hidden="true" />
                <span className="logo-text text-sm opacity-40">
                  <span className="logo-consol">CONSOL</span><span className="logo-tech">TECH</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
