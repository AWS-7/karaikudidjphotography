import { motion } from 'framer-motion';
import { ChevronDown, MessageCircle, Images } from 'lucide-react';
import { useState, useEffect } from 'react';

const HERO_STORAGE_KEY = 'dj_hero_data';

const DEFAULT_HERO = {
  subtitle: 'DJ Photography',
  title: 'Capturing Love, Light & Emotion',
  tagline: 'Professional Wedding Photographer & Cinematographer',
  stat1Value: '8+',
  stat1Label: 'Years Experience',
  stat2Value: '1500+',
  stat2Label: 'Weddings',
  stat3Value: '100%',
  stat3Label: 'Happy Clients',
  bgImage: 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=1920',
};

function loadHeroData() {
  try {
    const stored = localStorage.getItem(HERO_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_HERO;
}

export default function Hero() {
  const [heroData, setHeroData] = useState(loadHeroData());

  useEffect(() => {
    const handleFocus = () => setHeroData(loadHeroData());
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  const titleParts = heroData.title.split('Light');

  return (
    <section className="relative w-full h-[85vh] sm:h-screen min-h-[500px] sm:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroData.bgImage}
          alt="Wedding photography by DJ Photography Karaikudi"
          className="w-full h-full object-cover object-center"
          style={{
            animation: 'heroZoom 20s ease-in-out infinite alternate',
            transform: 'scale(1.05)',
          }}
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(60,10,20,0.55) 55%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Gold bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(250,244,235,1) 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-script text-gold-300 text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4 block"
        >
          {heroData.subtitle}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-white text-shadow max-w-5xl leading-none mb-3 sm:mb-6 px-2 sm:px-0"
        >
          {titleParts[0]}
          <span className="italic text-gold-300">Light</span>
          {titleParts[1]}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-sans text-cream-200 text-sm sm:text-lg md:text-xl tracking-widest uppercase font-light mb-6 sm:mb-10 text-shadow-sm px-4 sm:px-0"
        >
          {heroData.tagline}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex gap-4 sm:gap-8 md:gap-16 mb-6 sm:mb-12"
        >
          {[
            { value: heroData.stat1Value, label: heroData.stat1Label },
            { value: heroData.stat2Value, label: heroData.stat2Label },
            { value: heroData.stat3Value, label: heroData.stat3Label },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-xl sm:text-2xl md:text-3xl text-gold-300 font-light">{stat.value}</div>
              <div className="font-sans text-cream-300/70 text-[10px] sm:text-xs tracking-widest uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-0 w-full sm:w-auto"
        >
          <button
            onClick={scrollToGallery}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white font-sans text-xs sm:text-sm tracking-widest uppercase font-medium hover:shadow-2xl hover:shadow-gold-500/40 hover:scale-105 transition-all duration-300 rounded-sm w-full sm:w-auto"
          >
            <Images size={18} />
            View Gallery
          </button>
          <a
            href="https://wa.me/918825605403?text=Hi%20Dass!%20I%20would%20like%20to%20book%20DJ%20Photography."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/80 text-white font-sans text-xs sm:text-sm tracking-widest uppercase font-medium hover:bg-white hover:text-stone-800 transition-all duration-300 rounded-sm backdrop-blur-sm w-full sm:w-auto"
          >
            <MessageCircle size={18} />
            Contact on WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60 cursor-pointer"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
}
