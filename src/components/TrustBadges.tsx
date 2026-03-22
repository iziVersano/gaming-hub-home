import { Shield, Award, Truck, Tag } from 'lucide-react';
import { useI18n } from '@/hooks/I18nContext';

const badges = [
  {
    key: 'trustBadges.authorizedDistributor',
    icon: Shield,
    iconColor: 'text-emerald-400',
    glowColor: 'shadow-[0_0_12px_rgba(52,211,153,0.3)]',
    borderColor: 'border-emerald-500/30',
  },
  {
    key: 'trustBadges.fastShipping',
    icon: Truck,
    iconColor: 'text-blue-400',
    glowColor: 'shadow-[0_0_12px_rgba(96,165,250,0.3)]',
    borderColor: 'border-blue-500/30',
  },
  {
    key: 'trustBadges.fullWarranty',
    icon: Award,
    iconColor: 'text-cyan-400',
    glowColor: 'shadow-[0_0_12px_rgba(34,211,238,0.3)]',
    borderColor: 'border-cyan-500/30',
  },
  {
    key: 'trustBadges.competitivePrices',
    icon: Tag,
    iconColor: 'text-orange-400',
    glowColor: 'shadow-[0_0_12px_rgba(251,146,60,0.3)]',
    borderColor: 'border-orange-500/30',
  },
];

const TrustBadges = () => {
  const { t } = useI18n();

  return (
    <section className="py-3 px-3">
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {badges.map(({ key, icon: Icon, iconColor, glowColor, borderColor }) => (
          <div
            key={key}
            className={`flex items-center gap-3 px-3.5 py-4 rounded-xl border ${borderColor} ${glowColor} backdrop-blur-sm`}
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 60, 0.85), rgba(20, 30, 70, 0.75))',
            }}
          >
            <div className="shrink-0">
              <Icon className={`h-7 w-7 ${iconColor} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-extrabold text-white leading-tight tracking-wide">
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
