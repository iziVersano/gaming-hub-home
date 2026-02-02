import { Search, User, ShoppingCart, Menu, Home, Info, Package, Mail, Accessibility, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border backdrop-blur-sm" style={{ background: 'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 25%, #d946ef 50%, #8b5cf6 75%, #06b6d4 100%)' }}>
      <div className="container flex h-16 md:h-20 items-center justify-between gap-4">
        {/* Logo - Right side in RTL */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg shrink-0"
          aria-label="Consoltech - Home"
        >
          <div className="relative">
            <Gamepad2
              className="h-8 w-8 md:h-10 md:w-10 text-white group-hover:text-cyan-200 transition-colors duration-300"
              aria-hidden="true"
            />
            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
          </div>
          <span className="logo-text text-2xl md:text-3xl lg:text-4xl">
            <span className="text-white font-bold">CONSOL</span>
            <span className="text-cyan-200 font-bold">TECH</span>
          </span>
        </a>

        {/* Search - Center */}
        <div className="flex flex-1 max-w-md lg:max-w-lg mx-4">
          <div className="relative w-full flex">
            <Input
              type="search"
              placeholder="חיפוש..."
              className="w-full pr-4 h-10 md:h-11 bg-white/90 border-2 border-white/50 focus:border-white focus:ring-white/30 placeholder:text-gray-500 rounded-l-none text-sm md:text-base text-gray-800"
            />
            <Button className="rounded-r-none bg-white/20 hover:bg-white/30 text-white border-l border-white/30 px-4 md:px-5 h-10 md:h-11">
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>

        {/* Actions - Left side in RTL */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          {/* Login/Register */}
          <Button variant="ghost" className="hidden md:flex items-center gap-2 text-white hover:text-white hover:bg-white/20 px-3 h-10">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">התחבר / הירשם</span>
          </Button>

          {/* Cart */}
          <Button variant="default" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-3 md:px-4 h-10">
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            <span className="flex items-center gap-1">
              <span className="bg-white text-purple-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">1</span>
              <span className="hidden sm:inline text-sm font-medium">עגלה</span>
            </span>
          </Button>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white hover:bg-white/20 h-10 w-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">תפריט</span>
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-t border-white/30 hidden md:block relative">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white pointer-events-none"></div>
        <div className="container relative z-10">
          <ul className="flex items-center gap-2 lg:gap-4 py-3">
            <li>
              <a href="#" className="flex items-center gap-2 px-4 lg:px-6 py-2.5 rounded-lg text-white font-semibold text-base hover:bg-white/25 hover:shadow-lg transition-all duration-200">
                <Home className="h-5 w-5" />
                <span>בית</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 lg:px-6 py-2.5 rounded-lg text-white font-semibold text-base hover:bg-white/25 hover:shadow-lg transition-all duration-200">
                <Info className="h-5 w-5" />
                <span>אודות</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 lg:px-6 py-2.5 rounded-lg text-white font-semibold text-base hover:bg-white/25 hover:shadow-lg transition-all duration-200">
                <Package className="h-5 w-5" />
                <span>מוצרים</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 lg:px-6 py-2.5 rounded-lg text-white font-semibold text-base hover:bg-white/25 hover:shadow-lg transition-all duration-200">
                <Mail className="h-5 w-5" />
                <span>צור קשר</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 lg:px-6 py-2.5 rounded-lg text-white font-semibold text-base hover:bg-white/25 hover:shadow-lg transition-all duration-200">
                <Accessibility className="h-5 w-5" />
                <span>נגישות</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
