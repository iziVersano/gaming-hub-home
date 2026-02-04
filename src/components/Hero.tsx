import { Button } from '@/components/ui/button';
import { Grid3X3, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import heroImage from '@/assets/hero-tech.jpg';
import NewArrivalsSpotlight from '@/components/NewArrivalsSpotlight';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { useI18n } from '@/hooks/I18nContext';

const Hero = () => {
  const { t } = useI18n();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = heroImage;
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-8 md:pt-24 md:pb-16 overflow-hidden">
      {/* Clean Professional Background */}
      <div className="absolute inset-0 z-0">
        {/* Subtle gradient background using design tokens */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Elegant floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {/* Soft gradient orbs using design tokens */}
        <div className="absolute top-1/4 right-[16%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-[16%] w-96 h-96 bg-accent/5 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 md:space-y-8">
          {/* Hero Visual - Toggle between Spotlight and Promotional Image */}
          <div className="relative mb-6 md:mb-10">
            {isFeatureEnabled('HERO_NEW_ARRIVALS_SPOTLIGHT') ? (
              /* New Arrivals Spotlight */
              <div className="flex justify-center">
                <NewArrivalsSpotlight />
              </div>
            ) : (
              /* CONSOLTECH Promotional Image */
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-2xl" />
                <img
                  src="/images/41931538-f28c-4223-89e9-23b458ec78db.png"
                  alt="Gaming consoles, electronics, drones, smart TV and tech products showcase"
                  className="w-full max-w-4xl mx-auto h-auto rounded-2xl shadow-xl"
                />
              </div>
            )}
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-center text-2xl md:text-3xl lg:text-4xl leading-tight font-bold">
              <span className="block text-2xl md:text-3xl lg:text-5xl font-extrabold mb-2 leading-tight text-foreground">
                {t('hero.headline1')}<span className="text-primary">{t('hero.innovation')}</span>
              </span>
              <span className="block text-muted-foreground text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">
                {t('hero.headline2')}<span className="text-accent font-bold">{t('hero.toys')}</span>{t('hero.headline2b')}
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('hero.desc')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 justify-center items-center pt-6">
            <Link to="/products">
              <Button className="btn-hero-square group">
                <Grid3X3 className="h-5 w-5 md:h-6 md:w-6" />
                <span>{t('hero.explore', 'Explore Products')}</span>
              </Button>
            </Link>

            <Link to="/contact">
              <Button className="btn-neon-square group">
                <Send className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:translate-x-1" />
                <span>{t('hero.contact', 'Contact Us')}</span>
              </Button>
            </Link>
          </div>

          {/* Stats - Cleaner presentation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground mt-1">{t('hero.countries', 'Countries Served')}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-accent">1000+</div>
              <div className="text-sm text-muted-foreground mt-1">{t('hero.products', 'Products')}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">{t('hero.support', 'Support')}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-accent">15+</div>
              <div className="text-sm text-muted-foreground mt-1">{t('hero.years', 'Years Experience')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
