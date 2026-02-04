import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getProducts, getImageUrl, type Product as ApiProduct, FALLBACK_PRODUCTS } from '@/lib/api';
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
  price: string;
}

const ProductSlider = () => {
  const { t, lang } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        price: p.price > 0 ? `$${p.price.toFixed(2)}` : 'Contact for pricing'
      }));
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Use fallback products when API fails
      const transformedFallback: Product[] = FALLBACK_PRODUCTS.slice(0, 5).map((p: ApiProduct) => ({
        id: p.id,
        name: p.title,
        category: p.category,
        description: p.description,
        image: p.imageUrl,
        price: p.price > 0 ? `$${p.price.toFixed(2)}` : 'Contact for pricing'
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
      <section className="pt-12 pb-6 md:pt-16 md:pb-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the slider if no products
  }

  return (
    <section className="pt-12 pb-6 md:pt-16 md:pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="mb-8">
            <span className="gradient-text text-3xl md:text-4xl font-bold block mb-2">{t('products.featuredTitle')}</span>
            <div className="text-lg md:text-2xl text-muted-foreground">{t('products.featuredDescription')}</div>
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
                spaceBetween: 16,
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
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className={cn(
                        "w-full h-48 sm:h-56 md:h-64 transition-transform duration-500",
                        "object-cover group-hover:scale-110"
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
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
            <button className="product-slider-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="product-slider-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
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
