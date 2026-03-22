import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageSquare, Gamepad2, House, Building2, ShoppingBag, Mail, Accessibility, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/I18nContext';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.451 3.488" />
  </svg>
);

const Navigation = ({ transparent = false }: { transparent?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Focus input after open animation starts
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    } else {
      setSearchTerm('');
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navigation = [
    { name: t('menu.home'), href: '/', icon: House },
    { name: t('menu.about'), href: '/about', icon: Building2 },
    { name: t('menu.products'), href: '/products', icon: ShoppingBag },
    { name: t('menu.contact'), href: '/contact', icon: Mail },
    { name: t('menu.accessibility'), href: '/accessibility', icon: Accessibility },
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

  // Hide nav on scroll down, show on scroll stop
  const [navVisible, setNavVisible] = useState(true);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setNavVisible(false);
      }
      lastScrollY = currentScrollY;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setNavVisible(true);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const [hebrewLogo, setHebrewLogo] = useState(true);

  return (
    <>
      <nav className={`fixed top-0 w-full z-[9999] transition-transform duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'} ${transparent ? 'nav-transparent-mobile md:nav-glass' : 'nav-glass'}`} role="navigation" aria-label="Main navigation" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
          {/* Force LTR so layout is always: [Logo] [Burger] */}
          <div className="flex flex-col" dir="ltr">
            {/* Row 1: Mobile compact header — [Logo centered] [🔍 right] */}
            <div className="flex md:hidden items-center justify-center relative px-2 py-2">
              {/* Compact logo — centered */}
              <Link to="/" className="flex items-center gap-2 group" aria-label="Consoltech - Home">
                <Gamepad2 className="h-10 w-10 text-white" />
                <div className="flex flex-col overflow-visible">
                  <span className="logo-text text-xl tracking-wide leading-none scale-[1.35] origin-left translate-y-0.5">
                    {hebrewLogo
                      ? <><span className="logo-consol">קונסול</span><span className="logo-tech">טק</span></>
                      : <><span className="logo-consol">CONSOL</span><span className="logo-tech">TECH</span></>
                    }
                  </span>
                  <span className="text-[8px] tracking-[0.12em] text-gray-300/80 font-medium uppercase leading-none mt-0.5">
                    {hebrewLogo ? 'יבוא ויצוא גלובלי' : 'Global Import & Distribution'}
                  </span>
                </div>
              </Link>

              {/* Flag toggle — absolute left */}
              <button
                type="button"
                onClick={() => setHebrewLogo(prev => !prev)}
                className="absolute left-1 flex items-center justify-center w-10 h-10 text-lg"
                aria-label="Toggle logo language"
              >
                {hebrewLogo ? '🇬🇧' : '🇮🇱'}
              </button>

              {/* Search toggle — absolute right, large touch target */}
              <button
                type="button"
                onClick={() => setSearchOpen(prev => !prev)}
                className="absolute right-1 flex items-center justify-center w-10 h-10 text-white"
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
              >
                <span className="relative block w-5 h-5">
                  <Search className={`h-5 w-5 absolute inset-0 transition-all duration-200 ${searchOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`} strokeWidth={2.5} />
                  <X className={`h-5 w-5 absolute inset-0 transition-all duration-200 ${searchOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} strokeWidth={2.5} />
                </span>
              </button>
            </div>

            {/* Mobile search — slide-down on open */}
            {searchOpen && (
              <div className="md:hidden px-3 pb-2 search-slide-down">
                <form onSubmit={(e) => { handleSearch(e); setSearchOpen(false); }} className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-white/40 pointer-events-none shrink-0" strokeWidth={2} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('products.searchPlaceholder')}
                    className="search-input w-full h-10 pl-9 pr-12 rounded-xl text-sm text-white placeholder:text-white/35"
                    style={{ fontSize: '16px' }}
                    aria-label={t('products.searchPlaceholder')}
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 h-7 px-3 rounded-lg bg-primary text-white text-xs font-semibold tracking-wide"
                    aria-label="Search"
                  >
                    {t('products.search') || 'Go'}
                  </button>
                </form>
              </div>
            )}

            {/* Row 1 Desktop: Logo + Desktop nav */}
            <div className="hidden md:flex justify-between items-center md:h-16">
              <Link
                to="/"
                className="flex items-center gap-3 group w-full md:w-auto shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-lg px-1"
                aria-label="Consoltech - Home"
              >
                <div className="logo-icon-wrap p-2.5 group-hover:border-accent/40 transition-colors duration-300">
                  <Gamepad2 className="h-9 w-9 text-white group-hover:text-accent transition-colors duration-300" />
                </div>
                <div className="flex flex-col items-start gap-px">
                  <span className="logo-text text-3xl lg:text-[2.15rem] tracking-wider leading-none">
                    {hebrewLogo
                      ? <><span className="logo-consol">קונסול</span><span className="logo-tech">טק</span></>
                      : <><span className="logo-consol">CONSOL</span><span className="logo-tech">TECH</span></>
                    }
                  </span>
                  <span className="text-[10px] tracking-[0.22em] text-white/45 font-medium uppercase leading-none pt-0.5">
                    {hebrewLogo ? 'יבוא ויצוא גלובלי' : 'Global Import & Distribution'}
                  </span>
                </div>
              </Link>

              {/* Flag toggle button — desktop */}
              <button
                type="button"
                onClick={() => setHebrewLogo(prev => !prev)}
                className="text-xl ml-2 opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Toggle logo language"
              >
                {hebrewLogo ? '🇬🇧' : '🇮🇱'}
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-7" role="menubar" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    role="menuitem"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`nav-link${isActive(item.href) ? ' nav-link-active' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link to="/contact">
                  <Button className="btn-nav ml-1">
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    <span>{t('menu.getQuote')}</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Row 2: Mobile nav — 4 items + burger on right */}
            <div className={`flex md:hidden items-center py-1.5 ${transparent ? '' : 'nav-icon-bar'}`}>
              <div className="flex items-center justify-evenly flex-1">
                {[
                  { to: '/', icon: House, label: t('menu.home') },
                  { to: '/products', icon: ShoppingBag, label: t('menu.products') },
                  { to: '/contact', icon: Mail, label: t('menu.contact') },
                  { to: '/about', icon: Building2, label: t('menu.about') },
                ].map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex flex-col items-center gap-0.5 px-2 pt-1 pb-1.5 text-[11px] font-bold whitespace-nowrap transition-colors duration-150 ${isActive(to) ? 'text-white' : 'text-white/70'}`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={isActive(to) ? 2.8 : 2} />
                    <span>{label}</span>
                    {isActive(to) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-primary to-cyan-400" />
                    )}
                  </Link>
                ))}
              </div>
              {/* Burger menu */}
              <button
                className="p-1.5 text-white/90 mr-1"
                onClick={() => setIsOpen(true)}
                aria-expanded={isOpen}
                aria-controls="mobile-menu-overlay"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={2.5} />
              </button>
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
                <Gamepad2 className="h-5 w-5 text-white/40" />
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
