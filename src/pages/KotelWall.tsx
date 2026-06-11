import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Flame, Send, Trophy, Star, Globe, X, Loader2, ScrollText } from 'lucide-react';
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
  createdAt: string;
}

const CITIES = ['ישראל', 'New York', 'Paris', 'Buenos Aires', 'London', 'Moscow'];

const CATEGORIES = [
  { label: 'שלום', en: 'Peace', emoji: '🕊️', color: '#60a5fa' },
  { label: 'בריאות', en: 'Health', emoji: '💚', color: '#34d399' },
  { label: 'משפחה', en: 'Family', emoji: '❤️', color: '#f87171' },
  { label: 'אהבה', en: 'Love', emoji: '💛', color: '#fbbf24' },
  { label: 'פרנסה', en: 'Livelihood', emoji: '🌟', color: '#a78bfa' },
  { label: 'קהילה', en: 'Community', emoji: '🤝', color: '#fb923c' },
];

const DAILY_THEMES = ['שלום', 'בריאות', 'משפחה', 'אהבה', 'פרנסה', 'קהילה', 'שלום'];

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

const todayTheme = DAILY_THEMES[new Date().getDay()];
const todayCat = CATEGORIES.find(c => c.label === todayTheme) ?? CATEGORIES[0];

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
            ? `linear-gradient(135deg, rgba(212,175,55,0.25), rgba(180,140,30,0.15))`
            : 'linear-gradient(135deg, #3d3530, #2e2520)',
          border: isToday ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.06)',
          minHeight: 72,
          padding: '10px 12px',
        }}
        onClick={() => setOpen(true)}
        title="לחץ לקרוא"
      >
        {isToday && (
          <div className="absolute top-1 right-1 text-[8px] font-bold px-1 rounded" style={{ background: 'rgba(212,175,55,0.3)', color: '#d4af37' }}>★</div>
        )}
        <div className="text-lg mb-1">{cat.emoji}</div>
        <p className="text-[11px] font-semibold text-white/80 truncate">{wish.name}</p>
        <p className="text-[10px] text-white/40">{wish.city}</p>
        {wish.candles > 0 && (
          <div className="flex items-center gap-0.5 mt-1">
            <Flame className="h-2.5 w-2.5 text-amber-400" fill="currentColor" />
            <span className="text-[9px] text-amber-400">{wish.candles}</span>
          </div>
        )}
        {/* folded paper corner */}
        <div className="absolute bottom-0 left-0 w-4 h-4" style={{ background: 'rgba(255,255,255,0.04)', clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 max-w-sm w-full rounded-2xl p-6 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #fef9e7 0%, #fdf3cd 100%)',
                border: '1px solid rgba(212,175,55,0.5)',
              }}
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={e => e.stopPropagation()}
              dir="rtl"
            >
              <button className="absolute top-3 left-3 text-stone-400 hover:text-stone-600" onClick={() => setOpen(false)} aria-label="סגור">
                <X className="h-4 w-4" />
              </button>

              <div className="text-center mb-4">
                <div className="text-3xl mb-1">{cat.emoji}</div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cat.color + '22', color: cat.color }}>
                  {cat.label}
                </span>
                {isToday && <span className="mr-2 text-[10px] font-bold text-amber-600">★ אתגר היום</span>}
              </div>

              <p className="text-stone-800 text-sm leading-relaxed text-center mb-4 font-medium" style={{ fontFamily: 'serif' }}>
                "{wish.wish}"
              </p>

              {wish.forWhom && (
                <p className="text-center text-xs text-stone-500 mb-3">עבור: <span className="font-semibold">{wish.forWhom}</span></p>
              )}

              <div className="flex items-center justify-between text-xs text-stone-400 mb-4">
                <span>{wish.name} · {wish.city}</span>
                <span>{formatDate(wish.createdAt)}</span>
              </div>

              <button
                onClick={() => { onLight(); setOpen(false); }}
                disabled={lit}
                className="w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={lit
                  ? { background: 'rgba(251,191,36,0.15)', color: '#d97706', cursor: 'default' }
                  : { background: 'linear-gradient(135deg, #b8860b, #d4af37)', color: '#000' }
                }
              >
                <Flame className="h-4 w-4" fill={lit ? 'currentColor' : 'none'} />
                {lit ? `🕯️ הדלקת נר (${wish.candles})` : 'הדלק נר 🕯️'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function KotelWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [litIds, setLitIds] = useState<Set<number>>(new Set());

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
      const created: Wish = await res.json();
      setWishes(prev => [created, ...prev]);
      setWish('');
      setForWhom('');
      setShowForm(false);
      toast({ title: '🕊️ הפתק נמסר לכותל!', description: 'בקשתך נקלטה.' });
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
    } catch {
      toast({ title: 'שגיאה', description: 'לא ניתן להדליק נר כרגע.', variant: 'destructive' });
    }
  };

  const topLit = [...wishes].sort((a, b) => b.candles - a.candles).slice(0, 5);
  const totalCandles = wishes.reduce((s, w) => s + w.candles, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0e0b08' }}>
      <Navigation />
      <Helmet>
        <title>הכותל הדיגיטלי | ConsolTech</title>
        <meta name="description" content="הדביק פתק בכותל הדיגיטלי — שתף בקשה והדלק נר לאחרים" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-24 pb-10 px-4 text-center overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #1a0e05 60%, #0e0b08 100%)' }} />
        {/* Moon */}
        <div className="absolute top-8 right-16 w-10 h-10 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at 35% 35%, #fff9e6, #e8d88a)', boxShadow: '0 0 30px rgba(232,216,138,0.4)' }} aria-hidden="true" />
        {/* Stars */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" aria-hidden="true"
            style={{ width: 2, height: 2, background: '#fff', opacity: 0.4 + (i % 3) * 0.2,
              top: `${8 + (i * 17) % 40}%`, left: `${5 + (i * 23) % 90}%` }} />
        ))}

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-3" aria-hidden="true">🕊️</div>
          <h1 className="text-3xl md:text-5xl font-black mb-2" style={{ color: '#f5e6c8', textShadow: '0 0 60px rgba(212,175,55,0.4)', fontFamily: 'serif' }}>
            הכותל הדיגיטלי
          </h1>
          <p className="text-amber-200/60 text-base mb-1">The Digital Kotel — Jerusalem</p>
          <p className="text-amber-100/40 text-xs max-w-sm mx-auto">
            הדבק פתק בכותל, שתף בקשה, הדלק נר לאחרים
          </p>

          {/* Daily challenge badge */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37' }}>
            <span>{todayCat.emoji}</span>
            <span>אתגר היום: {todayCat.label} — {todayCat.en}</span>
            <span className="text-[10px] opacity-60">+נקודה בונוס</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-amber-200/50">
            <span><ScrollText className="h-3 w-3 inline mr-1" />{wishes.length} פתקים</span>
            <span><Flame className="h-3 w-3 inline mr-1" />{totalCandles} נרות</span>
            <span><Globe className="h-3 w-3 inline mr-1" />6 ערים</span>
          </div>
        </div>
      </section>

      {/* Place note button */}
      <div className="flex justify-center pb-6 px-4">
        <Button
          onClick={() => setShowForm(v => !v)}
          className="rounded-full px-8 py-3 text-base font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #b8860b, #d4af37)', color: '#1a0e05' }}
        >
          {showForm ? 'סגור' : '📜 הדבק פתק בכותל'}
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4 pb-6"
          >
            <div className="max-w-lg mx-auto rounded-2xl p-6"
              style={{ background: 'linear-gradient(135deg, #fef9e7, #fdf3cd)', border: '1px solid rgba(212,175,55,0.4)' }}>
              <h2 className="text-base font-bold text-stone-800 mb-4 text-center" style={{ fontFamily: 'serif' }}>
                📜 כתוב את פתקך
              </h2>
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
                        {cat.label === todayTheme && <span className="mr-1 text-amber-500">★</span>}
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

                <Button type="submit" disabled={submitting || !name.trim() || !wish.trim()}
                  className="w-full font-bold rounded-xl" style={{ background: 'linear-gradient(135deg, #b8860b, #d4af37)', color: '#1a0e05' }}>
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
          <div className="lg:col-span-3">
            {/* Wall surface */}
            <div className="rounded-2xl overflow-hidden p-4" style={{ background: 'linear-gradient(180deg, #2a1f15 0%, #1e1510 100%)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <p className="text-center text-xs text-amber-200/30 mb-3 font-medium tracking-wider">לחץ על אבן לקרוא את הפתק</p>

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
                <motion.div
                  layout
                  className="grid gap-1.5"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}
                >
                  {wishes.map(w => (
                    <NoteStone key={w.id} wish={w} lit={litIds.has(w.id)} onLight={() => handleLight(w.id)} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Most lit */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.15)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: '#d4af37' }}>
                <Trophy className="h-4 w-4" />
                הנרות הרבים ביותר
              </h2>
              {topLit.length === 0
                ? <p className="text-xs text-amber-200/30 text-center py-4">אין עדיין נרות</p>
                : <ol className="space-y-2" dir="rtl">
                  {topLit.map((w, i) => {
                    const cat = CATEGORIES.find(c => c.label === w.category) ?? CATEGORIES[0];
                    return (
                      <li key={w.id} className="flex items-center gap-2">
                        <span className="text-xs font-black w-4 text-amber-500/60">{i + 1}</span>
                        <span className="text-sm">{cat.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-amber-100/80 truncate">{w.name}</p>
                          <p className="text-[10px] text-amber-200/40">{w.city}</p>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
                          <Flame className="h-3 w-3" fill="currentColor" />
                          {w.candles}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              }
            </div>

            {/* Today's challenge */}
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="text-2xl mb-1">{todayCat.emoji}</div>
              <p className="text-xs font-bold text-amber-400 mb-0.5">אתגר היום</p>
              <p className="text-lg font-black" style={{ color: '#f5e6c8' }}>{todayCat.label}</p>
              <p className="text-[10px] text-amber-200/40">{todayCat.en}</p>
              <p className="text-[10px] text-amber-300/60 mt-2">פתקים בנושא זה מקבלים ★ בונוס</p>
            </div>

            {/* Cities */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.15)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: '#d4af37' }}>
                <Globe className="h-4 w-4" />
                הקהילה העולמית
              </h2>
              <div className="space-y-1">
                {CITIES.map(c => {
                  const count = wishes.filter(w => w.city === c).length;
                  return (
                    <div key={c} className="flex items-center justify-between text-xs">
                      <span className="text-amber-200/60">{c}</span>
                      <div className="flex items-center gap-1">
                        <div className="h-1 rounded-full bg-amber-500/30" style={{ width: Math.max(4, count * 6) }} />
                        <span className="text-amber-200/40 w-4 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-3 text-center" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.1)' }}>
                <Star className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                <p className="text-lg font-black text-white">{wishes.length}</p>
                <p className="text-[10px] text-amber-200/40">פתקים</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.1)' }}>
                <Flame className="h-4 w-4 mx-auto mb-1 text-amber-400" fill="currentColor" />
                <p className="text-lg font-black text-white">{totalCandles}</p>
                <p className="text-[10px] text-amber-200/40">נרות</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
