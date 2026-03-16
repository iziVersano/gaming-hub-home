import { Shield, Award, Truck, Tag } from 'lucide-react';
import { useI18n } from '@/hooks/I18nContext';

const badges = [
  { key: 'trustBadges.authorizedDistributor', icon: Shield, color: 'text-blue-400' },
  { key: 'trustBadges.fullWarranty', icon: Award, color: 'text-emerald-400' },
  { key: 'trustBadges.fastShipping', icon: Truck, color: 'text-amber-400' },
  { key: 'trustBadges.competitivePrices', icon: Tag, color: 'text-purple-400' },
];

const TrustBadges = () => {
  const { t } = useI18n();

  return (
    <section className="py-2 px-3">
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        {badges.map(({ key, icon: Icon, color }) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-card/90 border border-border/40"
          >
            <Icon className={`h-5 w-5 shrink-0 ${color}`} strokeWidth={2.2} />
            <span className="text-xs font-bold text-foreground leading-tight">{t(key)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
