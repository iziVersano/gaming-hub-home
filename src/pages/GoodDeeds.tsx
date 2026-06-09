import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Heart, Sparkles, Send, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface GoodDeed {
  id: string;
  name: string;
  deed: string;
  points: number;
  timestamp: number;
}

const STORAGE_KEY = 'goodDeeds_v1';

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

const GoodDeeds = () => {
  const [deeds, setDeeds] = useState<GoodDeed[]>([]);
  const [name, setName] = useState('');
  const [deed, setDeed] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setDeeds(loadDeeds());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deed.trim()) return;
    setSubmitting(true);

    const newDeed: GoodDeed = {
      id: Date.now().toString(),
      name: name.trim(),
      deed: deed.trim(),
      points: 1,
      timestamp: Date.now(),
    };

    const updated = [newDeed, ...deeds];
    setDeeds(updated);
    saveDeeds(updated);
    setName('');
    setDeed('');
    setSubmitting(false);

    toast({
      title: '✨ מעשה טוב נרשם!',
      description: `תודה ${newDeed.name}! קיבלת נקודת טוב אחת.`,
    });
  };

  const topUsers = Object.values(
    deeds.reduce<Record<string, { name: string; points: number }>>((acc, d) => {
      if (!acc[d.name]) acc[d.name] = { name: d.name, points: 0 };
      acc[d.name].points += d.points;
      return acc;
    }, {})
  )
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const rankColor = (i: number) =>
    i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-muted-foreground';

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Helmet>
        <title>קיר המעשים הטובים | ConsolTech</title>
        <meta name="description" content="שתף את המעשים הטובים שלך וצבר נקודות טוב" />
      </Helmet>

      <main id="main-content" className="container px-4 md:px-6 pt-20 md:pt-24 pb-16 flex-1">
        <header className="max-w-4xl mx-auto text-center mb-10">
          <div className="text-5xl mb-4" aria-hidden="true">✡️</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-section-heading">
            קיר המעשים הטובים
          </h1>
          <p className="text-muted-foreground text-lg">Wall of Good Deeds</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            שתף מעשה טוב שעשית וצבר נקודות טוב. כל רישום מזכה אותך בנקודה — בעל האתר יוכל להעניק נקודות נוספות בעתיד.
          </p>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: form + feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submit form */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-400" aria-hidden="true" />
                שתף מעשה טוב
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                <div>
                  <label htmlFor="gd-name" className="text-sm font-medium mb-1 block">
                    שמך
                  </label>
                  <input
                    id="gd-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="הכנס את שמך"
                    maxLength={50}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="gd-deed" className="text-sm font-medium mb-1 block">
                    מה המעשה הטוב שעשית?
                  </label>
                  <textarea
                    id="gd-deed"
                    value={deed}
                    onChange={e => setDeed(e.target.value)}
                    placeholder="ספר לנו מה עשית..."
                    maxLength={300}
                    rows={3}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-left mt-0.5">{deed.length}/300</p>
                </div>
                <Button
                  type="submit"
                  disabled={submitting || !name.trim() || !deed.trim()}
                  className="w-full"
                >
                  <Send className="h-4 w-4 ml-2" aria-hidden="true" />
                  שלח ✨ קבל נקודה טובה
                </Button>
              </form>
            </div>

            {/* Feed */}
            <div className="space-y-3">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                מעשים טובים ({deeds.length})
              </h2>

              {deeds.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
                  <div className="text-4xl mb-3" aria-hidden="true">✡️</div>
                  <p className="font-medium">היה הראשון לשתף מעשה טוב!</p>
                  <p className="text-sm mt-1">Be the first to share a good deed.</p>
                </div>
              ) : (
                deeds.map(d => (
                  <article key={d.id} className="rounded-xl border border-border bg-card p-4" dir="rtl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-sm">{d.name}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(d.timestamp)}</span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{d.deed}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 bg-amber-500/10 text-amber-500 rounded-full px-2.5 py-1 text-xs font-bold">
                        <Star className="h-3 w-3" fill="currentColor" aria-hidden="true" />
                        <span>{d.points}</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Right: leaderboard */}
          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-5 sticky top-24 shadow-sm">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                לוח מובילים
              </h2>

              {topUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">אין עדיין נקודות</p>
              ) : (
                <ol className="space-y-1" dir="rtl">
                  {topUsers.map((u, i) => (
                    <li key={u.name} className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">
                      <span className={`text-sm font-bold w-5 shrink-0 ${rankColor(i)}`}>{i + 1}.</span>
                      <span className="flex-1 text-sm font-medium truncate">{u.name}</span>
                      <span className="shrink-0 flex items-center gap-1 text-amber-500 font-bold text-sm">
                        <Star className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" />
                        {u.points}
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">
                נקודות טוב מוענקות על ידי בעל האתר.
                <br />
                Good points awarded by the site owner.
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
