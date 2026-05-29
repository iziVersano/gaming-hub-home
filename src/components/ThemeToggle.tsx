import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-16 h-8 rounded-full bg-muted/20 animate-pulse shrink-0" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border border-border/40 bg-muted/40 hover:bg-muted/60 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 flex items-center justify-between px-1.5 text-muted-foreground/60 select-none pointer-events-none">
        <Sun className="h-4 w-4 text-amber-500/70" />
        <Moon className="h-4 w-4 text-blue-400/70" />
      </div>
      <span
        className={`pointer-events-none flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform duration-300 ${
          isDark ? 'translate-x-9' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-blue-400 fill-blue-400/20" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
        )}
      </span>
    </button>
  );
};
