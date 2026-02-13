import { Button } from '@/components/ui/button';
import { Grid3X3, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import heroImage from '@/assets/hero-tech.jpg';
import NewArrivalsSpotlight from '@/components/NewArrivalsSpotlight';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { useI18n } from '@/hooks/I18nContext';

const HERO_VIDEOS = [
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
    <section className="relative min-h-[85vh] flex items-center justify-center pt-[10rem] pb-4 md:pt-24 md:pb-16 overflow-hidden">
      {/* Background Image with Professional Treatment */}
      <div className="absolute inset-0 z-0">
        {/* Loading placeholder */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 transition-opacity duration-700 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Hero Background Image */}
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Professional overlay - subtle gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/90" />
        
        {/* Accent color tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {/* Soft ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-accent/6 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 md:space-y-8">
          {/* Hero Visual - Video mode / Spotlight / Promotional Image */}
          <div className="relative mb-6 md:mb-10">
            {isFeatureEnabled('HERO_VIDEO_MODE') ? (
              /* Video Carousel Mode */
              <div className="flex justify-center">
                <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl relative group">
                  {!videoFailed ? (
                    <div className="relative aspect-video">
                      {/* Shimmer placeholder */}
                      <div className="absolute inset-0 shimmer-card rounded-2xl z-0" />

                      {/* Stacked videos with crossfade */}
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
                          poster="/images/41931538-f28c-4223-89e9-23b458ec78db.png"
                          onError={() => setVideoFailed(true)}
                          onEnded={() => handleVideoEnded(index)}
                        >
                          <source src={video.src} type="video/mp4" />
                        </video>
                      ))}

                      {/* Navigation arrows */}
                      {HERO_VIDEOS.length > 1 && (
                        <>
                          <button
                            onClick={goToPrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                            aria-label="Previous video"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={goToNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
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
                    /* Animated fallback when no video file exists */
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src="/images/41931538-f28c-4223-89e9-23b458ec78db.png"
                        alt="Consoltech products showcase"
                        className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <span className="inline-block px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white/80 text-sm">
                          Video mode active — drop hero videos in /videos
                        </span>
                      </div>
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
                  className="w-full max-w-4xl mx-auto h-auto rounded-2xl shadow-xl"
                />
              </div>
            )}
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-center">
              <span className="block text-4xl md:text-5xl lg:text-6xl text-hero-bold text-outline leading-tight text-foreground">
                {t('hero.headline1')} <span className="text-primary">{t('hero.innovation')}</span>
              </span>
              <span className="block text-2xl md:text-3xl lg:text-4xl text-sub-bold leading-snug text-foreground/90 mt-4">
                {t('hero.headline2')} {t('hero.toys')}
              </span>
            </h1>

            <div className="flex items-center justify-center px-8 py-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm max-w-2xl mx-auto w-full">
              <p className="text-lg md:text-xl lg:text-2xl text-foreground text-desc-bold">
                {t('hero.desc')}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 justify-center items-center pt-8">
            <Link to="/products">
              <Button size={null} className="btn-hero-square group">
                <Grid3X3 className="h-5 w-5 md:h-7 md:w-7 lg:h-8 lg:w-8" />
                <span className="text-xl md:text-2xl lg:text-3xl font-semibold">{t('hero.explore', 'Explore Products')}</span>
              </Button>
            </Link>

            <Link to="/contact">
              <Button size={null} className="btn-neon-square group">
                <Send className="h-5 w-5 md:h-7 md:w-7 lg:h-8 lg:w-8 transition-transform group-hover:translate-x-1" />
                <span className="text-xl md:text-2xl lg:text-3xl font-semibold">{t('hero.contact', 'Contact Us')}</span>
              </Button>
            </Link>
          </div>

          {/* Stats - Cleaner presentation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl text-bold-heading text-primary">50+</div>
              <div className="text-sm text-desc-bold text-muted-foreground mt-1">{t('hero.countries', 'Countries Served')}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl text-bold-heading text-accent">1000+</div>
              <div className="text-sm text-desc-bold text-muted-foreground mt-1">{t('hero.products', 'Products')}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl text-bold-heading text-primary">24/7</div>
              <div className="text-sm text-desc-bold text-muted-foreground mt-1">{t('hero.support', 'Support')}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl text-bold-heading text-accent">15+</div>
              <div className="text-sm text-desc-bold text-muted-foreground mt-1">{t('hero.years', 'Years Experience')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
