import { Search, User, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo - Right side in RTL */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gaming-border bg-card">
            <span className="text-xl font-bold text-gradient-gaming">G</span>
          </div>
          <span className="hidden text-xl font-bold text-foreground sm:inline-block">
            גיימינג<span className="text-primary">סטור</span>
          </span>
        </div>

        {/* Search - Center */}
        <div className="flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="חפש מוצרים..."
              className="w-full pr-10 bg-input border-border focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Actions - Left side in RTL */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/10">
            <User className="h-5 w-5" />
            <span className="sr-only">חשבון</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary hover:bg-primary/10">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
              3
            </span>
            <span className="sr-only">עגלה</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:text-primary hover:bg-primary/10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">תפריט</span>
          </Button>
        </div>
      </div>

      {/* Categories Nav */}
      <nav className="border-t border-border bg-card/50">
        <div className="container">
          <ul className="flex items-center gap-6 overflow-x-auto py-3 text-sm font-medium">
            <li>
              <a href="#" className="text-foreground hover:text-primary transition-colors whitespace-nowrap">
                מחשבי גיימינג
              </a>
            </li>
            <li>
              <a href="#" className="text-foreground hover:text-primary transition-colors whitespace-nowrap">
                כרטיסי מסך
              </a>
            </li>
            <li>
              <a href="#" className="text-foreground hover:text-primary transition-colors whitespace-nowrap">
                מסכים
              </a>
            </li>
            <li>
              <a href="#" className="text-foreground hover:text-primary transition-colors whitespace-nowrap">
                ציוד היקפי
              </a>
            </li>
            <li>
              <a href="#" className="text-foreground hover:text-primary transition-colors whitespace-nowrap">
                אביזרים
              </a>
            </li>
            <li>
              <a href="#" className="text-secondary hover:text-secondary/80 transition-colors whitespace-nowrap font-bold">
                מבצעים חמים 🔥
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
