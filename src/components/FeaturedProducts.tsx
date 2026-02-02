import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const products = [
  {
    id: 1,
    name: "כרטיס מסך RTX 4080 SUPER 16GB Gaming",
    price: 4299,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80",
    category: "כרטיסי מסך",
    isSale: true,
  },
  {
    id: 2,
    name: "מסך גיימינג 27 אינץ' 240Hz QHD IPS",
    price: 1899,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80",
    category: "מסכים",
    isNew: true,
  },
  {
    id: 3,
    name: "מקלדת מכנית RGB עם מתגי Cherry MX",
    price: 549,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&q=80",
    category: "ציוד היקפי",
    isSale: true,
  },
  {
    id: 4,
    name: "עכבר גיימינג אלחוטי 25,000 DPI",
    price: 399,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80",
    category: "ציוד היקפי",
    isNew: true,
  },
  {
    id: 5,
    name: "אוזניות גיימינג 7.1 סראונד עם מיקרופון",
    price: 649,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80",
    category: "אוזניות",
    isSale: true,
  },
  {
    id: 6,
    name: "מחשב גיימינג מוכן i9 + RTX 4090",
    price: 18999,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&q=80",
    category: "מחשבים",
    isNew: true,
  },
  {
    id: 7,
    name: "כיסא גיימינג ארגונומי מקצועי",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=80",
    category: "ריהוט גיימינג",
    isSale: true,
  },
  {
    id: 8,
    name: "פד עכבר XL RGB עם טעינה אלחוטית",
    price: 299,
    image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=400&q=80",
    category: "אביזרים",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-8 md:py-16 bg-background">
      <div className="container px-3 md:px-4">
        <div className="mb-6 md:mb-8 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground lg:text-3xl">
              מוצרים <span className="text-gradient-gaming">מומלצים</span>
            </h2>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
              המוצרים הפופולריים ביותר השבוע
            </p>
          </div>
          <Button variant="outline" className="group border-accent/50 text-accent hover:bg-accent/10 hover:border-accent text-xs md:text-sm px-3 md:px-4">
            <span className="hidden sm:inline">צפה בהכל</span>
            <span className="sm:hidden">הכל</span>
            <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
