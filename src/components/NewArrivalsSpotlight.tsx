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
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        <span className="text-lg font-semibold text-primary uppercase tracking-wider">
          {t('products.newArrivalsHeader')}
        </span>
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
      </div>

      {/* Main Spotlight Container - Clickable */}
      <Link
        to="/products?category=New+Arrivals"
        className="block relative rounded-2xl overflow-hidden border border-primary/30 hover:border-primary/60 transition-all duration-500 shadow-2xl shadow-primary/20 cursor-pointer"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Full Image Container */}
        <div className="relative h-80 md:h-[450px]">
          {/* Product Image - Full Size with rounded corners */}
          <img
            src={BRIGHT_IMAGES[currentProduct.id]}
            alt={currentProduct.title}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-700 hover:scale-105"
          />

          {/* Dots Indicator */}
          {newArrivals.length > 1 && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-3">
              {newArrivals.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Text Overlay Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent rounded-b-2xl py-5 px-4 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              {getTranslatedTitle(currentProduct)}
            </h3>
            <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto line-clamp-1">
              {getTranslatedDescription(currentProduct)}
            </p>
          </div>

          {/* Navigation Arrows */}
          {newArrivals.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-white"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-white"
                aria-label="Next product"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Auto-play progress bar */}
        {isAutoPlaying && newArrivals.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20 rounded-b-2xl">
            <div
              key={currentIndex}
              className="h-full bg-primary animate-progress rounded-b-2xl"
              style={{ animationDuration: '5s' }}
            />
          </div>
        )}
      </Link>

      {/* Product Thumbnails */}
      {newArrivals.length > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          {newArrivals.map((product, index) => (
            <button
              key={product.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-primary shadow-lg shadow-primary/30 scale-110'
                  : 'border-border/50 hover:border-primary/50 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={BRIGHT_IMAGES[product.id]}
                alt={product.title}
                className="w-full h-full object-contain bg-background/50 p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivalsSpotlight;
