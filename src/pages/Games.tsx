import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Trophy, RotateCcw, Timer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CARD_SYMBOLS = ['🎮', '🕹️', '👾', '🏆', '💎', '⚡', '🌟', '🎯'];

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

function buildDeck(): Card[] {
  const symbols = [...CARD_SYMBOLS, ...CARD_SYMBOLS];
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }
  return symbols.map((symbol, id) => ({ id, symbol, flipped: false, matched: false }));
}

const Games = () => {
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = useCallback(() => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setWon(false);
    setLocked(false);
  }, []);

  const flip = useCallback((id: number) => {
    if (locked) return;
    if (selected.includes(id)) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.matched) return;

    if (!running) setRunning(true);

    const newSelected = [...selected, id];
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);

      const [a, b] = newSelected.map(i => newCards.find(c => c.id === i)!);
      if (a.symbol === b.symbol) {
        const matched = newCards.map(c =>
          c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
        );
        setCards(matched);
        setSelected([]);
        setLocked(false);
        if (matched.every(c => c.matched)) {
          setRunning(false);
          setWon(true);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newSelected.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [cards, selected, locked, running]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Games | Consoltech</title>
        <meta name="description" content="Play online games on Consoltech" />
      </Helmet>
      <Navigation />

      <main className="flex-1 pt-20 md:pt-28 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">Memory Match</h1>
            <p className="text-muted-foreground">Flip cards and find all matching pairs!</p>
          </div>

          {/* Stats bar */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>{moves} moves</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Timer className="h-4 w-4 text-blue-400" />
              <span>{fmt(seconds)}</span>
            </div>
            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>

          {/* Win screen */}
          {won && (
            <div className="text-center py-10 mb-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/5">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-1">You won! 🎉</h2>
              <p className="text-muted-foreground mb-4">
                Solved in <strong>{moves} moves</strong> and <strong>{fmt(seconds)}</strong>
              </p>
              <Button onClick={reset} className="btn-neon">
                <RotateCcw className="h-4 w-4" />
                Play Again
              </Button>
            </div>
          )}

          {/* Card grid */}
          {!won && (
            <div className="grid grid-cols-4 gap-3">
              {cards.map(card => (
                <button
                  key={card.id}
                  onClick={() => flip(card.id)}
                  disabled={card.matched || selected.includes(card.id)}
                  aria-label={card.flipped || card.matched ? card.symbol : 'Hidden card'}
                  className={`
                    aspect-square rounded-xl text-3xl font-bold transition-all duration-300 select-none
                    border-2 flex items-center justify-center
                    ${card.matched
                      ? 'border-green-500/50 bg-green-500/10 scale-95 cursor-default'
                      : card.flipped
                        ? 'border-primary/60 bg-primary/10 scale-105'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-muted/50 cursor-pointer hover:scale-105'
                    }
                  `}
                >
                  {card.flipped || card.matched ? card.symbol : '?'}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Games;
