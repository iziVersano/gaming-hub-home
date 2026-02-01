import { Cpu, Monitor, Headphones, Gamepad2 } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "מחשבים",
    icon: Cpu,
    color: "accent" as const,
    count: 850,
  },
  {
    id: 2,
    name: "מסכים",
    icon: Monitor,
    color: "magenta" as const,
    count: 420,
  },
  {
    id: 3,
    name: "אוזניות",
    icon: Headphones,
    color: "purple" as const,
    count: 280,
  },
  {
    id: 4,
    name: "בקרים",
    icon: Gamepad2,
    color: "blue" as const,
    count: 150,
  },
];

const CategoryBanner = () => {
  return (
    <section className="py-12 bg-gradient-section border-y border-border">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const colorClasses = {
              accent: "bg-accent/15 text-accent hover:bg-accent/25 border-accent/40",
              magenta: "bg-neon-magenta/15 text-neon-magenta hover:bg-neon-magenta/25 border-neon-magenta/40",
              purple: "bg-neon-purple/15 text-neon-purple hover:bg-neon-purple/25 border-neon-purple/40",
              blue: "bg-electric-blue/15 text-electric-blue hover:bg-electric-blue/25 border-electric-blue/40",
            };

            return (
              <a
                key={category.id}
                href="#"
                className={`group flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 ${colorClasses[category.color]}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background/60">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} מוצרים</p>
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
