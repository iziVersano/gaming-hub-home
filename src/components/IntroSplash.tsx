import { useCallback, useEffect, useRef, useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useI18n } from '@/hooks/I18nContext';

/**
 * Full-screen intro shown once per session on the homepage: Western Wall
 * footage with the Consoltech logo animating in, then fades out to reveal
 * the page. Drop the footage at public/videos/western-wall.mp4 — until the
 * file exists (or if it fails to load) an ambient branded backdrop is shown
 * behind the same logo animation, so the intro degrades gracefully.
 */
const INTRO_VIDEO_SRC = '/videos/western-wall.mp4';
const SESSION_KEY = 'consoltech-intro-shown';
const FALLBACK_DURATION_MS = 3200;
const VIDEO_MAX_DURATION_MS = 7000;
const FADE_OUT_MS = 700;

const shouldSkipIntro = () => {
  if (typeof window === 'undefined') return true;
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return true;
  } catch {
    // sessionStorage unavailable (e.g. blocked) — show the intro once per load
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (document.body.classList.contains('reduce-motion')) return true;
  return false;
};

const gamepadGlow = {
  color: 'hsl(195 100% 88%)',
  filter:
    'drop-shadow(0 0 6px hsl(195 100% 70%)) drop-shadow(0 0 16px hsl(195 100% 55%)) drop-shadow(0 0 30px hsl(195 100% 45%))',
};

const IntroSplash = () => {
  const { t } = useI18n();
  const [visible, setVisible] = useState(() => !shouldSkipIntro());
  const [closing, setClosing] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const closingRef = useRef(false);
  const removeTimer = useRef<ReturnType<typeof setTimeout>>();
  const autoTimer = useRef<ReturnType<typeof setTimeout>>();

  const dismiss = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // ignore
    }
    setClosing(true);
    removeTimer.current = setTimeout(() => setVisible(false), FADE_OUT_MS);
  }, []);

  // Auto-dismiss: when the video ends it dismisses via onEnded; this timer is
  // the upper bound (and the only timer in fallback mode).
  useEffect(() => {
    if (!visible) return;
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(
      dismiss,
      videoFailed ? FALLBACK_DURATION_MS : VIDEO_MAX_DURATION_MS
    );
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [visible, videoFailed, dismiss]);

  // Escape key skips; lock page scroll while the intro is up
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') dismiss();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible, dismiss]);

  useEffect(() => {
    return () => {
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`intro-splash ${closing ? 'intro-splash--closing' : ''}`}
      onClick={dismiss}
      role="presentation"
    >
      <div className="intro-splash__fallback" aria-hidden="true" />
      {!videoFailed && (
        <video
          className="intro-splash__media"
          src={INTRO_VIDEO_SRC}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
          onEnded={dismiss}
        />
      )}
      <div className="intro-splash__scrim" aria-hidden="true" />

      <div className="intro-splash__logo" dir="rtl">
        <div
          className="flex items-center justify-center gap-3"
          style={{ direction: 'ltr' }}
        >
          <Gamepad2
            aria-hidden="true"
            style={{ width: 'min(3.5rem, 12vw)', height: 'min(3.5rem, 12vw)', flexShrink: 0, ...gamepadGlow }}
          />
          <span
            className="logo-text whitespace-nowrap"
            style={{ direction: 'rtl', fontSize: 'clamp(2.5rem, 11vw, 4.5rem)', lineHeight: 1, letterSpacing: '0.04em' }}
          >
            <span className="logo-consol">קונסול</span>
            <span className="logo-tech">טק</span>
          </span>
          <Gamepad2
            aria-hidden="true"
            style={{ width: 'min(3.5rem, 12vw)', height: 'min(3.5rem, 12vw)', flexShrink: 0, ...gamepadGlow }}
          />
        </div>
        <div className="intro-splash__tagline mt-4 space-y-1">
          <p
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
              color: 'hsl(195 100% 85%)',
              textShadow: '0 0 8px hsl(195 100% 75%), 0 0 20px hsl(195 100% 60%)',
            }}
          >
            אתר היבואן
          </p>
          <p
            className="font-display font-semibold"
            style={{
              fontSize: 'clamp(0.95rem, 4vw, 1.25rem)',
              color: 'hsl(195 100% 80%)',
              textShadow: '0 0 8px hsl(195 100% 65%)',
            }}
          >
            משנת 2001 יבוא ושיווק
          </p>
        </div>
      </div>

      <button
        type="button"
        className="intro-splash__skip"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
      >
        {t('intro.skip', 'Skip')}
      </button>
    </div>
  );
};

export default IntroSplash;
