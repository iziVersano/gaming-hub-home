import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms, applied via the --reveal-delay CSS variable */
  delay?: number;
}

/**
 * Scroll-entrance wrapper: fades/slides children in the first time they
 * enter the viewport. The animation lives in CSS (.reveal/.is-revealed in
 * index.css), so both prefers-reduced-motion and the site's accessibility
 * "reduce motion" toggle (body.reduce-motion) neutralize it automatically.
 * The hiding class is only added after mount, so no-JS rendering and
 * crawlers always see the content.
 */
const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [
    className,
    mounted ? 'reveal' : undefined,
    revealed ? 'is-revealed' : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;

  return (
    <div ref={ref} className={classes || undefined} style={style}>
      {children}
    </div>
  );
};

export default Reveal;
