import { Shield, Award, Truck, Tag } from 'lucide-react';
import { useI18n } from '@/hooks/I18nContext';

const badges = [
  { key: 'trustBadges.authorizedDistributor', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { key: 'trustBadges.fullWarranty', icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { key: 'trustBadges.fastShipping', icon: Truck, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { key: 'trustBadges.competitivePrices', icon: Tag, color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

const TrustBadges = () => {
  const { t } = useI18n();

  return (
    <section className="py-3 px-3">
      <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
        {badges.map(({ key, icon: Icon, color, bg }) => (
          <div
            key={key}
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-card/95 border border-border/50 shadow-sm"
          >
            <div className={`shrink-0 p-1.5 rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} strokeWidth={2.2} />
            </div>
            <span className="text-xs font-bold text-foreground leading-tight">{t(key)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
