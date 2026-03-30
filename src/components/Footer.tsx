import { Link } from 'react-router-dom';
import { Accessibility, Gamepad2, Lock, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/hooks/I18nContext';

const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="py-10 md:py-16 bg-card border-t border-border" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="logo-icon-wrap p-2">
                <Gamepad2 className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
              <span className="logo-text text-2xl md:text-3xl">
                <span className="text-foreground">CONSOL</span><span className="logo-tech">TECH</span>
              </span>
            </div>
            <p className="text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">{t('footer.contact')}</h3>
            <div className="space-y-2 text-muted-foreground">
              <a
                href="mailto:sales@consoltech.shop"
                className="block hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
              >
                <span className="text-accent font-semibold">{t('footer.email')}</span> sales@consoltech.shop
              </a>
              <a
                href="tel:+972522768607"
                className="block hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
              >
                <span className="text-accent font-semibold">{t('footer.phone')}</span> +972-52-2768607
              </a>
              <a
                href="https://maps.google.com/?q=47+Moshe+Sneh+St.+Tel+Aviv"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
              >
                <span className="text-accent font-semibold">{t('footer.address')}</span> 47 Moshe Sneh St., Tel Aviv 6930243, Israel
              </a>
            </div>
          </div>
        </div>
        
        {/* Security badges strip */}
        <div className="border-t border-border mt-10 pt-8 mb-2">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: 'linear-gradient(135deg, #b8860b, #ffd700, #b8860b)', boxShadow: '0 0 16px rgba(255,215,0,0.4)' }}>
                <Lock className="h-6 w-6 text-yellow-900" strokeWidth={2} />
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-yellow-500" style={{ background: 'linear-gradient(135deg, #8B6914, #DAA520)', boxShadow: '0 0 14px rgba(218,165,32,0.5)' }}>
                <ShieldCheck className="h-6 w-6 text-yellow-100" strokeWidth={2} />
              </div>
            </div>
            <p className="text-sm font-bold text-white/80 max-w-xs" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
              מאובטח בתקן PCI המחמיר ביותר לרכישה מאובטחת וחיסיון מידע
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-center sm:text-left">
              &copy; {new Date().getFullYear()} CONSOLTECH. {t('footer.copyright')}
            </p>
            <nav aria-label="Footer navigation" className="flex items-center gap-4">
              <Link
                to="/accessibility"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded px-1"
              >
                <Accessibility className="h-4 w-4" aria-hidden="true" />
                <span>{t('footer.accessibility')}</span>
              </Link>
              <Link
                to="/admin/login"
                className="text-xs text-muted-foreground/50 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded px-1"
              >
                {t('footer.admin')}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

