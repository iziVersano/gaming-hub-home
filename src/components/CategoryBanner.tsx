import { Gamepad2, Smartphone, Monitor, Headphones, Package, ArrowLeft } from "lucide-react";

// Import category images from assets/categories/
import consolesImg from "@/assets/categories/CFI_300x.avif";
import handheldImg from "@/assets/categories/GPDRA-RGB-PCK_300x.avif";
import tvImg from "@/assets/categories/65_X80K_blk_blk_dot_outsideh_front_300x.avif";

const categories = [
  {
    id: 1,
    name: "קונסולות",
    image: consolesImg,
    icon: Gamepad2,
    // Gradient: Blue start
    gradient: "bg-gradient-to-br from-blue-500/15 to-violet-500/15",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/20",
  },
  {
    id: 2,
    name: "קונסולת יד",
    image: handheldImg,
    icon: Smartphone,
    // Gradient: Blue-violet
    gradient: "bg-gradient-to-br from-violet-500/15 to-purple-500/15",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/20",
  },
  {
    id: 3,
    name: "מסכים",
    image: tvImg,
    icon: Monitor,
    // Gradient: Purple center
    gradient: "bg-gradient-to-br from-purple-500/15 to-fuchsia-500/15",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/20",
  },
  {
    id: 4,
    name: "ציוד היקפי",
    image: handheldImg,
    icon: Headphones,
    // Gradient: Purple-magenta
    gradient: "bg-gradient-to-br from-fuchsia-500/15 to-pink-500/15",
    iconColor: "text-fuchsia-500",
    iconBg: "bg-fuchsia-500/20",
  },
  {
    id: 5,
    name: "אביזרים",
    image: consolesImg,
    icon: Package,
    // Gradient: Magenta end
    gradient: "bg-gradient-to-br from-pink-500/15 to-rose-500/15",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/20",
  },
];

const CategoryBanner = () => {
  return (
    <section className="pt-6 pb-12 bg-white">
      <div className="container">
        <div className="grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <a
                key={category.id}
                href="#"
                className="group flex flex-col items-center text-center p-2 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative mb-4 flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-32 md:h-40 lg:h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Category Name with Arrow */}
                <div className="flex items-center gap-1 text-primary">
                  <ArrowLeft className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  <h3 className="text-sm md:text-base font-semibold transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;
