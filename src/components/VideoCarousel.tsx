import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_VIDEOS = [
  { src: '/videos/final.mp4', label: 'Consoltech Showcase' },
  { src: '/videos/hero-cubism.mp4', label: 'Cubism VR' },
  { src: '/videos/hero-gls.mp4', label: 'Gaming Luxury Screens' },
];

const VideoCarousel = () => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout>>();

  const goToVideo = useCallback((index: number) => {
    if (index === currentVideoIndex || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentVideoIndex(index);
    const newVideo = videoRefs.current[index];
    if (newVideo) {
      newVideo.currentTime = 0;
      newVideo.play().catch(() => {});
    }
    transitionTimeout.current = setTimeout(() => {
      setIsTransitioning(false);
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

  if (videoFailed) {
    return (
      <section className="py-6 px-4">
        <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
          <div className="relative overflow-hidden aspect-video">
            <img
              src="/images/41931538-f28c-4223-89e9-23b458ec78db.png"
              alt="Consoltech products showcase"
              className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 px-4">
      <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl relative group">
        <div className="relative aspect-video">
          <div className="absolute inset-0 shimmer-card rounded-2xl z-0" />

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

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-[15] pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;
