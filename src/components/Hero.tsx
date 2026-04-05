import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import heroImage from '@/assets/hero-tech.jpg';
import NewArrivalsSpotlight from '@/components/NewArrivalsSpotlight';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { useI18n } from '@/hooks/I18nContext';

const HERO_VIDEOS = [
  { src: '/videos/final.mp4', label: 'Consoltech Showcase' },
  { src: '/videos/hero-cubism.mp4', label: 'Cubism VR' },
  { src: '/videos/hero-gls.mp4', label: 'Gaming Luxury Screens' },
];

const Hero = () => {
  const { t } = useI18n();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout>>();

  const goToVideo = useCallback((index: number) => {
    if (index === currentVideoIndex || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentVideoIndex(index);
    // Reset and play the new video
    const newVideo = videoRefs.current[index];
    if (newVideo) {
      newVideo.currentTime = 0;
      newVideo.play().catch(() => {});
    }
    // Clear transition lock after crossfade completes
    transitionTimeout.current = setTimeout(() => {
      setIsTransitioning(false);
      // Pause the old videos
      videoRefs.current.forEach((v, i) => {
        if (i !== index && v) v.pause();
      });
    }, 700);
  }, [currentVideoIndex, isTransitioning]);

  const goToNext = useCallback(() => {
    goToVideo((currentVideoIndex + 1) % HERO_VIDEOS.length);
  }, [currentVideoIndex, goToVideo]);

  const goToPrev = useCallback(() => {
    goToVideo((currentVideoIndex - 1 + HERO_VIDEOS.length) % HERO_VIDEOS.length);
  }, [currentVideoIndex, goToVideo]);

  // When current video ends, advance to next
  const handleVideoEnded = useCallback((index: number) => {
    if (index === currentVideoIndex) {
      goToNext();
    }
  }, [currentVideoIndex, goToNext]);

  useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = heroImage;
  }, []);

  return (
    <section className="hero relative flex items-start justify-center overflow-hidden" style={{ height: "calc(63vh + 52px)", marginTop: "-52px", paddingTop: "52px" }}>
      {/* Layer 1: Atmospheric background — desktop only (mobile uses parent wrapper bg) */}
      <div className="absolute inset-0 z-0 hidden md:block">
        {/* Loading placeholder */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 transition-opacity duration-700 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Atmospheric glow background — LCP element, focused on futuristic atmosphere (not console area) */}
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectPosition: 'center 85%' }}
        />
      </div>

      {/* Layer 2: Subtle decorative ambient glow — desktop only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1] hidden md:block">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-accent/6 rounded-full" />
      </div>

      <div className="relative z-[1] w-full px-4 pt-[58px] md:pt-0 md:max-w-7xl md:mx-auto md:px-8 text-right" dir="rtl">
        <div className="space-y-2 items-end w-full">

          {/* Logo — mobile only */}
          <div className="flex md:hidden items-center gap-2 mb-1 justify-end w-full" style={{ direction: 'ltr' }}>
            <Gamepad2 className="h-[5rem] w-[5rem] shrink-0" style={{ color: "hsl(195 100% 88%)", filter: "drop-shadow(0 0 6px hsl(195 100% 70%)) drop-shadow(0 0 16px hsl(195 100% 55%)) drop-shadow(0 0 30px hsl(195 100% 45%))" }} />
            <div className="flex flex-col items-end justify-center">
              <span className="logo-text text-[clamp(2.8rem,12vw,4rem)] tracking-wider leading-[1.0] whitespace-nowrap">
                <span className="logo-consol">קונסול</span><span className="logo-tech">טק</span>
              </span>
              {/* אתר היבואן — whitespace-nowrap + smaller clamp so it never breaks on any phone */}
              <span className="font-display text-[clamp(1.5rem,7.5vw,2.4rem)] font-bold leading-tight whitespace-nowrap" style={{ color: "hsl(195 100% 85%)", textShadow: "0 0 8px hsl(195 100% 75%), 0 0 20px hsl(195 100% 60%), 0 0 40px hsl(195 100% 50%)" }}>
                אתר היבואן
              </span>
            </div>
          </div>

          {/* Main Headline — dark backdrop for readability over busy hero bg */}
          <div className="inline-block rounded-2xl px-3 py-2 mb-0 bg-black/45 backdrop-blur-[2px]">
            <div className="space-y-0 md:space-y-1">
            <p className="font-display text-[clamp(1.35rem,6.5vw,2rem)] font-bold leading-snug text-white text-right w-full" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)' }}>
              קונסולות משחקי טלוויזיה ומולטימדיה
            </p>
            <p className="font-display text-[clamp(1.35rem,6.5vw,2rem)] font-bold leading-snug text-white text-right w-full" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)' }}>
              מחשבים & אבזרי גיימינג
            </p>
            <p className="font-display text-[clamp(0.95rem,4.5vw,1.3rem)] font-medium leading-snug text-white/90 text-right w-full" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)' }}>
              מוצרי חשמל מתקדמים -אבזרי גיימינג ואלקטרוניקה
            </p>
          </div>
          </div>

          {/* Hero Visual - Video mode / Spotlight / Promotional Image — desktop only (mobile shows video below trust badges) */}
          <div className="relative mb-2 md:mb-6 hidden md:block">
            {isFeatureEnabled('HERO_VIDEO_MODE') ? (
              /* Video Carousel Mode */
              <div className="flex justify-center">
                <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl relative group">
                  {!videoFailed ? (
                    <div className="relative aspect-video">
                      {/* Shimmer placeholder */}
                      <div className="absolute inset-0 shimmer-card rounded-2xl z-0" />

                      {/* Stacked videos with crossfade — only inject <source> for the active
                          video so the browser never fetches inactive video files */}
                      {HERO_VIDEOS.map((video, index) => (
                        <video
                          key={video.src}
                          ref={(el) => { videoRefs.current[index] = el; }}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                            index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                          }`}
                          autoPlay={index === 0}
                          muted
                          playsInline
                          preload={index === 0 ? "auto" : "none"}
                          poster="/images/41931538-f28c-4223-89e9-23b458ec78db.png"
                          onError={() => setVideoFailed(true)}
                          onEnded={() => handleVideoEnded(index)}
                        >
                          {index === currentVideoIndex && (
                            <source src={video.src} type="video/mp4" />
                          )}
                        </video>
                      ))}

                      {/* Navigation arrows */}
                      {HERO_VIDEOS.length > 1 && (
                        <>
                          <button
                            onClick={goToPrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-300"
                            aria-label="Previous video"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={goToNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-300"
                            aria-label="Next video"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Dots indicator */}
                      {HERO_VIDEOS.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
                          {HERO_VIDEOS.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => goToVideo(index)}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentVideoIndex
                                  ? 'bg-white w-8'
                                  : 'bg-white/40 hover:bg-white/60 w-2'
                              }`}
                              aria-label={`Go to video ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Subtle bottom gradient for dots readability */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-[15] pointer-events-none" />
                    </div>
                  ) : (
                    /* Animated fallback when video fails to load */
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src="/images/41931538-f28c-4223-89e9-23b458ec78db.png"
                        alt="Consoltech products showcase"
                        className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                    </div>
                  )}
                </div>
              </div>
            ) : isFeatureEnabled('HERO_NEW_ARRIVALS_SPOTLIGHT') ? (
              /* New Arrivals Spotlight */
              <div className="flex justify-center">
                <NewArrivalsSpotlight />
              </div>
            ) : (
              /* CONSOLTECH Promotional Image */
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-2xl" />
                <img
                  src="/images/41931538-f28c-4223-89e9-23b458ec78db.png"
                  alt="Gaming consoles, electronics, drones, smart TV and tech products showcase"
                  loading="lazy"
                  className="w-full max-w-4xl mx-auto h-auto rounded-2xl shadow-xl"
                />
              </div>
            )}
          </div>




{/* Stats - desktop only (mobile has trust badges) */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
            {[
              { value: '50+', label: t('hero.countries', 'Countries Served'), color: 'text-primary' },
              { value: '1000+', label: t('hero.products', 'Products'), color: 'text-accent' },
              { value: '24/7', label: t('hero.support', 'Support'), color: 'text-primary' },
              { value: '20+', label: t('hero.years', 'Years Experience'), color: 'text-accent' },
            ].map(({ value, label, color }) => (
              <div key={value} className="text-center p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg transition-all duration-300">
                <div className={`text-3xl md:text-4xl text-bold-heading ${color}`}>{value}</div>
                <div className="text-sm text-desc-bold text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none z-20"
        style={{
          height: '60px',
          background: 'linear-gradient(to bottom, rgba(10,10,30,0) 0%, rgba(10,10,30,0.2) 60%, rgba(10,10,30,0.4) 100%)',
        }}
      />

      {/* Subtle scroll indicator — desktop only */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:block">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
