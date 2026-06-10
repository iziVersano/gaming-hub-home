import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Heart, Sparkles, Send, Trophy, Star, Globe, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface GoodDeed {
  id: string;
  name: string;
  city: string;
  deed: string;
  category: string;
  points: number;
  timestamp: number;
}

const STORAGE_KEY = 'goodDeeds_v2';

const CITIES = ['ישראל', 'New York', 'Paris', 'Buenos Aires', 'London', 'Moscow'];

const CATEGORIES = [
  { label: 'עזרה לשכן', emoji: '🏠', en: 'Helping Neighbor' },
  { label: 'צדקה', emoji: '💛', en: 'Charity' },
  { label: 'שירות קהילתי', emoji: '🤝', en: 'Community Service' },
  { label: 'חינוך', emoji: '📚', en: 'Education' },
  { label: 'סביבה', emoji: '🌱', en: 'Environment' },
  { label: 'אחר', emoji: '✨', en: 'Other' },
];

function loadDeeds(): GoodDeed[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDeeds(deeds: GoodDeed[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deeds));
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function UGCard({ name, points, city }: { name: string; points: number; city: string }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        minHeight: 180,
      }}
      aria-label="UG card"
    >
      {/* Gold shimmer strip */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
      />

      {/* Background Star of David watermark */}
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl opacity-[0.06] select-none pointer-events-none"
        aria-hidden="true"
      >
        ✡️
      </div>

      <div className="relative z-10 p-5 flex flex-col justify-between h-full" style={{ minHeight: 180 }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Globe className="h-3.5 w-3.5" style={{ color: '#d4af37' }} aria-hidden="true" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#d4af37' }}>
                Universal Good
              </span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase">UG Community Card</span>
          </div>
          <div
            className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide"
            style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}
          >
            {city || '—'}
          </div>
        </div>

        <div>
          <p className="text-white text-lg font-bold truncate mb-0.5" dir="rtl">
            {name || 'שמך כאן'}
          </p>
          <p className="text-slate-400 text-xs">{name ? 'UG Member' : 'Enter your name to claim your card'}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">נקודות טוב</p>
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5" style={{ color: '#d4af37' }} fill="#d4af37" aria-hidden="true" />
              <span className="text-3xl font-black text-white">{points}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 mb-0.5">Good Points</p>
            <Award className="h-8 w-8 ml-auto" style={{ color: 'rgba(212,175,55,0.5)' }} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Gold bottom strip */}
      <div
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
      />
    </div>
  );
}

const rankColor = (i: number) =>
  i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : undefined;

