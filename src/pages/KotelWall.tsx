import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Flame, Send, Trophy, Star, Globe, X, Loader2, ScrollText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const LIT_KEY = 'kotel_lit_wishes';

interface Wish {
  id: number;
  name: string;
  city: string;
  wish: string;
  category: string;
  forWhom?: string;
  candles: number;
  points: number;
  createdAt: string;
}

interface PlaceResult {
  wish: Wish;
  pointsAwarded: number;
  isChallenge: boolean;
  streak: number;
  streakBonus: boolean;
}

const CITIES = ['ישראל', 'New York', 'Paris', 'Buenos Aires', 'London', 'Moscow'];

const CATEGORIES = [
  { label: 'שלום',  en: 'Peace',      emoji: '🕊️', color: '#60a5fa' },
  { label: 'בריאות', en: 'Health',    emoji: '💚', color: '#34d399' },
  { label: 'משפחה', en: 'Family',     emoji: '❤️', color: '#f87171' },
  { label: 'אהבה',  en: 'Love',       emoji: '💛', color: '#fbbf24' },
  { label: 'פרנסה', en: 'Livelihood', emoji: '🌟', color: '#a78bfa' },
  { label: 'קהילה', en: 'Community',  emoji: '🤝', color: '#fb923c' },
];

const DAILY_THEMES = ['שלום', 'בריאות', 'משפחה', 'אהבה', 'פרנסה', 'קהילה', 'שלום'];
const todayTheme = DAILY_THEMES[new Date().getDay()];
const todayCat = CATEGORIES.find(c => c.label === todayTheme) ?? CATEGORIES[0];

function getLitSet(): Set<number> {
  try {
    const raw = sessionStorage.getItem(LIT_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}
function addLit(id: number) {
  const s = getLitSet(); s.add(id);
  sessionStorage.setItem(LIT_KEY, JSON.stringify([...s]));
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

// Points card
function PointsCard({ name, points, streak }: { name: string; points: number; streak: number }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #1a1208 0%, #2a1f0e 50%, #1a1208 100%)',
        border: '1px solid rgba(212,175,55,0.35)',
        minHeight: 140,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-7xl opacity-[0.05] select-none pointer-events-none" aria-hidden="true">✡️</div>

      <div className="relative z-10 p-4 flex flex-col justify-between" style={{ minHeight: 140 }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: '#d4af37' }}>Universal Good</p>
            <p className="text-[9px] text-slate-500 tracking-widest">Kotel Points Card</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: streak >= 3 ? 'rgba(251,191,36,0.2)' : 'rgba(212,175,55,0.1)', color: streak >= 3 ? '#fbbf24' : '#d4af37', border: `1px solid ${streak >= 3 ? 'rgba(251,191,36,0.4)' : 'rgba(212,175,55,0.2)'}` }}>
              <Zap className="h-2.5 w-2.5" aria-hidden="true" />
              {streak} day streak{streak >= 3 ? ' +bonus' : ''}
            </div>
          )}
        </div>

        <div>
          <p className="text-white text-base font-bold truncate" dir="rtl">{name || 'שמך כאן'}</p>
          <p className="text-slate-500 text-[10px]">{name ? 'UG Member' : 'Enter your name to track points'}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-slate-500 mb-0.5">נקודות UG</p>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4" style={{ color: '#d4af37' }} fill="#d4af37" aria-hidden="true" />
              <span className="text-2xl font-black text-white">{points}</span>
            </div>
          </div>
          <div className="text-right text-[9px] text-slate-600 space-y-0.5">
            <p>📜 note placed = +1</p>
            <p>🕯️ candle received = +1</p>
            <p style={{ color: todayCat.color }}>★ challenge = +2</p>
            <p style={{ color: '#fbbf24' }}>⚡ 3-day streak = +1</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
    </div>
  );
}

