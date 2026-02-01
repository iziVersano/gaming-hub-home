import { Cpu, Monitor, Headphones, Gamepad2 } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "מחשבים",
    icon: Cpu,
    color: "primary" as const,
    count: 850,
  },
  {
    id: 2,
    name: "מסכים",
    icon: Monitor,
    color: "secondary" as const,
    count: 420,
  },
  {
    id: 3,
    name: "אוזניות",
    icon: Headphones,
    color: "accent" as const,
    count: 280,
  },
  {
    id: 4,
    name: "בקרים",
    icon: Gamepad2,
    color: "primary" as const,
    count: 150,
  },
];

const CategoryBanner = () => {
  return (
    <section className="py-12 bg-card/30 border-y border-border">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const colorClasses = {
              primary: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/30",
              secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/30",
              accent: "bg-accent/10 text-accent hover:bg-accent/20 border-accent/30",
            };

            return (
              <a
                key={category.id}
                href="#"
                className={`group flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 ${colorClasses[category.color]}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background/50">
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
