import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary gaming-border">
            <Zap className="h-4 w-4" />
            <span>משלוח חינם בהזמנה מעל ₪500</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
            <span className="text-foreground">הציוד הכי טוב</span>
            <br />
            <span className="text-gradient-gaming">לגיימרים אמיתיים</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            מבחר ענק של מוצרי גיימינג מהמותגים המובילים בעולם.
            <br className="hidden sm:block" />
            מחשבים, כרטיסי מסך, ציוד היקפי ועוד - הכל במקום אחד!
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-cyan text-lg px-8 py-6">
              צפה במבצעים
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-card hover:text-primary text-lg px-8 py-6">
              קטלוג מוצרים
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary md:text-4xl">5,000+</div>
              <div className="text-sm text-muted-foreground">מוצרים</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary md:text-4xl">50,000+</div>
              <div className="text-sm text-muted-foreground">לקוחות מרוצים</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent md:text-4xl">24/7</div>
              <div className="text-sm text-muted-foreground">תמיכה טכנית</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
