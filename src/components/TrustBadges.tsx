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
    <section className="py-4 px-4">
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {badges.map(({ key, icon: Icon, color }) => (
          <div
            key={key}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50"
          >
            <Icon className={`h-6 w-6 shrink-0 ${color}`} strokeWidth={2.2} />
            <span className="text-sm font-bold text-foreground leading-tight">{t(key)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
