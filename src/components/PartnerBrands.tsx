import { useI18n } from '@/hooks/I18nContext';

const PartnerBrands = () => {
  const { t } = useI18n();
  // Keep brand names in English for image paths
  const brands = [
    'microsoft',
    'xbox',
    'playstation',
    'samsung',
    'lg',
    'tcl',
    'apple',
    'sony',
  ];

  return (
    <section className="pt-10 pb-2 md:pt-8 md:pb-4 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('products.trustedTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('products.trustedDescription')}
          </p>
        </div>

        {/* Brand logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-4 p-2 sm:p-4 bg-card/20 rounded-2xl border border-border/20">
          {brands.map((name, index) => {
            const label = name.charAt(0).toUpperCase() + name.slice(1);
            return (
              <div
                key={name}
                className="brand-card grid place-items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden border border-border/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-electric/10 via-neon/10 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

                <img
                  src={`/brands/${name}.svg`}
                  alt={label}
                  loading="lazy"
                  className="w-4/5 h-4/5 object-contain transition-all duration-300 group-hover:scale-105 relative z-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      target.nextElementSibling.textContent = label;
                      (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                    }
                  }}
                />
                <span className="text-muted-foreground font-medium hidden absolute inset-0 flex items-center justify-center text-sm relative z-10">
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Partnership CTA */}
        <div className="text-center mt-8 md:mt-12">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full border-2 border-background"></div>
              ))}
            </div>
            <span className="text-sm">{t('brands.morePartners')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerBrands;