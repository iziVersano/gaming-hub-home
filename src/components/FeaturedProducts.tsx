import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Send } from 'lucide-react';
import playstationImg from '@/assets/playstation.jpg';
import xboxImg from '@/assets/xbox.jpg';
import droneImg from '@/assets/drone.jpg';
import ebikeImg from '@/assets/ebike.jpg';
import smartTvImg from '@/assets/smart-tv.jpg';
import { cn } from '@/lib/utils';
import { useI18n } from '@/hooks/I18nContext';

const FeaturedProducts = () => {
  const { t } = useI18n();
  const products = [
    {
      id: 0,
      name: 'Nintendo Switch 2',
      category: t('products.category.gaming'),
      description: t('products.nintendoDescription', 'The next generation of Nintendo gaming. Enhanced graphics, faster performance, larger display, and backward compatibility with your favorite games.'),
      image: '/images/nintendo-switch-2-product.jpg',
      price: 'From $449',
      featured: true,
      specs: ['Enhanced Display', 'New Joy-Con', 'Backward Compatible', 'Faster Performance']
    },
    {
      id: 1,
      name: t('products.playstation', 'PlayStation 5 Console'),
      category: t('products.category.gaming'),
      description: t('products.playstationDescription', 'Experience lightning-fast loading with the custom SSD, deeper immersion with haptic feedback, and 4K gaming at up to 120fps'),
      image: playstationImg,
      price: 'From $499',
      featured: true,
      specs: ['Custom AMD CPU', '16GB GDDR6', '825GB SSD', '4K Gaming']
    },
    {
      id: 2,
      name: t('products.xbox', 'Xbox Series X'),
      category: t('products.category.gaming'),
      description: t('products.xboxDescription', 'The fastest, most powerful Xbox ever with 12 teraflops of GPU power and Smart Delivery technology'),
      image: xboxImg,
      price: 'From $449',
      featured: true,
      specs: ['AMD Zen 2 CPU', '16GB GDDR6', '1TB NVMe SSD', '120fps Gaming']
    },
    {
      id: 3,
      name: 'DJI Air 3 Drone',
      category: 'Aerial Technology',
      description: 'Professional-grade camera drone with dual sensors, 46-minute flight time, and omnidirectional obstacle sensing',
      image: droneImg,
      price: 'From $1,049',
      featured: false,
      specs: ['4K/HDR Video', '46min Flight', 'Dual Cameras', 'Smart RTH']
    },
    {
      id: 4,
      name: 'Tesla Model E-Bike',
      category: 'Smart Mobility',
      description: 'Revolutionary electric bike with autopilot features, 100-mile range, and seamless smartphone integration',
      image: ebikeImg,
      price: 'From $2,995',
      featured: true,
      specs: ['100mi Range', 'Auto-pilot', 'Smart Display', 'Fast Charging']
    },
    {
      id: 5,
      name: 'Samsung Neo QLED 8K',
      category: 'Display Technology',
      description: 'Stunning 8K resolution with Quantum Matrix Technology, AI upscaling, and immersive Dolby Atmos sound',
      image: smartTvImg,
      price: 'From $3,499',
      featured: false,
      specs: ['8K Resolution', 'Quantum HDR', 'AI Upscaling', 'Dolby Atmos']
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-sm font-mono font-medium text-accent uppercase tracking-wider px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
              // {t('featured.collection')}
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            <span className="gradient-text text-balance">{t('featured.title')}</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed text-balance">
            {t('featured.description')}
          </p>
        </div>

        {/* Enhanced Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-2xl mb-6">
                {product.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg">
                      {t('featured.badge')}
                    </span>
                  </div>
                )}
                
                <img 
                  src={product.image} 
                  alt={product.name}
                  className={cn(
                    "w-full h-72 transition-all duration-700",
                    product.name.toLowerCase().includes('bike')
                      ? "object-contain bg-muted p-4 group-hover:scale-105"
                      : "object-cover group-hover:scale-110"
                  )}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute top-4 left-4">
                  <span className="bg-card/90 backdrop-blur-sm text-card-foreground px-3 py-1.5 rounded-xl text-sm font-medium border border-border/50">
                    {product.category}
                  </span>
                </div>

                {/* Specs overlay on hover */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="bg-card/95 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                    <div className="grid grid-cols-2 gap-2">
                      {product.specs.map((spec, idx) => (
                        <span key={idx} className="text-xs text-muted-foreground font-mono">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {product.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-end pt-2">
                  <div className="flex flex-col gap-2">
                    <button
                      className="btn-inquiry inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      data-product={product.name}
                      data-sku={`${product.category.replace(/\s+/g, '-').toUpperCase()}-${product.id}`}
                      aria-label={`Inquiry about ${product.name}`}
                    >
                      <span>{t('featured.inquiryNow')}</span>
                    </button>
                    <Button className="btn-accent-small group/btn">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      <span>{t('featured.explore')}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Enhanced View All Card */}
          <Link
            to="/products"
            className="product-card group cursor-pointer flex items-center justify-center min-h-[500px] bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 animate-scale-in"
            style={{ animationDelay: `${products.length * 0.1}s` }}
          >
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <ArrowRight className="h-10 w-10 text-white transition-transform group-hover:translate-x-1" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse-glow"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {t('featured.exploreAll')}
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  {t('featured.exploreAllDescription')}
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-accent font-mono">
                  <span>200+</span>
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  <span>{t('featured.productsAvailable')}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center space-y-8 animate-slide-up">
          <div className="space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('featured.cta.title')}
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('featured.cta.description')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products">
              <Button className="btn-hero">
                <ArrowRight className="h-5 w-5" />
                <span>{t('featured.browseCatalog')}</span>
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="btn-neon">
                <Send className="h-5 w-5" />
                <span>{t('featured.contactSales')}</span>
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>{t('featured.stats.countries')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>{t('featured.stats.support')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span>{t('featured.stats.shipping')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;