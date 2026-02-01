import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductCard = ({
  name,
  price,
  originalPrice,
  image,
  category,
  isNew,
  isSale,
}: ProductCardProps) => {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-card border border-border transition-all duration-300 hover:border-accent/50 hover:neon-glow-cyan">
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {isNew && (
          <Badge className="bg-electric-blue text-white">חדש</Badge>
        )}
        {isSale && discount > 0 && (
          <Badge className="bg-neon-magenta text-white">
            {discount}%- הנחה
          </Badge>
        )}
      </div>

      {/* Wishlist button */}
      <button className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground transition-colors hover:bg-card hover:text-neon-magenta">
        <Heart className="h-4 w-4" />
      </button>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/30 p-4">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="mb-1 text-xs text-muted-foreground">{category}</p>
        <h3 className="mb-3 line-clamp-2 text-sm font-medium text-foreground group-hover:text-accent transition-colors">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-accent">₪{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₪{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <Button
            size="icon"
            className="h-9 w-9 bg-gradient-cta hover:opacity-90 text-white"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
