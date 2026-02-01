import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-gaming-bg.jpg";
import heroImage1 from "@/assets/hero/asus1.jpg";
import heroImage2 from "@/assets/hero/meta1.jpg";

// FEATURE FLAG: Toggle between hero variants
// Options: "gaming" | "photo" | "photo-carousel"
const HERO_VARIANT: "gaming" | "photo" | "photo-carousel" = "photo-carousel";

// Carousel images for photo-carousel variant
const CAROUSEL_IMAGES = [heroImage1, heroImage2];

const HeroSection = () => {
  // Carousel state (only used for photo-carousel variant)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (HERO_VARIANT !== "photo-carousel") return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Determine variant class
  const variantClass =
    HERO_VARIANT === "photo" ? "hero--photo" :
    HERO_VARIANT === "photo-carousel" ? "hero--photo-carousel" :
    "hero--gaming";

  // CAROUSEL MODE: Images only, no content
  if (HERO_VARIANT === "photo-carousel") {
    return (
      <section className={`hero hero--photo-carousel relative overflow-hidden`}>
        {/* Carousel slides */}
        <div className="hero-carousel relative w-full h-[280px] md:h-[350px] lg:h-[420px]">
          {CAROUSEL_IMAGES.map((image, index) => (
            <div
              key={index}
              className={`hero-carousel__slide absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          ))}
        </div>

        {/* Carousel dots */}
        <div className="hero__dots absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {CAROUSEL_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`hero__dot w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    );
  }

  // GAMING / PHOTO MODE: Full content with overlays
  return (
    <section
      className={`hero relative overflow-hidden py-16 md:py-24 ${variantClass}`}
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay - styled differently per variant via CSS */}
      <div className="hero__overlay absolute inset-0" />

      {/* Colored gradient overlay - gaming variant only */}
      <div className="hero__colored-overlay absolute inset-0" />

      {/* Animated glow elements - gaming variant only */}
      <div className="hero__glow-container absolute inset-0 overflow-hidden">
        <div className="hero__glow hero__glow-1 absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full blur-3xl animate-pulse-glow" />
        <div className="hero__glow hero__glow-2 absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="hero__glow hero__glow-3 absolute top-1/4 left-1/3 h-64 w-64 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Grid pattern overlay - gaming variant only */}
      <div className="hero__grid absolute inset-0" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent vibrant-border">
            <Zap className="h-4 w-4" />
            <span>משלוח חינם בהזמנה מעל ₪500</span>
          </div>

          <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
            <span className="text-foreground drop-shadow-lg">הציוד הכי טוב</span>
            <br />
            <span className="text-gradient-gaming">לגיימרים אמיתיים</span>
          </h1>

          <p className="mb-8 text-lg text-foreground/90 md:text-xl drop-shadow-md">
            מבחר ענק של מוצרי גיימינג מהמותגים המובילים בעולם.
            <br className="hidden sm:block" />
            מחשבים, כרטיסי מסך, ציוד היקפי ועוד - הכל במקום אחד!
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group bg-gradient-cta hover:opacity-90 text-white neon-glow-blue text-lg px-8 py-6 font-bold">
              צפה במבצעים
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-accent/50 text-foreground hover:bg-accent/20 hover:text-accent hover:border-accent text-lg px-8 py-6">
              קטלוג מוצרים
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center bg-background/40 backdrop-blur-sm rounded-xl p-4 vibrant-border">
              <div className="text-2xl font-bold text-accent md:text-4xl">5,000+</div>
              <div className="text-sm text-muted-foreground">מוצרים</div>
            </div>
            <div className="text-center bg-background/40 backdrop-blur-sm rounded-xl p-4 vibrant-border">
              <div className="text-2xl font-bold text-neon-magenta md:text-4xl">50,000+</div>
              <div className="text-sm text-muted-foreground">לקוחות מרוצים</div>
            </div>
            <div className="text-center bg-background/40 backdrop-blur-sm rounded-xl p-4 vibrant-border">
              <div className="text-2xl font-bold text-neon-purple md:text-4xl">24/7</div>
              <div className="text-sm text-muted-foreground">תמיכה טכנית</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
