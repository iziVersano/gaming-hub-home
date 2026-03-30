import { Shield, Award, Truck, Tag } from 'lucide-react';
import { useI18n } from '@/hooks/I18nContext';

const badges = [
  {
    key: 'trustBadges.fastShipping',
    icon: Truck,
    accent: 'rgba(96,165,250,1)',
    accentMid: 'rgba(59,130,246,0.6)',
    glow: '0 0 18px rgba(96,165,250,0.55), 0 0 40px rgba(59,130,246,0.25)',
    border: 'rgba(96,165,250,0.35)',
    bg: 'linear-gradient(135deg, rgba(5,10,40,0.97) 0%, rgba(10,20,70,0.92) 50%, rgba(5,8,35,0.97) 100%)',
    scanline: 'rgba(96,165,250,0.06)',
  },
  {
    key: 'trustBadges.authorizedDistributor',
    icon: Shield,
    accent: 'rgba(52,211,153,1)',
    accentMid: 'rgba(16,185,129,0.6)',
    glow: '0 0 18px rgba(52,211,153,0.55), 0 0 40px rgba(16,185,129,0.25)',
    border: 'rgba(52,211,153,0.35)',
    bg: 'linear-gradient(135deg, rgba(3,12,18,0.97) 0%, rgba(5,30,22,0.92) 50%, rgba(3,10,15,0.97) 100%)',
    scanline: 'rgba(52,211,153,0.06)',
  },
  {
    key: 'trustBadges.competitivePrices',
    icon: Tag,
    accent: 'rgba(251,146,60,1)',
    accentMid: 'rgba(249,115,22,0.6)',
    glow: '0 0 18px rgba(251,146,60,0.55), 0 0 40px rgba(249,115,22,0.25)',
    border: 'rgba(251,146,60,0.35)',
    bg: 'linear-gradient(135deg, rgba(20,8,3,0.97) 0%, rgba(40,18,5,0.92) 50%, rgba(18,6,2,0.97) 100%)',
    scanline: 'rgba(251,146,60,0.06)',
  },
  {
    key: 'trustBadges.fullWarranty',
    icon: Award,
    accent: 'rgba(192,132,252,1)',
    accentMid: 'rgba(168,85,247,0.6)',
    glow: '0 0 18px rgba(192,132,252,0.55), 0 0 40px rgba(168,85,247,0.25)',
    border: 'rgba(192,132,252,0.35)',
    bg: 'linear-gradient(135deg, rgba(10,4,25,0.97) 0%, rgba(25,8,55,0.92) 50%, rgba(8,3,20,0.97) 100%)',
    scanline: 'rgba(192,132,252,0.06)',
  },
];

const TrustBadges = () => {
  const { t } = useI18n();

  return (
    <section className="py-3 px-3">
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {badges.map(({ key, icon: Icon, accent, accentMid, glow, border, bg, scanline }) => (
          <div
            key={key}
            className="relative flex items-center gap-3 px-3.5 py-4 rounded-xl overflow-hidden"
            style={{ background: bg, border: `1px solid ${border}`, boxShadow: glow }}
          >
            {/* Sci-fi corner accents */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: accent }} />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: accent }} />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: accent }} />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: accent }} />

            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `repeating-linear-gradient(0deg, ${scanline} 0px, ${scanline} 1px, transparent 1px, transparent 4px)`,
            }} />

            {/* Ambient glow blob top-right */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none" style={{
              background: `radial-gradient(circle, ${accentMid} 0%, transparent 70%)`,
              filter: 'blur(8px)',
            }} />

            {/* Icon */}
            <div className="shrink-0 relative z-10">
              <Icon className="h-9 w-9" strokeWidth={1.5}
                style={{ color: accent, filter: `drop-shadow(0 0 8px ${accent}) drop-shadow(0 0 20px ${accentMid})` }}
              />
            </div>

            {/* Text */}
            <span className="font-orbitron text-[13px] font-bold leading-tight relative z-10"
              style={{ color: accent, textShadow: `0 0 10px ${accent}, 0 0 25px ${accentMid}`, letterSpacing: '0.04em' }}
            >
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
