import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      {/* Newsletter Section */}
      <div className="border-b border-border bg-gradient-section">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="text-xl font-bold text-foreground">הירשמו לניוזלטר שלנו</h3>
              <p className="text-muted-foreground">קבלו עדכונים על מבצעים ומוצרים חדשים</p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="הזינו את האימייל שלכם"
                className="bg-input border-border"
              />
              <Button className="bg-gradient-cta hover:opacity-90 text-white font-bold">הרשמה</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gaming-border bg-background">
                <span className="text-xl font-bold text-gradient-gaming">G</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                גיימינג<span className="text-primary">סטור</span>
              </span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              החנות המובילה בישראל לציוד גיימינג. מביאים לכם את הטכנולוגיה החדשה ביותר במחירים הטובים ביותר.
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors hover:bg-electric-blue hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors hover:bg-neon-magenta hover:text-white">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors hover:bg-accent hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors hover:bg-destructive hover:text-white">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-bold text-foreground">קישורים מהירים</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">אודות</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">תקנון האתר</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">מדיניות פרטיות</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">החזרות וביטולים</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">שאלות נפוצות</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-bold text-foreground">קטגוריות</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">מחשבי גיימינג</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">כרטיסי מסך</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">מסכים</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">ציוד היקפי</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">אביזרים</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-bold text-foreground">צור קשר</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span>03-1234567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span>info@gamingstore.co.il</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-1" />
                <span>רחוב הגיימינג 42, תל אביב</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border bg-muted/20 py-4">
        <div className="container flex flex-col items-center justify-between gap-2 text-center text-sm text-muted-foreground md:flex-row">
          <p>© 2025 גיימינגסטור. כל הזכויות שמורות.</p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
