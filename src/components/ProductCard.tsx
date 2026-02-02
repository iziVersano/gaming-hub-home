import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  price?: number;
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
  return (
    <div className="group relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-card border border-border transition-all duration-300 hover:border-accent/50 hover:neon-glow-cyan">
      {/* Badges */}
      <div className="absolute top-2 md:top-3 right-2 md:right-3 z-10 flex flex-col gap-1 md:gap-2">
        {isNew && (
          <Badge className="bg-electric-blue text-white text-xs">חדש</Badge>
        )}
      </div>

      {/* Wishlist button */}
      <button className="absolute top-2 md:top-3 left-2 md:left-3 z-10 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground transition-colors hover:bg-card hover:text-neon-magenta">
        <Heart className="h-3 w-3 md:h-4 md:w-4" />
      </button>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/30 p-2 md:p-4">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-2 md:p-4">
        <p className="mb-0.5 md:mb-1 text-[10px] md:text-xs text-muted-foreground">{category}</p>
        <h3 className="mb-2 md:mb-3 line-clamp-2 text-xs md:text-sm font-medium text-foreground group-hover:text-accent transition-colors leading-tight">
          {name}
        </h3>

        <div className="flex items-center justify-end">
          <Button
            size="icon"
            className="h-8 w-8 md:h-9 md:w-9 bg-gradient-cta hover:opacity-90 text-white"
          >
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
