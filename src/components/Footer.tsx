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
        <div className="grid gap-6 md:gap-12 md:grid-cols-2">
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
              מובילים עולמיים בתחום הפצת אלקטרוניקה וגיימינג, מחברים חדשנות עם שווקים ברחבי העולם.
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

          {/* Contact */}
          <div>
            <h4 className="mb-4 md:mb-6 text-xl md:text-2xl font-black text-white">צור קשר</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-center gap-2 md:gap-3">
                <Phone className="h-5 w-5 md:h-6 md:w-6 text-cyan-200 flex-shrink-0" />
                <span className="text-base md:text-lg font-bold text-white">+972-52-2768607</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Mail className="h-5 w-5 md:h-6 md:w-6 text-cyan-200 flex-shrink-0" />
                <span className="text-base md:text-lg font-bold text-white">sales@consoltech.shop</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-cyan-200 flex-shrink-0 mt-0.5 md:mt-1" />
                <span className="text-base md:text-lg font-bold text-white">רחוב משה סנה 47, תל אביב 6930243, ישראל</span>
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 bg-gray-100 py-3 md:py-4">
        <div className="container px-3 md:px-4 text-center text-sm md:text-base font-semibold text-gray-700">
          <p>© 2026 CONSOLTECH. כל הזכויות שמורות. | מצוינות בייבוא והפצה עולמית</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
