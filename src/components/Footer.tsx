import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter, Gamepad2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container px-3 md:px-4 py-4 md:py-8">
          <div className="flex flex-col items-center justify-between gap-2 md:gap-4 md:flex-row">
            <div className="text-center md:text-right">
              <h3 className="text-lg md:text-2xl font-extrabold text-gray-800">הירשמו לניוזלטר שלנו</h3>
              <p className="text-sm md:text-lg font-medium text-gray-700">קבלו עדכונים על מבצעים ומוצרים חדשים</p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="הזינו את האימייל שלכם"
                className="bg-white border-gray-300 text-sm md:text-base text-gray-800 placeholder:text-gray-500"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm md:text-base px-3 md:px-4">הרשמה</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - with gradient */}
      <div className="py-6 md:py-12" style={{ background: 'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 25%, #d946ef 50%, #8b5cf6 75%, #06b6d4 100%)' }}>
        <div className="container px-3 md:px-4">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            {/* Logo - same as header */}
            <a
              href="#"
              className="flex items-center gap-2 md:gap-3 group mb-4"
              aria-label="Consoltech - Home"
            >
              <div className="relative">
                <Gamepad2
                  className="h-7 w-7 md:h-10 md:w-10 text-white group-hover:text-cyan-200 transition-colors duration-300"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              </div>
              <span className="logo-text text-xl md:text-2xl lg:text-3xl">
                <span className="text-white font-bold">CONSOL</span>
                <span className="text-cyan-200 font-bold">TECH</span>
              </span>
            </a>
            <p className="mb-3 md:mb-4 text-sm md:text-base font-medium text-white/90 line-clamp-2 md:line-clamp-none">
              החנות המובילה בישראל לציוד גיימינג. מביאים לכם את הטכנולוגיה החדשה ביותר במחירים הטובים ביותר.
            </p>
            <div className="flex gap-2 md:gap-3">
              <a href="#" className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-white/20 text-white transition-colors hover:bg-white/30">
                <Facebook className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
              <a href="#" className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-white/20 text-white transition-colors hover:bg-white/30">
                <Instagram className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
              <a href="#" className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-white/20 text-white transition-colors hover:bg-white/30">
                <Twitter className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
              <a href="#" className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-white/20 text-white transition-colors hover:bg-white/30">
                <Youtube className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
            </div>
          </div>

          {/* Links - hidden on mobile */}
          <div className="hidden md:block">
            <h4 className="mb-4 text-lg font-extrabold text-white">קישורים מהירים</h4>
            <ul className="space-y-2 text-base font-medium text-white/90">
              <li><a href="#" className="hover:text-cyan-200 transition-colors">אודות</a></li>
              <li><a href="#" className="hover:text-cyan-200 transition-colors">תקנון האתר</a></li>
              <li><a href="#" className="hover:text-cyan-200 transition-colors">מדיניות פרטיות</a></li>
              <li><a href="#" className="hover:text-cyan-200 transition-colors">החזרות וביטולים</a></li>
              <li><a href="#" className="hover:text-cyan-200 transition-colors">שאלות נפוצות</a></li>
            </ul>
          </div>

          {/* Categories - hidden on mobile */}
          <div className="hidden md:block">
            <h4 className="mb-2 md:mb-4 text-lg font-extrabold text-white">קטגוריות</h4>
            <ul className="space-y-1 md:space-y-2 text-base font-medium text-white/90">
              <li><a href="#" className="hover:text-cyan-200 transition-colors">מחשבי גיימינג</a></li>
              <li><a href="#" className="hover:text-cyan-200 transition-colors">כרטיסי מסך</a></li>
              <li><a href="#" className="hover:text-cyan-200 transition-colors">מסכים</a></li>
              <li><a href="#" className="hover:text-cyan-200 transition-colors">ציוד היקפי</a></li>
              <li><a href="#" className="hover:text-cyan-200 transition-colors">אביזרים</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-2 md:mb-4 text-lg font-extrabold text-white">צור קשר</h4>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base font-medium text-white/90">
              <li className="flex items-center gap-2 md:gap-3">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-cyan-200" />
                <span>03-1234567</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-cyan-200" />
                <span>info@gamingstore.co.il</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-cyan-200 mt-0.5 md:mt-1" />
                <span>רחוב הגיימינג 42, תל אביב</span>
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 bg-gray-100 py-3 md:py-4">
        <div className="container px-3 md:px-4 text-center text-sm md:text-base font-semibold text-gray-700">
          <p>© 2025 CONSOLTECH. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
