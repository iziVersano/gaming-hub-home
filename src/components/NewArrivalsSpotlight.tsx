import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, Product } from '@/lib/api';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/hooks/I18nContext';

import metaBright from '@/pages/images/bright/meta_bright.png';
import asusBright from '@/pages/images/bright/asus_bright.png';
import switchBright from '@/pages/images/bright/switch_bright.png';

const BRIGHT_IMAGES: Record<number, string> = {
  8: metaBright,
  9: asusBright,
  10: switchBright,
};

const NewArrivalsSpotlight = () => {
  const { lang, t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (productId: number) => {
    setLoadedImages((prev) => new Set(prev).add(productId));
  };

  // Refetch products when language changes - queryKey includes lang for cache invalidation
  const { data: products = [] } = useQuery({
    queryKey: ['products', lang],
    queryFn: () => getProducts(lang),
  });

  // Filter only New Arrivals - match against English category name from API
  const newArrivals = products.filter((p: Product) =>
    p.category === 'New Arrivals'
  );

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || newArrivals.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newArrivals.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, newArrivals.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + newArrivals.length) % newArrivals.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % newArrivals.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (newArrivals.length === 0) return null;

  const currentProduct = newArrivals[currentIndex];

  // Get translated title based on product ID
  const getTranslatedTitle = (product: Product) => {
    const titleMap: Record<number, string> = {
      8: t('products.titles.metaQuest3', product.title),
      9: t('products.titles.asusRog', product.title),
      10: t('products.titles.nintendoSwitch2', product.title),
    };
    return titleMap[product.id] || product.title;
  };

  // Get translated description based on product ID
  const getTranslatedDescription = (product: Product) => {
    const descriptionMap: Record<number, string> = {
      8: t('products.descriptions.metaQuest3', product.description),
      9: t('products.descriptions.asusRog', product.description),
      10: t('products.descriptions.nintendoSwitch2', product.description),
    };
    return descriptionMap[product.id] || product.description;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header - Refined */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
        <Sparkles className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-primary uppercase tracking-widest">
          {t('products.newArrivalsHeader')}
        </span>
        <Sparkles className="w-5 h-5 text-primary" />
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
      </div>

      {/* Main Spotlight Container */}
      <Link
        to="/products?category=New+Arrivals"
        className="block relative rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 shadow-lg hover:shadow-xl cursor-pointer bg-card"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Full Image Container */}
        <div className="relative h-72 md:h-[400px]">
          {/* Shimmer placeholder */}
          {!loadedImages.has(currentProduct.id) && (
            <div className="absolute inset-0 shimmer rounded-2xl" />
          )}
          {/* Product Image */}
          <img
            src={BRIGHT_IMAGES[currentProduct.id]}
            alt={currentProduct.title}
            className={`w-full h-full object-cover transition-all duration-700 hover:scale-[1.02] ${
              loadedImages.has(currentProduct.id) ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(currentProduct.id)}
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Dots Indicator */}
          {newArrivals.length > 1 && (
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
              {newArrivals.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white w-8'
                      : 'bg-white/40 hover:bg-white/60 w-2'
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Text Overlay Bar */}
          <div className="absolute bottom-0 left-0 right-0 py-4 px-6 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
              {getTranslatedTitle(currentProduct)}
            </h3>
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto line-clamp-1">
              {getTranslatedDescription(currentProduct)}
            </p>
          </div>

          {/* Navigation Arrows - Refined */}
          {newArrivals.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white border border-border/50 hover:border-primary/50 transition-all duration-300 text-foreground shadow-md hover:shadow-lg"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white border border-border/50 hover:border-primary/50 transition-all duration-300 text-foreground shadow-md hover:shadow-lg"
                aria-label="Next product"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Auto-play progress bar */}
        {isAutoPlaying && newArrivals.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20">
            <div
              key={currentIndex}
              className="h-full bg-primary animate-progress"
              style={{ animationDuration: '5s' }}
            />
          </div>
        )}
      </Link>

      {/* Product Thumbnails - Cleaner */}
      {newArrivals.length > 1 && (
        <div className="flex justify-center gap-3 mt-4">
          {newArrivals.map((product, index) => (
            <button
              key={product.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-primary shadow-md scale-105'
                  : 'border-border hover:border-primary/50 opacity-70 hover:opacity-100'
              }`}
            >
              {!loadedImages.has(product.id) && (
                <div className="absolute inset-0 shimmer rounded-xl" />
              )}
              <img
                src={BRIGHT_IMAGES[product.id]}
                alt={product.title}
                className={`w-full h-full object-contain bg-card p-1.5 transition-opacity duration-500 ${
                  loadedImages.has(product.id) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(product.id)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivalsSpotlight;
