import { Gamepad2, Mail, Phone, Clock } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 25%, #d946ef 50%, #8b5cf6 75%, #06b6d4 100%)' }}
      />

      {/* Animated glow elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full blur-3xl bg-cyan-400/30 animate-pulse-glow" />
        <div className="absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full blur-3xl bg-purple-400/30 animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full blur-3xl bg-fuchsia-400/30 animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Content Container */}
      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 md:mb-12">
            <div className="relative">
              <Gamepad2
                className="h-16 w-16 md:h-24 md:w-24 text-white drop-shadow-2xl"
                aria-hidden="true"
              />
              <div className="absolute inset-0 rounded-lg bg-white/20 blur-sm" />
            </div>
            <span className="logo-text text-4xl md:text-6xl lg:text-7xl">
              <span className="text-white font-bold drop-shadow-2xl">CONSOL</span>
              <span className="text-cyan-200 font-bold drop-shadow-2xl">TECH</span>
            </span>
          </div>

          {/* Main Message */}
          <div className="mb-8 md:mb-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-10 border-2 border-white/20 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
              <Clock className="h-8 w-8 md:h-12 md:w-12 text-cyan-200" />
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white">
                בקרוב...
              </h1>
            </div>
            <p className="text-xl md:text-3xl font-bold text-white/90 mb-4 md:mb-6">
              אנחנו עובדים על משהו מיוחד
            </p>
            <p className="text-base md:text-xl font-semibold text-white/80 leading-relaxed">
              מובילים עולמיים בתחום הפצת אלקטרוניקה וגיימינג
              <br className="hidden sm:block" />
              מחברים חדשנות עם שווקים ברחבי העולם
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-white/20 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-6">
              צור קשר
            </h2>
            <div className="space-y-4">
              <a
                href="tel:+972522768607"
                className="flex items-center justify-center gap-3 text-white hover:text-cyan-200 transition-colors group"
              >
                <Phone className="h-6 w-6 md:h-7 md:w-7 text-cyan-200 group-hover:scale-110 transition-transform" />
                <span className="text-lg md:text-xl font-bold">+972-52-2768607</span>
              </a>
              <a
                href="mailto:sales@consoltech.shop"
                className="flex items-center justify-center gap-3 text-white hover:text-cyan-200 transition-colors group"
              >
                <Mail className="h-6 w-6 md:h-7 md:w-7 text-cyan-200 group-hover:scale-110 transition-transform" />
                <span className="text-lg md:text-xl font-bold">sales@consoltech.shop</span>
              </a>
            </div>
          </div>

          {/* Footer Text */}
          <p className="mt-8 md:mt-12 text-sm md:text-base font-semibold text-white/70">
            © 2026 CONSOLTECH. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
