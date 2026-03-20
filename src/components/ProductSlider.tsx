import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Gamepad2, Monitor, Plane, Bike, Cpu, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getProducts, getImageUrl, type Product as ApiProduct, FALLBACK_PRODUCTS, FALLBACK_PRODUCTS_HE } from '@/lib/api';
import { useI18n } from '@/hooks/I18nContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
}

const ProductSlider = () => {
  const { t, lang } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (productId: number) => {
    setLoadedImages((prev) => new Set(prev).add(productId));
  };

  // Refetch products when language changes
  useEffect(() => {
    loadProducts();
  }, [lang]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      // Pass current language to API to get localized products
      const apiProducts = await getProducts(lang);
      // Transform and take first 5 products for the slider
      const transformedProducts: Product[] = apiProducts.slice(0, 5).map((p: ApiProduct) => ({
        id: p.id,
        name: p.title,
        category: p.category,
        description: p.description,
        image: p.imageUrl,
      }));
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Use fallback products when API fails
      const fallbackList = lang === 'he' ? FALLBACK_PRODUCTS_HE : FALLBACK_PRODUCTS;
      const transformedFallback: Product[] = fallbackList.slice(0, 5).map((p: ApiProduct) => ({
        id: p.id,
        name: p.title,
        category: p.category,
        description: p.description,
        image: p.imageUrl,
      }));
      setProducts(transformedFallback);
    } finally {
      setIsLoading(false);
    }
  };
  // Animation variants for staggered effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      x: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const, // Premium easing curve
      },
    },
  };

  if (isLoading) {
    return (
      <section className="pt-6 pb-4 md:pt-16 md:pb-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-16">
            <div className="shimmer h-10 w-64 mx-auto rounded-lg mb-4" />
            <div className="shimmer h-6 w-96 max-w-full mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-card p-0 overflow-hidden" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="shimmer-card h-56 sm:h-56 md:h-64 w-full rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="shimmer h-5 w-1/3 rounded-full" />
                  <div className="shimmer h-6 w-3/4 rounded-md" />
                  <div className="shimmer h-4 w-full rounded-md" />
                  <div className="shimmer h-4 w-2/3 rounded-md" />
                  <div className="flex justify-end pt-2">
                    <div className="shimmer h-9 w-28 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the slider if no products
  }

  return (
    <section className="pt-6 pb-4 md:pt-16 md:pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-16">
          <div className="mb-4">
            <span className="gradient-text text-2xl md:text-4xl text-section-heading block mb-2">{t('products.featuredTitle')}</span>
            <div className="text-lg md:text-2xl text-muted-foreground text-desc-bold">{t('products.featuredDescription')}</div>
          </div>

          {/* Category Icon Bar */}
          <div className="grid grid-cols-3 md:flex md:flex-wrap justify-center gap-3 md:gap-10 mt-6 pt-5 border-t border-border/40">
            {[
              { icon: Gamepad2, label: t('featured.cat.gaming', 'Gaming'), categoryKey: 'gaming' },
              { icon: Monitor, label: t('featured.cat.displays', 'Displays'), categoryKey: 'tvs' },
              { icon: Plane, label: t('featured.cat.drones', 'Drones'), categoryKey: 'drones' },
              { icon: Bike, label: t('featured.cat.ebikes', 'E-Bikes'), categoryKey: 'ebikes' },
              { icon: Cpu, label: t('featured.cat.electronics', 'Electronics'), categoryKey: 'electronics' },
              { icon: ShoppingBag, label: t('featured.cat.all', 'All'), categoryKey: '' },
            ].map(({ icon: Icon, label, categoryKey }) => (
              <Link
                key={label}
                to={categoryKey ? `/products?category=${encodeURIComponent(t(`products.category.${categoryKey}`))}` : '/products'}
                className="flex flex-col items-center gap-1.5 group/cat"
              >
                <div className="w-11 h-11 rounded-xl bg-card border border-border/60 group-hover/cat:border-primary/50 group-hover/cat:bg-primary/10 flex items-center justify-center transition-all duration-300 shadow-sm">
                  <Icon className="w-5 h-5 text-muted-foreground group-hover/cat:text-primary transition-colors duration-300" />
                </div>
                <span className="text-[11px] md:text-xs text-primary font-medium group-hover/cat:underline underline-offset-4 transition-all duration-200 text-center leading-tight">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Product Slider */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={24}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
              stopOnLastSlide: true,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet product-slider-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active product-slider-bullet-active',
            }}
            navigation={{
              nextEl: '.product-slider-next',
              prevEl: '.product-slider-prev',
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            speed={600}
            grabCursor={true}
            loop={false}
            className="product-swiper"
            onAutoplayStop={() => {
              // Optional: Can add any logic when autoplay stops
            }}
          >
            {products.map((product, index) => (
              <SwiperSlide key={product.id} className="h-auto">
                <motion.div 
                  className="product-card group h-full flex flex-col"
                  variants={cardVariants}
                  custom={index}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4 flex-shrink-0">
                    <div
                      className={`absolute inset-0 shimmer-card transition-opacity duration-700 ${
                        loadedImages.has(product.id) ? 'opacity-0 pointer-events-none' : 'opacity-100'
                      }`}
                    />
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                      width={600}
                      height={256}
                      className={cn(
                        "w-full h-56 sm:h-56 md:h-64 transition-all duration-500",
                        "object-cover group-hover:scale-105",
                        loadedImages.has(product.id) ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={() => handleImageLoad(product.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/55 backdrop-blur-sm text-white/90 px-2.5 py-1 rounded-full text-xs font-medium border border-white/10">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-grow space-y-3">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-end pt-2">
                      <Link to={`/products?q=${encodeURIComponent(product.name)}`}>
                        <Button className="btn-accent-small">
                          <ArrowRight className="h-4 w-4" />
                          <span>{t('slider.learnMore')}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation arrows - Desktop only */}
          <div className="hidden lg:block">
            <button aria-label="Previous product" className="product-slider-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button aria-label="Next product" className="product-slider-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* CTA Section */}
        <div className="text-center mt-8 md:mt-12">
          <Link to="/products">
            <Button className="btn-hero">
              <ArrowRight className="h-5 w-5" />
              <span>{t('slider.exploreAll')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