const GoodDeeds = () => {
  const [deeds, setDeeds] = useState<GoodDeed[]>([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [deed, setDeed] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setDeeds(loadDeeds());
  }, []);

  const myPoints = deeds.filter(d => d.name === name.trim()).reduce((sum, d) => sum + d.points, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deed.trim()) return;
    setSubmitting(true);

    const newDeed: GoodDeed = {
      id: Date.now().toString(),
      name: name.trim(),
      city,
      deed: deed.trim(),
      category,
      points: 1,
      timestamp: Date.now(),
    };

    const updated = [newDeed, ...deeds];
    setDeeds(updated);
    saveDeeds(updated);
    setDeed('');
    setSubmitting(false);

    toast({
      title: '✨ נקודת UG נרשמה!',
      description: `תודה ${newDeed.name}! קיבלת נקודת טוב אחת על הכרטיס שלך.`,
    });
  };

  const topUsers = Object.values(
    deeds.reduce<Record<string, { name: string; city: string; points: number }>>((acc, d) => {
      if (!acc[d.name]) acc[d.name] = { name: d.name, city: d.city || '', points: 0 };
      acc[d.name].points += d.points;
      return acc;
    }, {})
  )
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const selectedCategory = CATEGORIES.find(c => c.label === category) ?? CATEGORIES[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Helmet>
        <title>UG – Universal Good | ConsolTech</title>
        <meta name="description" content="הפלטפורמה לגיימינג ערכי – צבר נקודות טוב על מעשים טובים" />
      </Helmet>

      {/* Hero banner */}
      <section
        className="relative pt-24 pb-16 px-4 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0d1b2a 0%, #112240 60%, transparent 100%)',
        }}
        aria-labelledby="ug-heading"
      >
        {/* Decorative glows */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="text-4xl font-black tracking-tight"
              style={{ color: '#d4af37', fontFamily: 'serif', letterSpacing: '-0.02em' }}
            >
              UG
            </div>
            <div className="w-px h-8 bg-amber-500/30" aria-hidden="true" />
            <div className="text-left">
              <div className="text-sm font-bold tracking-widest uppercase text-amber-400">Universal</div>
              <div className="text-sm font-bold tracking-widest uppercase text-amber-400">Good</div>
            </div>
          </div>

          <h1
            id="ug-heading"
            className="text-3xl md:text-5xl font-black mb-3"
            style={{ color: '#fff', textShadow: '0 0 40px rgba(212,175,55,0.3)' }}
          >
            מעשים טובים
          </h1>
          <p className="text-slate-400 text-lg mb-2">Good Deeds → Real Points on Your UG Card</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            פלטפורמת הגיימינג הערכי — שתף מעשה טוב, צבר נקודות UG, והפוך להיות חלק מקהילה עולמית
          </p>

          {/* City dots */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Globe className="h-4 w-4 text-amber-500/60" aria-hidden="true" />
            {CITIES.map(c => (
              <span key={c} className="text-xs text-slate-500 font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <main id="main-content" className="container px-4 md:px-6 pb-16 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: card + form + feed */}
          <div className="lg:col-span-2 space-y-6">

            {/* UG Card */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <Award className="h-4 w-4" aria-hidden="true" />
                הכרטיס שלי / My UG Card
              </h2>
              <UGCard name={name} points={myPoints} city={city} />
            </div>

            {/* Submit form */}
            <div
              className="rounded-2xl p-6 shadow-sm"
              style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'var(--card)' }}
            >
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-400" aria-hidden="true" />
                שתף מעשה טוב
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="gd-name" className="text-sm font-medium mb-1 block">
                      שמך
                    </label>
                    <input
                      id="gd-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="הכנס שם"
                      maxLength={50}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="gd-city" className="text-sm font-medium mb-1 block">
                      עיר / City
                    </label>
                    <select
                      id="gd-city"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      {CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category picker */}
                <div>
                  <p className="text-sm font-medium mb-2">קטגוריה</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                        style={
                          category === cat.label
                            ? { background: 'rgba(212,175,55,0.2)', color: '#d4af37', border: '1px solid #d4af37' }
                            : { background: 'transparent', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }
                        }
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="gd-deed" className="text-sm font-medium mb-1 block">
                    מה המעשה הטוב?
                  </label>
                  <textarea
                    id="gd-deed"
                    value={deed}
                    onChange={e => setDeed(e.target.value)}
                    placeholder="ספר לנו מה עשית..."
                    maxLength={300}
                    rows={3}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-left mt-0.5">{deed.length}/300</p>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !name.trim() || !deed.trim()}
                  className="w-full font-bold"
                  style={{ background: 'linear-gradient(135deg, #b8860b, #d4af37)', color: '#000' }}
                >
                  <Send className="h-4 w-4 ml-2" aria-hidden="true" />
                  שלח ✨ קבל נקודת UG
                </Button>
              </form>
            </div>

            {/* Feed */}
            <div className="space-y-3">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" aria-hidden="true" />
                מעשים טובים ({deeds.length})
              </h2>

              {deeds.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
                  <div className="text-4xl mb-3" aria-hidden="true">✡️</div>
                  <p className="font-medium">היה הראשון לשתף מעשה טוב!</p>
                  <p className="text-sm mt-1">Be the first to share a good deed.</p>
                </div>
              ) : (
                deeds.map(d => {
                  const cat = CATEGORIES.find(c => c.label === d.category);
                  return (
                    <article
                      key={d.id}
                      className="rounded-2xl border border-border bg-card p-4"
                      dir="rtl"
                      style={{ borderLeft: '3px solid rgba(212,175,55,0.3)' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-sm">{d.name}</span>
                            {d.city && (
                              <span
                                className="text-[10px] rounded-full px-2 py-0.5 font-medium"
                                style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}
                              >
                                📍 {d.city}
                              </span>
                            )}
                            {cat && (
                              <span className="text-[10px] text-muted-foreground">
                                {cat.emoji} {cat.label}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">{formatTime(d.timestamp)}</span>
                          </div>
                          <p className="text-sm text-foreground/90 leading-relaxed">{d.deed}</p>
                        </div>
                        <div
                          className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                          style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}
                        >
                          <Star className="h-3 w-3" fill="currentColor" aria-hidden="true" />
                          <span>{d.points}</span>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: leaderboard */}
          <aside className="lg:col-span-1">
            <div
              className="rounded-2xl p-5 sticky top-24 shadow-sm space-y-4"
              style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'var(--card)' }}
            >
              <h2 className="text-base font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" aria-hidden="true" />
                לוח מובילים
              </h2>

              {topUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">אין עדיין נקודות</p>
              ) : (
                <ol className="space-y-1" dir="rtl">
                  {topUsers.map((u, i) => (
                    <li
                      key={u.name}
                      className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0"
                    >
                      <span
                        className="text-sm font-black w-5 shrink-0 text-center"
                        style={{ color: rankColor(i) }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        {u.city && (
                          <p className="text-[10px] text-muted-foreground">{u.city}</p>
                        )}
                      </div>
                      <span
                        className="shrink-0 flex items-center gap-1 font-bold text-sm"
                        style={{ color: '#d4af37' }}
                      >
                        <Star className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" />
                        {u.points}
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              {/* Community stats */}
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}
              >
                <Users className="h-4 w-4 mx-auto mb-1 text-amber-500/60" aria-hidden="true" />
                <p className="text-xs font-bold text-amber-400">{deeds.length} מעשים טובים</p>
                <p className="text-[10px] text-slate-500">good deeds worldwide</p>
              </div>

              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                נקודות UG מוענקות על ידי הקהילה.
                <br />
                UG points awarded by the community.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GoodDeeds;
