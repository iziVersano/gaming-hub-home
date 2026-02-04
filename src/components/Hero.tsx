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
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-8 md:pt-24 md:pb-16">
      {/* Background Image with LQIP */}
      <div className="absolute inset-0 z-0">
        {/* Instant placeholder with tech-themed gradient */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-out ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
          }}
        />

        {/* High Quality Image */}
        {/* High Quality Image */}
        <img
          src={heroImage}
          alt="High-tech electronics and gaming devices"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bright gradient overlay to fade the background */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-white/90 via-white/80 to-cyan-50/70 pointer-events-none"></div>

      {/* Futuristic Tech Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        {/* Grid Pattern */}
        <div className="tech-grid"></div>

        {/* Holographic Rings */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 md:w-48 md:h-48">
          <div className="holographic-ring ring-1"></div>
          <div className="holographic-ring ring-2"></div>
        </div>

        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 md:w-36 md:h-36">
          <div className="holographic-ring ring-3"></div>
          <div className="holographic-ring ring-4"></div>
        </div>

        <div className="absolute top-1/2 left-3/4 w-20 h-20 md:w-28 md:h-28">
          <div className="holographic-ring ring-5"></div>
        </div>

        {/* Animated Tech Lines */}
        <div className="tech-lines">
          <div className="tech-line line-1"></div>
          <div className="tech-line line-2"></div>
          <div className="tech-line line-3"></div>
        </div>

        {/* Floating Tech Particles */}
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent rounded-full opacity-60 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary rounded-full opacity-40 animate-pulse-slower"></div>
        <div className="absolute top-3/4 right-1/6 w-1.5 h-1.5 bg-accent-glow rounded-full opacity-50 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 md:space-y-8">
          {/* Hero Visual - Toggle between Spotlight and Promotional Image */}
          <div className="relative mb-8 md:mb-12">
            {isFeatureEnabled('HERO_NEW_ARRIVALS_SPOTLIGHT') ? (
              /* New Arrivals Spotlight */
              <div className="flex justify-center">
                <NewArrivalsSpotlight />
              </div>
            ) : (
              /* CONSOLTECH Promotional Image */
              <>
                <img
                  src="/images/41931538-f28c-4223-89e9-23b458ec78db.png"
                  alt="Gaming consoles, electronics, drones, smart TV and tech products showcase"
                  className="w-full max-w-4xl mx-auto h-auto rounded-lg shadow-2xl shadow-primary/20"
                />
                {/* More lights behind drone and bicycle + brighter wall/floor */}
                <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
                  {/* Drone glows */}
                  <div className="absolute top-[18%] right-[12%] w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full blur-3xl opacity-90 mix-blend-screen bg-[radial-gradient(ellipse_at_center,hsl(var(--accent))/0.6_0%,transparent_65%)]"></div>
                  <div className="absolute top-[16.5%] right-[11%] w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full blur-xl opacity-90 mix-blend-screen bg-[radial-gradient(ellipse_at_center,hsl(var(--accent))/0.8_0%,transparent_70%)]"></div>
                  <div className="absolute top-[15%] right-[8%] w-64 h-40 md:w-80 md:h-48 lg:w-96 lg:h-56 rounded-[9999px] blur-3xl opacity-70 mix-blend-screen bg-[radial-gradient(ellipse_at_center,hsl(var(--accent))/0.45_0%,transparent_80%)]"></div>

                  {/* Bicycle glows */}
                  <div className="absolute bottom-[14%] left-[10%] w-44 h-44 md:w-60 md:h-60 lg:w-80 lg:h-80 rounded-full blur-3xl opacity-90 mix-blend-screen bg-[radial-gradient(ellipse_at_center,hsl(var(--primary))/0.55_0%,transparent_70%)]"></div>
                  <div className="absolute bottom-[16%] left-[12%] w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full blur-xl opacity-90 mix-blend-screen bg-[radial-gradient(ellipse_at_center,hsl(var(--primary))/0.75_0%,transparent_75%)]"></div>
                  <div className="absolute bottom-[12%] left-[8%] w-72 h-44 md:w-96 md:h-56 lg:w-[28rem] lg:h-64 rounded-[9999px] blur-3xl opacity-70 mix-blend-screen bg-[radial-gradient(ellipse_at_center,hsl(var(--primary))/0.4_0%,transparent_85%)]"></div>

                  {/* Wall highlight */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[92%] md:w-[88%] lg:w-[82%] h-[26%] md:h-[24%] rounded-[50%] blur-3xl opacity-75 mix-blend-screen bg-[radial-gradient(ellipse_at_top,hsl(var(--accent))/0.4_0%,transparent_75%)]"></div>
                  {/* Floor highlight */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[92%] md:w-[88%] lg:w-[82%] h-[22%] md:h-[20%] rounded-[50%] blur-3xl opacity-80 mix-blend-screen bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary))/0.45_0%,transparent_80%)]"></div>
                </div>
              </>
            )}
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-center text-2xl md:text-3xl lg:text-4xl leading-tight font-bold">
              <span className="block text-2xl md:text-3xl lg:text-5xl font-black mb-2 leading-tight text-gray-900 drop-shadow-sm">
                {t('hero.headline1')}<span className="text-primary">{t('hero.innovation')}</span>
              </span>
              <span className="block text-gray-800 text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                {t('hero.headline2')}<span className="text-accent font-extrabold">{t('hero.toys')}</span>{t('hero.headline2b')}
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-semibold">
              {t('hero.desc')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 justify-center items-center pt-8">
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">50+</div>
              <div className="text-sm text-muted-foreground">{t('hero.countries', 'Countries Served')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">{t('hero.products', 'Products')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">24/7</div>
              <div className="text-sm text-muted-foreground">{t('hero.support', 'Support')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">{t('hero.years', 'Years Experience')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 bg-gradient-to-b from-transparent via-accent to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
