import { Button } from "@/components/ui/button";
import { Timer, ArrowLeft } from "lucide-react";

const PromoBanner = () => {
  return (
    <section className="py-16 bg-gradient-section">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-electric-blue via-neon-purple to-neon-magenta p-8 md:p-12">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center text-center md:flex-row md:justify-between md:text-right">
            <div className="mb-6 md:mb-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
                <Timer className="h-4 w-4 animate-pulse" />
                <span>מבצע לזמן מוגבל!</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white md:text-4xl">
                עד <span className="text-white drop-shadow-lg">40%</span> הנחה על כרטיסי מסך
              </h3>
              <p className="text-white/90">
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
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-xl font-bold text-white">
                      {item.value}
                    </div>
                    <span className="mt-1 text-xs text-white/80">{item.label}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="group bg-white text-neon-purple hover:bg-white/90 font-bold shadow-lg">
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
