import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import product images
import metaBright from "@/assets/products/meta_bright.png";
import monitorBright from "@/assets/products/Monitor_bright.png";
import asusBright from "@/assets/products/asus_bright.png";
import switchBright from "@/assets/products/switch_bright.png";
import sonyPlayStationBright from "@/assets/products/sony_play_station_bright.png";

const products = [
  {
    id: 1,
    name: "Meta Quest VR Headset",
    image: metaBright,
    category: "מציאות מדומה",
    isNew: true,
  },
  {
    id: 2,
    name: "מסך גיימינג 27 אינץ' 240Hz",
    image: monitorBright,
    category: "מסכים",
    isNew: true,
  },
  {
    id: 3,
    name: "ASUS ROG Gaming Laptop",
    image: asusBright,
    category: "מחשבים ניידים",
    isNew: true,
  },
  {
    id: 4,
    name: "Nintendo Switch Console",
    image: switchBright,
    category: "קונסולות",
    isNew: true,
  },
  {
    id: 5,
    name: "Sony PlayStation 5",
    image: sonyPlayStationBright,
    category: "קונסולות",
    isNew: true,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-8 md:py-16 bg-background">
      <div className="container px-3 md:px-4">
        <div className="mb-6 md:mb-8 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground lg:text-4xl">
              מוצרים <span className="text-gradient-gaming">מומלצים</span>
            </h2>
            <p className="mt-1 md:mt-2 text-base md:text-lg font-medium text-muted-foreground">
              המוצרים הפופולריים ביותר השבוע
            </p>
          </div>
          <Button variant="outline" className="group border-accent/50 text-accent hover:bg-accent/10 hover:border-accent text-sm md:text-base font-bold px-4 md:px-5 py-2 md:py-2.5">
            <span className="hidden sm:inline">צפה בהכל</span>
            <span className="sm:hidden">הכל</span>
            <ArrowLeft className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
