import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";
import heroBg from "@/assets/hero-gaming-bg.jpg";

const HeroSection = () => {
  return (
    <section 
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      
      {/* Colored gradient overlay for vibrancy */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 via-transparent to-electric-blue/20" />

      {/* Animated glow elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-electric-blue/20 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-neon-magenta/20 blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-neon-purple/20 blur-3xl animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--accent) / 0.4) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--accent) / 0.4) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent vibrant-border">
            <Zap className="h-4 w-4" />
            <span>משלוח חינם בהזמנה מעל ₪500</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
            <span className="text-white drop-shadow-lg">הציוד הכי טוב</span>
            <br />
            <span className="text-gradient-gaming">לגיימרים אמיתיים</span>
          </h1>
          
          <p className="mb-8 text-lg text-white/90 md:text-xl drop-shadow-md">
            מבחר ענק של מוצרי גיימינג מהמותגים המובילים בעולם.
            <br className="hidden sm:block" />
            מחשבים, כרטיסי מסך, ציוד היקפי ועוד - הכל במקום אחד!
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group bg-gradient-cta hover:opacity-90 text-white neon-glow-blue text-lg px-8 py-6 font-bold">
              צפה במבצעים
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-accent/50 text-white hover:bg-accent/20 hover:text-accent hover:border-accent text-lg px-8 py-6">
              קטלוג מוצרים
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center bg-background/40 backdrop-blur-sm rounded-xl p-4 vibrant-border">
              <div className="text-2xl font-bold text-accent md:text-4xl">5,000+</div>
              <div className="text-sm text-white/80">מוצרים</div>
            </div>
            <div className="text-center bg-background/40 backdrop-blur-sm rounded-xl p-4 vibrant-border">
              <div className="text-2xl font-bold text-neon-magenta md:text-4xl">50,000+</div>
              <div className="text-sm text-white/80">לקוחות מרוצים</div>
            </div>
            <div className="text-center bg-background/40 backdrop-blur-sm rounded-xl p-4 vibrant-border">
              <div className="text-2xl font-bold text-neon-purple md:text-4xl">24/7</div>
              <div className="text-sm text-white/80">תמיכה טכנית</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
