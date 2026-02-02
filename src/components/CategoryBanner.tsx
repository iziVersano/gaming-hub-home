import { Gamepad2, Smartphone, Monitor, Headphones, Package, ArrowLeft } from "lucide-react";

// Import product images for categories
import asusBright from "@/assets/products/asus_bright.png";
import monitorBright from "@/assets/products/Monitor_bright.png";
import sonyPlayStationBright from "@/assets/products/sony_play_station_bright.png";
import metaBright from "@/assets/products/meta_bright.png";

const categories = [
  {
    id: 1,
    name: "גיימינג",
    image: asusBright,
    icon: Gamepad2,
    // Gradient: Blue start
    gradient: "bg-gradient-to-br from-blue-500/15 to-violet-500/15",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/20",
  },
  {
    id: 2,
    name: "אלקטרוניקה",
    image: monitorBright,
    icon: Smartphone,
    // Gradient: Blue-violet
    gradient: "bg-gradient-to-br from-violet-500/15 to-purple-500/15",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/20",
  },
  {
    id: 3,
    name: "טלוויזיות",
    image: monitorBright,
    icon: Monitor,
    // Gradient: Purple center
    gradient: "bg-gradient-to-br from-purple-500/15 to-fuchsia-500/15",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/20",
  },
  {
    id: 4,
    name: "קונסולות",
    image: sonyPlayStationBright,
    icon: Headphones,
    // Gradient: Purple-magenta
    gradient: "bg-gradient-to-br from-fuchsia-500/15 to-pink-500/15",
    iconColor: "text-fuchsia-500",
    iconBg: "bg-fuchsia-500/20",
  },
  {
    id: 5,
    name: "מציאות מדומה",
    image: metaBright,
    icon: Package,
    // Gradient: Magenta end
    gradient: "bg-gradient-to-br from-pink-500/15 to-rose-500/15",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/20",
  },
];

const CategoryBanner = () => {
  return (
    <section className="pt-3 pb-6 md:pt-6 md:pb-12 bg-white">
      {/* Mobile scroll hint - hidden on desktop */}
      <div className="category-scroll-hint flex items-center justify-center gap-2 mb-3 md:hidden text-xs font-medium text-purple-600">
        <ArrowLeft className="h-3 w-3" />
        <span>החלק לצפייה בקטגוריות</span>
        <ArrowLeft className="h-3 w-3 rotate-180" />
      </div>

      <div className="container px-0 md:px-4">
        {/* Mobile: Horizontal slider with fade gradient | Desktop: Grid */}
        <div className="relative">
          {/* Gradient fade overlay on left edge - mobile only */}
          <div className="category-fade-left md:hidden absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"></div>

          <div className="category-slider-mobile md:grid md:grid-cols-5 md:gap-4 lg:gap-6">
            {categories.map((category) => {
              return (
                <a
                  key={category.id}
                  href="#"
                  className="category-card-mobile group flex flex-col items-center text-center p-2 md:p-2 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative mb-1.5 md:mb-3 flex items-center justify-center flex-1 w-full">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-32 md:h-44 lg:h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Category Name with Arrow */}
                  <div className="flex items-center gap-1 text-primary pb-1">
                    <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    <h3 className="text-xs md:text-base font-semibold transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Scroll dots indicator - mobile only */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {categories.map((_, index) => (
            <div
              key={index}
              className="category-dot h-1.5 w-1.5 rounded-full bg-gray-300"
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;
