import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Loader2, Package, Tag, Info, ChevronRight } from 'lucide-react';
import { getProduct, getImageUrl, type Product as ApiProduct, FALLBACK_PRODUCTS } from '@/lib/api';
import { useI18n } from '@/hooks/I18nContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const p = await getProduct(Number(id), lang);
        setProduct(p);
      } catch {
        // Fallback: find from static list
        const fallback = FALLBACK_PRODUCTS.find(p => p.id === Number(id));
        setProduct(fallback || null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, lang]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-12 w-12 animate-spin text-primary" aria-label="Loading product" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <h1 className="text-2xl font-semibold text-foreground">Product not found</h1>
          <Button asChild variant="outline">
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 me-2" />
              {t('products.back')}
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const features = product.description
    .split(/[,.]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const specs = [
    { label: t('products.category.all') !== 'All' ? 'קטגוריה' : 'Category', value: product.category },
    { label: 'SKU', value: product.sku || `${product.category.toUpperCase().replace(/\s/g, '-')}-${product.id}` },
    ...(product.badges ? [{ label: 'Badges', value: product.badges }] : []),
    ...(product.flags ? [{ label: 'Flags', value: product.flags }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container px-4 md:px-6 pt-40 md:pt-24 pb-16 flex-1">
        {/* Breadcrumb */}
        <nav className="max-w-6xl mx-auto mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">{t('menu.home')}</Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li>
              <Link to="/products" className="hover:text-foreground transition-colors">{t('menu.products')}</Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="text-foreground font-medium truncate max-w-[200px]">{product.title}</li>
          </ol>
        </nav>

        {/* Product Layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.title}
                className="w-full aspect-square object-contain p-8"
              />
            </div>
            <div className="absolute top-4 start-4">
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{product.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications Table */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="bg-muted/50 px-5 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Specifications
                </h2>
              </div>
              <table className="w-full">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 text-sm font-medium text-muted-foreground bg-muted/20 w-1/3">
                        {spec.label}
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Key Features */}
            {features.length > 0 && (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-muted/50 px-5 py-3 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    {t('products.features')}
                  </h2>
                </div>
                <ul className="divide-y divide-border">
                  {features.map((f, i) => (
                    <li key={i} className="px-5 py-3 text-sm text-foreground flex items-start gap-2">
                      <Tag className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                aria-label={`Inquiry about ${product.title}`}
              >
                <Phone className="h-5 w-5" />
                {t('products.inquireNow')}
              </button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products">
                  <ArrowLeft className="h-4 w-4 me-2" />
                  {t('products.back')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