// Stone note card
function NoteStone({ wish, lit, onLight }: { wish: Wish; lit: boolean; onLight: () => void }) {
  const [open, setOpen] = useState(false);
  const cat = CATEGORIES.find(c => c.label === wish.category) ?? CATEGORIES[0];
  const isToday = wish.category === todayTheme;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative cursor-pointer select-none rounded-sm overflow-hidden"
        style={{
          background: isToday
            ? 'linear-gradient(135deg, rgba(212,175,55,0.22), rgba(180,140,30,0.12))'
            : 'linear-gradient(135deg, #3d3530, #2e2520)',
          border: isToday ? '1px solid rgba(212,175,55,0.45)' : '1px solid rgba(255,255,255,0.05)',
          minHeight: 72,
          padding: '8px 10px',
        }}
        onClick={() => setOpen(true)}
      >
        {isToday && <div className="absolute top-1 right-1 text-[8px] font-bold" style={{ color: '#d4af37' }}>★</div>}
        <div className="text-base mb-1">{cat.emoji}</div>
        <p className="text-[10px] font-semibold text-white/80 truncate">{wish.name}</p>
        <p className="text-[9px] text-white/35">{wish.city}</p>
        <div className="flex items-center justify-between mt-1">
          {wish.candles > 0 && (
            <div className="flex items-center gap-0.5">
              <Flame className="h-2.5 w-2.5 text-amber-400" fill="currentColor" />
              <span className="text-[9px] text-amber-400">{wish.candles}</span>
            </div>
          )}
          {wish.points > 0 && (
            <div className="flex items-center gap-0.5 ml-auto">
              <Star className="h-2 w-2" style={{ color: '#d4af37' }} fill="#d4af37" />
              <span className="text-[8px]" style={{ color: '#d4af37' }}>{wish.points}</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-3 h-3" style={{ background: 'rgba(255,255,255,0.03)', clipPath: 'polygon(0 0,0 100%,100% 100%)' }} />
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 max-w-sm w-full rounded-2xl p-6 shadow-2xl"
              style={{ background: 'linear-gradient(135deg,#fef9e7,#fdf3cd)', border: '1px solid rgba(212,175,55,0.5)' }}
              initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
              onClick={e => e.stopPropagation()}
              dir="rtl"
            >
              <button className="absolute top-3 left-3 text-stone-400 hover:text-stone-600" onClick={() => setOpen(false)} aria-label="סגור">
                <X className="h-4 w-4" />
              </button>

              <div className="text-center mb-4">
                <div className="text-3xl mb-1">{cat.emoji}</div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cat.color + '22', color: cat.color }}>{cat.label}</span>
                {isToday && <span className="mr-2 text-[10px] font-bold text-amber-600">★ אתגר היום</span>}
              </div>

              <p className="text-stone-800 text-sm leading-relaxed text-center mb-3 font-medium" style={{ fontFamily: 'serif' }}>
                "{wish.wish}"
              </p>

              {wish.forWhom && (
                <p className="text-center text-xs text-stone-500 mb-3">עבור: <span className="font-semibold">{wish.forWhom}</span></p>
              )}

              <div className="flex items-center justify-between text-xs text-stone-400 mb-4">
                <span>{wish.name} · {wish.city}</span>
                <span>{formatDate(wish.createdAt)}</span>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4 text-xs">
                <span className="flex items-center gap-1 text-amber-600">
                  <Flame className="h-3 w-3" fill="currentColor" /> {wish.candles} נרות
                </span>
                <span className="flex items-center gap-1" style={{ color: '#d4af37' }}>
                  <Star className="h-3 w-3" fill="currentColor" /> {wish.points} נקודות
                </span>
              </div>

              <button
                onClick={() => { onLight(); setOpen(false); }}
                disabled={lit}
                className="w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={lit
                  ? { background: 'rgba(251,191,36,0.15)', color: '#d97706', cursor: 'default' }
                  : { background: 'linear-gradient(135deg,#b8860b,#d4af37)', color: '#000' }
                }
              >
                <Flame className="h-4 w-4" fill={lit ? 'currentColor' : 'none'} />
                {lit ? `🕯️ הדלקת נר` : 'הדלק נר 🕯️ (+1 נקודה לכותב)'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const rankColor = (i: number) => i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : undefined;

export default function KotelWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [litIds, setLitIds] = useState<Set<number>>(new Set());
  const [myStreak, setMyStreak] = useState(0);

  const [name, setName] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [wish, setWish] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [forWhom, setForWhom] = useState('');

  const { toast } = useToast();

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/wishes`);
      if (!res.ok) throw new Error();
      setWishes(await res.json());
      setError(null);
    } catch {
      setError('לא ניתן לטעון את הכותל כרגע.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishes();
    setLitIds(getLitSet());
  }, [fetchWishes]);

  // Fetch streak when name changes
  useEffect(() => {
    if (!name.trim()) { setMyStreak(0); return; }
    fetch(`${API_BASE}/wishes/streak?name=${encodeURIComponent(name.trim())}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setMyStreak(d.streak ?? 0))
      .catch(() => {});
  }, [name]);

  const myPoints = wishes.filter(w => w.name === name.trim()).reduce((sum, w) => sum + (w.points ?? 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wish.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), city, wish: wish.trim(), category, forWhom: forWhom.trim() || undefined }),
      });
      if (!res.ok) throw new Error();
      const result: PlaceResult = await res.json();
      setWishes(prev => [result.wish, ...prev]);
      setMyStreak(result.streak);
      setWish('');
      setForWhom('');
      setShowForm(false);

      const breakdown: string[] = [`📜 note placed +1`];
      if (result.isChallenge) breakdown.push(`★ challenge bonus +2`);
      if (result.streakBonus) breakdown.push(`⚡ streak bonus +1`);

      toast({
        title: `🕊️ +${result.pointsAwarded} נקודות!`,
        description: breakdown.join('  ·  '),
      });
    } catch {
      toast({ title: 'שגיאה', description: 'לא ניתן לשלוח כרגע.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLight = async (id: number) => {
    if (litIds.has(id)) return;
    try {
      const res = await fetch(`${API_BASE}/wishes/${id}/light`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const updated: Wish = await res.json();
      setWishes(prev => prev.map(w => w.id === id ? updated : w));
      addLit(id);
      setLitIds(getLitSet());
      toast({ title: '🕯️ נר הודלק!', description: `הכותב קיבל +1 נקודה.` });
    } catch {
      toast({ title: 'שגיאה', description: 'לא ניתן להדליק נר כרגע.', variant: 'destructive' });
    }
  };

  // Leaderboard by total points
  const leaderboard = Object.values(
    wishes.reduce<Record<string, { name: string; city: string; points: number; candles: number }>>((acc, w) => {
      if (!acc[w.name]) acc[w.name] = { name: w.name, city: w.city, points: 0, candles: 0 };
      acc[w.name].points += w.points ?? 0;
      acc[w.name].candles += w.candles;
      return acc;
    }, {})
  ).sort((a, b) => b.points - a.points).slice(0, 5);

  const totalCandles = wishes.reduce((s, w) => s + w.candles, 0);
  const totalPoints = wishes.reduce((s, w) => s + (w.points ?? 0), 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0e0b08' }}>
      <Navigation />
      <Helmet>
        <title>הכותל הדיגיטלי | ConsolTech</title>
        <meta name="description" content="הדביק פתק בכותל הדיגיטלי — שתף בקשה, צבר נקודות, הדלק נר לאחרים" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-24 pb-10 px-4 text-center overflow-hidden" aria-labelledby="kotel-heading">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg,#0a1628 0%,#1a0e05 60%,#0e0b08 100%)' }} />
        <div className="absolute top-8 right-16 w-10 h-10 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at 35% 35%,#fff9e6,#e8d88a)', boxShadow: '0 0 30px rgba(232,216,138,0.35)' }} aria-hidden="true" />
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" aria-hidden="true"
            style={{ width: 2, height: 2, background: '#fff', opacity: 0.3 + (i % 3) * 0.2, top: `${8 + (i * 17) % 40}%`, left: `${5 + (i * 23) % 90}%` }} />
        ))}

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-3" aria-hidden="true">🕊️</div>
          <h1 id="kotel-heading" className="text-3xl md:text-5xl font-black mb-2" style={{ color: '#f5e6c8', fontFamily: 'serif' }}>
            הכותל הדיגיטלי
          </h1>
          <p className="text-amber-200/60 text-base mb-1">The Digital Kotel — Jerusalem</p>
          <p className="text-amber-100/35 text-xs max-w-sm mx-auto">הדבק פתק, שתף בקשה, הדלק נר לאחרים, צבר נקודות UG</p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37' }}>
            <span>{todayCat.emoji}</span>
            <span>אתגר היום: {todayCat.label} — {todayCat.en}</span>
            <span className="text-[10px] opacity-60">+2 נקודות</span>
          </div>

          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-amber-200/45">
            <span><ScrollText className="h-3 w-3 inline mr-1" />{wishes.length} פתקים</span>
            <span><Flame className="h-3 w-3 inline mr-1" />{totalCandles} נרות</span>
            <span><Star className="h-3 w-3 inline mr-1" />{totalPoints} נקודות</span>
          </div>
        </div>
      </section>

      {/* Place note button */}
      <div className="flex justify-center pb-6 px-4">
        <Button onClick={() => setShowForm(v => !v)}
          className="rounded-full px-8 py-3 text-base font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg,#b8860b,#d4af37)', color: '#1a0e05' }}>
          {showForm ? 'סגור' : '📜 הדבק פתק בכותל'}
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-6">
            <div className="max-w-lg mx-auto rounded-2xl p-6"
              style={{ background: 'linear-gradient(135deg,#fef9e7,#fdf3cd)', border: '1px solid rgba(212,175,55,0.4)' }}>
              <h2 className="text-base font-bold text-stone-800 mb-4 text-center" style={{ fontFamily: 'serif' }}>📜 כתוב את פתקך</h2>
              <form onSubmit={handleSubmit} className="space-y-3" dir="rtl">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">שמך</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="הכנס שם" maxLength={50} required
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">עיר</label>
                    <select value={city} onChange={e => setCity(e.target.value)}
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400">
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">עבור מי? (אופציונלי)</label>
                  <input type="text" value={forWhom} onChange={e => setForWhom(e.target.value)} placeholder="עבור המשפחה שלי, עבור ישראל..." maxLength={80}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-stone-600 mb-2">נושא</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat.label} type="button" onClick={() => setCategory(cat.label)}
                        className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                        style={category === cat.label
                          ? { background: cat.color + '33', color: cat.color, border: `1px solid ${cat.color}` }
                          : { background: '#f5f5f0', color: '#78716c', border: '1px solid #e7e5e4' }
                        }>
                        {cat.emoji} {cat.label}
                        {cat.label === todayTheme && <span className="mr-1 text-amber-500">★+2</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">בקשתך / תפילתך</label>
                  <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="כתוב את בקשתך כאן..." maxLength={280} rows={3} required
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                  <p className="text-xs text-stone-400 text-left mt-0.5">{wish.length}/280</p>
                </div>

                {/* Points preview */}
                <div className="rounded-lg p-3 text-xs space-y-1" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p className="font-semibold text-stone-600 mb-1">נקודות שתקבל:</p>
                  <p className="text-stone-500">📜 הנחת פתק <span className="font-bold text-stone-700">+1</span></p>
                  {category === todayTheme && <p style={{ color: todayCat.color }}>★ אתגר היום ({todayCat.label}) <span className="font-bold">+2</span></p>}
                  {myStreak >= 2 && <p className="text-amber-600">⚡ streak יום {myStreak + 1} {myStreak + 1 >= 3 ? <span className="font-bold">+1</span> : '(עוד יום אחד לבונוס)'}</p>}
                  <p className="font-bold text-stone-700 pt-1 border-t border-stone-200">
                    סה״כ: +{1 + (category === todayTheme ? 2 : 0) + (myStreak >= 2 ? 1 : 0)} נקודות
                  </p>
                </div>

                <Button type="submit" disabled={submitting || !name.trim() || !wish.trim()}
                  className="w-full font-bold rounded-xl" style={{ background: 'linear-gradient(135deg,#b8860b,#d4af37)', color: '#1a0e05' }}>
                  {submitting ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Send className="h-4 w-4 ml-2" />}
                  הדבק את הפתק בכותל 🕊️
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-1 px-4 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Wall */}
          <div className="lg:col-span-3 space-y-4">
            {/* Points card */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500/50">הכרטיס שלי</p>
              <PointsCard name={name} points={myPoints} streak={myStreak} />
            </div>

            {/* Wall surface */}
            <div className="rounded-2xl overflow-hidden p-4" style={{ background: 'linear-gradient(180deg,#2a1f15 0%,#1e1510 100%)', border: '1px solid rgba(212,175,55,0.08)' }}>
              <p className="text-center text-[10px] text-amber-200/25 mb-3 tracking-wider">לחץ על אבן לקרוא את הפתק</p>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-amber-200/50 text-sm">{error}</p>
                  <button onClick={fetchWishes} className="mt-3 text-xs text-amber-500 underline">נסה שוב</button>
                </div>
              ) : wishes.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-4xl mb-3">📜</div>
                  <p className="text-amber-200/50 text-sm">הכותל מחכה לפתק הראשון שלך</p>
                </div>
              ) : (
                <motion.div layout className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}>
                  {wishes.map(w => (
                    <NoteStone key={w.id} wish={w} lit={litIds.has(w.id)} onLight={() => handleLight(w.id)} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Leaderboard */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.12)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: '#d4af37' }}>
                <Trophy className="h-4 w-4" />
                לוח מובילים
              </h2>
              {leaderboard.length === 0
                ? <p className="text-xs text-amber-200/30 text-center py-4">אין עדיין נקודות</p>
                : <ol className="space-y-2" dir="rtl">
                  {leaderboard.map((u, i) => (
                    <li key={u.name} className="flex items-center gap-2">
                      <span className="text-xs font-black w-4 text-center" style={{ color: rankColor(i) }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-amber-100/80 truncate">{u.name}</p>
                        <p className="text-[9px] text-amber-200/35">{u.city}</p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: '#d4af37' }}>
                          <Star className="h-2.5 w-2.5" fill="currentColor" /> {u.points}
                        </div>
                        <div className="flex items-center gap-0.5 text-[9px] text-amber-400/60">
                          <Flame className="h-2 w-2" fill="currentColor" /> {u.candles}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              }
            </div>

            {/* Today's challenge */}
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
              <div className="text-2xl mb-1">{todayCat.emoji}</div>
              <p className="text-[10px] font-bold text-amber-400 mb-0.5">אתגר היום</p>
              <p className="text-lg font-black" style={{ color: '#f5e6c8' }}>{todayCat.label}</p>
              <p className="text-[10px] text-amber-200/35">{todayCat.en}</p>
              <p className="text-[10px] text-amber-300/55 mt-2">כתוב פתק בנושא זה וקבל <span className="font-bold">+2 נקודות</span></p>
            </div>

            {/* Points legend */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.12)' }}>
              <h2 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#d4af37' }}>איך מרוויחים נקודות</h2>
              <div className="space-y-2 text-[10px] text-amber-200/55">
                <div className="flex justify-between"><span>📜 הנחת פתק</span><span className="font-bold text-amber-300">+1</span></div>
                <div className="flex justify-between"><span>🕯️ מישהו הדליק נר</span><span className="font-bold text-amber-300">+1</span></div>
                <div className="flex justify-between"><span style={{ color: todayCat.color }}>★ אתגר היום</span><span className="font-bold text-amber-300">+2</span></div>
                <div className="flex justify-between"><span className="text-yellow-400/70">⚡ streak של 3 ימים</span><span className="font-bold text-amber-300">+1</span></div>
              </div>
            </div>

            {/* Cities */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.12)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: '#d4af37' }}>
                <Globe className="h-4 w-4" /> קהילה עולמית
              </h2>
              <div className="space-y-1.5">
                {CITIES.map(c => {
                  const count = wishes.filter(w => w.city === c).length;
                  return (
                    <div key={c} className="flex items-center justify-between text-[10px]">
                      <span className="text-amber-200/50">{c}</span>
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 rounded-full bg-amber-500/25" style={{ width: Math.max(4, count * 7) }} />
                        <span className="text-amber-200/35 w-4 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
