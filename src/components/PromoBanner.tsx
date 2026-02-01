import { Button } from "@/components/ui/button";
import { Timer, ArrowLeft } from "lucide-react";

const PromoBanner = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl gaming-border bg-gradient-hero p-8 md:p-12">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center text-center md:flex-row md:justify-between md:text-right">
            <div className="mb-6 md:mb-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary">
                <Timer className="h-4 w-4 animate-pulse" />
                <span>מבצע לזמן מוגבל!</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-foreground md:text-4xl">
                עד <span className="text-secondary">40%</span> הנחה על כרטיסי מסך
              </h3>
              <p className="text-muted-foreground">
                מבצע בלעדי על סדרת RTX 40 - רק עד סוף השבוע!
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 md:items-end">
              {/* Countdown */}
              <div className="flex gap-3">
                {[
                  { value: "02", label: "ימים" },
                  { value: "14", label: "שעות" },
                  { value: "36", label: "דקות" },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-card border border-border text-xl font-bold text-secondary">
                      {item.value}
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="group bg-secondary text-secondary-foreground hover:bg-secondary/90 neon-glow-magenta">
                צפה במבצעים
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
