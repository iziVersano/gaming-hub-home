import { Link } from 'react-router-dom';
import { Accessibility, Gamepad2 } from 'lucide-react';
import { useI18n } from '@/hooks/I18nContext';

const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="py-16 bg-card border-t border-border" role="contentinfo">
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
        
        <div className="border-t border-border mt-12 pt-8">
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

