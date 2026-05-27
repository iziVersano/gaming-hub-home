import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/ThemeContext';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  variant?: 'default' | 'mobile';
  className?: string;
}

const ThemeToggle = ({ variant = 'default', className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-3 py-3.5 text-lg font-semibold tracking-wide transition-colors duration-200 border-b border-white/5 text-white hover:text-accent ${className}`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Sun className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        )}
        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-all duration-300 hover:bg-white/10 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 text-white transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 text-white transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
      </div>
    </Button>
  );
};

export default ThemeToggle;