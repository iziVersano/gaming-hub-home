import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <section className="hero relative h-[63vh] flex items-center justify-center overflow-hidden">
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-accent/6 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2 md:space-y-4">
          {/* Main Headline */}
          <h1 className="text-right md:text-center text-[clamp(1.25rem,5.5vw,2rem)] md:text-3xl lg:text-4xl font-extrabold leading-tight px-4 md:px-1 mb-2 md:mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3)' }}>
            {t('hero.headline1')} <span className="text-white/90">{t('hero.innovation')}</span>
          </h1>

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
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-300"
                            aria-label="Previous video"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={goToNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-300"
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

          {/* Subtitle + Description — below the carousel */}
          <div className="space-y-2 md:space-y-4">
            <p className="text-right md:text-center text-[clamp(1rem,4.5vw,1.5rem)] md:text-2xl lg:text-3xl font-bold leading-tight text-white/90 px-4 md:px-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" style={{ textShadow: '0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.2)' }}>
              {t('hero.headline2')}<br className="md:hidden" />{t('hero.toys')}
            </p>
            <div className="hidden md:flex items-center justify-center px-4 sm:px-8 py-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm max-w-2xl mx-auto w-full">
              <p className="text-lg md:text-xl lg:text-2xl text-foreground text-desc-bold">
                {t('hero.desc')}
              </p>
            </div>
          </div>


{/* Stats - desktop only (mobile has trust badges) */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
            {[
              { value: '50+', label: t('hero.countries', 'Countries Served'), color: 'text-primary' },
              { value: '1000+', label: t('hero.products', 'Products'), color: 'text-accent' },
              { value: '24/7', label: t('hero.support', 'Support'), color: 'text-primary' },
              { value: '20+', label: t('hero.years', 'Years Experience'), color: 'text-accent' },
            ].map(({ value, label, color }) => (
              <div key={value} className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg transition-all duration-300">
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
