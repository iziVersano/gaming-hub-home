import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Filter, Search, Phone, RotateCcw, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProducts, getImageUrl, type Product as ApiProduct, FALLBACK_PRODUCTS } from '@/lib/api';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/I18nContext';

interface Product {
  id: number | string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  price: string;
}

const categoryKeys = [
  'all',
  'newArrivals',
  'gaming',
  'electronics',
  'drones',
  'ebikes',
  'tvs'
];

const Products = () => {
  const { t, lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState(t('products.category.all'));
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt: string } | null>(null);

  const location = useLocation();

  // Load products from API - refetch when language changes
  useEffect(() => {
    loadProducts();
  }, [lang]);

  // Handle URL query params for search (?q=) and category (?category=)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const category = params.get('category') || '';

    // If category is specified, set it and clear search
    if (category) {
      setSelectedCategory(category);
      setSearchTerm(''); // Clear search when coming from category link
    } else if (q) {
      setSearchTerm(q);
    }
  }, [location.search]);

  // Handle ESC key for lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) {
        setLightboxImage(null);
      }
    };

    if (lightboxImage) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxImage]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      // Pass current language to API to get localized products
      const apiProducts = await getProducts(lang);
      // Transform API products to match the component's expected format
      const transformedProducts: Product[] = apiProducts.map((p: ApiProduct) => ({
        id: p.id,
        name: p.title,
        category: p.category,
        description: p.description,
        image: p.imageUrl,
        features: extractFeatures(p.description),
        price: p.price > 0 ? `$${p.price.toFixed(2)}` : 'Contact for pricing'
      }));
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Use fallback products when API fails
      const transformedFallback: Product[] = FALLBACK_PRODUCTS.map((p: ApiProduct) => ({
        id: p.id,
        name: p.title,
        category: p.category,
        description: p.description,
        image: p.imageUrl,
        features: extractFeatures(p.description),
        price: p.price > 0 ? `$${p.price.toFixed(2)}` : 'Contact for pricing'
      }));
      setProducts(transformedFallback);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract features from description (simple implementation)
  const extractFeatures = (description: string): string[] => {
    // This is a simple fallback - in production, features should be stored separately
    const words = description.split(/[,.]/).map(s => s.trim()).filter(s => s.length > 0);
    return words.slice(0, 4);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-12 w-12 animate-spin text-primary" aria-label="Loading products" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container px-4 md:px-6 pt-32 md:pt-24 pb-16 flex-1">
        <header className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl text-section-heading">{t('products.title')}</h1>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categoryKeys.map(key => (
            <Button
              key={key}
              className={cn('btn-category', selectedCategory === t(`products.category.${key}`) && 'bg-accent text-white')}
              onClick={() => setSelectedCategory(t(`products.category.${key}`))}
            >
              {t(`products.category.${key}`)}
            </Button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              {categoryKeys.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "btn-primary-small" : "btn-accent-small"}
                >
                  <Filter className="h-3 w-3" />
                  <span>{t(`products.category.${category}`)}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card group">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className={cn(
                        "w-full h-48 transition-transform duration-500 object-cover group-hover:scale-110 cursor-pointer"
                      )}
                      onClick={() => setLightboxImage({ url: getImageUrl(product.image), alt: product.name })}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setLightboxImage({ url: getImageUrl(product.image), alt: product.name });
                        }
                      }}
                      aria-label={`View larger image of ${product.name}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl text-sub-bold text-foreground group-hover:text-accent transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                      {product.name}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">{t('products.keyFeatures')}:</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.features.map((feature, index) => (
                          <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end pt-2">
                      <button
                        className="btn-inquiry inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        data-product={product.name}
                        data-sku={`${product.category.toUpperCase()}-${product.id}`}
                        aria-label={`Inquiry about ${product.name}`}
                      >
                        <Phone className="h-4 w-4" />
                        <span>{t('products.inquireNow')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{t('products.noResultsTitle')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('products.noResultsDescription')}
                </p>
                <Button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="btn-neon">
                  <RotateCcw className="h-5 w-5" />
                  <span>{t('products.clearFilters')}</span>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl text-section-heading mb-6">
              {t('products.customSolutionTitle')}
            </h2>
            <p className="text-xl text-muted-foreground text-desc-bold mb-8">
              {t('products.customSolutionDescription')}
            </p>
            <Button asChild className="btn-hero">
              <Link to="/contact">
                <Phone className="h-5 w-5" />
                <span>{t('products.contactSpecialists')}</span>
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />

      {/* Product Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-in fade-in-0 duration-300"
          onClick={() => setLightboxImage(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setLightboxImage(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          tabIndex={-1}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-w-7xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;