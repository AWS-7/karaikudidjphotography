import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePackages } from '../hooks/usePackages';
import { useSiteSettings } from '../hooks/useSiteSettings';
import type { FontSettings } from '../types/database';
import { DEFAULT_FONT_SETTINGS } from '../data/fontSettings';
import img1 from '../images/1778054327731.jpg';
import img2 from '../images/1778054327722.jpg';
import img3 from '../images/1778054327710.jpg';
import img4 from '../images/1778054327688.jpg';
import img5 from '../images/1778054327700.jpg';

const packageImages = [img1, img2, img3, img4];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();
  const { packages, loading } = usePackages();
  const { data: fontSettings } = useSiteSettings<FontSettings>('font_settings', DEFAULT_FONT_SETTINGS);
  const servicesFont = fontSettings.services || DEFAULT_FONT_SETTINGS.services;

  return (
    <section id="services" className="py-20 sm:py-28 bg-stone-50 relative overflow-hidden" ref={ref}>
      {/* Background decorative image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <img src={img5} alt="" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 sm:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <span className="h-px w-12 bg-gold-400" />
            <span className={`${servicesFont.subtitle} text-gold-600 text-xs tracking-[0.3em] uppercase font-semibold`}>
              Our Pricing
            </span>
            <span className="h-px w-12 bg-gold-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={`${servicesFont.title} text-4xl sm:text-5xl md:text-6xl font-light text-stone-800 leading-tight`}
          >
            Photography{' '}
            <span className="relative inline-block">
              <span className="italic text-gold-600">Packages</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gold-300 origin-left rounded-full"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`${servicesFont.text} text-stone-500 mt-6 max-w-xl mx-auto text-base leading-relaxed`}
          >
            Choose a package that fits your vision. Every package includes our signature
            candid storytelling style and full post-processing.
          </motion.p>
        </motion.div>

        {/* Image Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative group"
              >
                <div className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
                  pkg.popular ? 'lg:-translate-y-3 shadow-2xl' : 'hover:-translate-y-2 hover:shadow-2xl'
                }`}>
                  {/* Image */}
                <div className="relative h-[420px] sm:h-[380px] overflow-hidden">
                  <img
                    src={pkg.coverImage || packageImages[i] || packageImages[0]}
                    alt={`${pkg.name} Package`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Popular badge */}
                    {pkg.popular && (
                      <div className="absolute top-4 left-4 bg-gold-500 text-white px-4 py-1.5 rounded-full text-xs font-sans font-semibold tracking-widest uppercase shadow-lg z-10">
                        Most Popular
                      </div>
                    )}

                    {/* Content overlay - name + price only */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                      <div>
                        <h3 className={`${servicesFont.title} text-3xl sm:text-4xl font-light text-white mb-2`}>
                          {pkg.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className={`${servicesFont.title} text-3xl sm:text-4xl font-light text-gold-300`}>
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                          <span className={`${servicesFont.text} text-white/50 text-xs`}>{pkg.priceNote}</span>
                        </div>
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/package/${pkg.id}`)}
                        className={`mt-5 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl ${servicesFont.text} text-sm font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                          pkg.popular
                            ? 'bg-gold-500 text-white hover:bg-gold-400 shadow-lg shadow-gold-500/25'
                            : 'bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white hover:text-stone-900'
                        }`}
                      >
                        <Eye size={14} />
                        View Details
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center font-sans text-stone-400 text-sm mt-12 sm:mt-16"
        >
          * All prices are starting prices. Contact us for custom quotes based on location and event duration.
        </motion.p>
      </div>
    </section>
  );
}
