import { Search, User, ShoppingCart, Menu, Home, Info, Package, Mail, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo - Right side in RTL */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="ConsolTech"
            className="h-12 md:h-14 w-auto"
          />
        </div>

        {/* Search - Center */}
        <div className="flex flex-1 max-w-lg mx-4">
          <div className="relative w-full flex">
            <Input
              type="search"
              placeholder="חיפוש..."
              className="w-full pr-4 h-11 bg-white border-2 border-primary/30 focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground rounded-l-none text-base"
            />
            <Button className="rounded-r-none bg-primary hover:bg-primary/90 text-white px-5 h-11">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Actions - Left side in RTL */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Login/Register */}
          <Button variant="ghost" className="hidden md:flex items-center gap-2 text-foreground hover:text-primary hover:bg-primary/10 px-3">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">התחבר / הירשם</span>
          </Button>

          {/* Cart */}
          <Button variant="default" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4">
            <ShoppingCart className="h-5 w-5" />
            <span className="flex items-center gap-1">
              <span className="bg-white text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">1</span>
              <span className="hidden sm:inline text-sm font-medium">עגלה</span>
            </span>
          </Button>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:text-primary hover:bg-primary/10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">תפריט</span>
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-t border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 hidden md:block">
        <div className="container">
          <ul className="flex items-center gap-2 lg:gap-4 py-3">
            <li>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground font-semibold hover:text-white hover:bg-primary transition-all duration-200 group">
                <Home className="h-5 w-5" />
                <span>בית</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground font-semibold hover:text-white hover:bg-primary transition-all duration-200 group">
                <Info className="h-5 w-5" />
                <span>אודות</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground font-semibold hover:text-white hover:bg-primary transition-all duration-200 group">
                <Package className="h-5 w-5" />
                <span>מוצרים</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground font-semibold hover:text-white hover:bg-primary transition-all duration-200 group">
                <Mail className="h-5 w-5" />
                <span>צור קשר</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground font-semibold hover:text-white hover:bg-primary transition-all duration-200 group">
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
