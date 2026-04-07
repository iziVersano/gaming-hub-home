import { BadgeCheck, Shield, Tag, Clock } from 'lucide-react';
import { useI18n } from '@/hooks/I18nContext';

const badges = [
  {
    key: 'trustBadges.fastShipping',
    icon: Clock,
    iconColor: 'text-cyan-400',
    glowColor: 'shadow-[0_0_12px_rgba(34,211,238,0.3)]',
    borderColor: 'border-cyan-500/30',
  },
  {
    key: 'trustBadges.authorizedDistributor',
    icon: BadgeCheck,
    iconColor: 'text-emerald-400',
    glowColor: 'shadow-[0_0_12px_rgba(52,211,153,0.3)]',
    borderColor: 'border-emerald-500/30',
  },
  {
    key: 'trustBadges.competitivePrices',
    icon: Tag,
    iconColor: 'text-orange-400',
    glowColor: 'shadow-[0_0_12px_rgba(251,146,60,0.3)]',
    borderColor: 'border-orange-500/30',
  },
  {
    key: 'trustBadges.fullWarranty',
    icon: Shield,
    iconColor: 'text-cyan-400',
    glowColor: 'shadow-[0_0_12px_rgba(34,211,238,0.3)]',
    borderColor: 'border-cyan-500/30',
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
              <Icon className={`h-9 w-9 ${iconColor} drop-shadow-[0_0_12px_currentColor]`} strokeWidth={0} fill="currentColor" />
            </div>
            <span className="text-[17px] font-bold text-white leading-tight uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.06em', textShadow: '0 0 10px rgba(255,255,255,0.15)' }}>
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
