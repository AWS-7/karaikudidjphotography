import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X, MessageCircle } from 'lucide-react';
import { packages } from '../data/packages';

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="services" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-heading">Packages</span>
          <h2 className="section-title">
            Photography <span className="italic text-gold-600">Packages</span>
          </h2>
          <span className="gold-divider" />
          <p className="font-sans text-stone-500 mt-6 max-w-xl mx-auto text-base">
            Choose a package that fits your vision. Every package includes our signature
            candid storytelling style and full post-processing.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${
                pkg.popular
                  ? 'ring-2 ring-gold-500 shadow-2xl shadow-gold-500/20 scale-[1.03]'
                  : 'bg-white border border-cream-200 shadow-md'
              }`}
            >
              {/* Popular ribbon */}
              {pkg.badge && (
                <div className={`absolute top-4 right-0 z-10 px-4 py-1 text-xs font-sans font-medium tracking-widest uppercase text-white rounded-l-full ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-gold-600 to-gold-500'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}>
                  {pkg.badge}
                </div>
              )}

              {/* Header */}
              <div className={`p-6 sm:p-8 bg-gradient-to-br ${pkg.accentColor} text-white`}>
                <p className="font-sans text-xs tracking-[0.3em] uppercase font-medium mb-2 opacity-80">
                  Package
                </p>
                <h3 className="font-serif text-3xl sm:text-4xl font-light mb-2 sm:mb-4">{pkg.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="font-serif text-2xl sm:text-3xl font-medium">{pkg.price}</span>
                </div>
                <p className="font-sans text-xs opacity-70 mt-1 tracking-wide">{pkg.priceNote}</p>
              </div>

              {/* Features */}
              <div className={`p-4 sm:p-6 flex flex-col gap-2 sm:gap-3 ${pkg.popular ? 'bg-cream-50' : 'bg-white'}`}>
                {pkg.features.map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-gold-600" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                        <X size={11} className="text-stone-300" strokeWidth={3} />
                      </div>
                    )}
                    <span className={`font-sans text-xs sm:text-sm ${feature.included ? 'text-stone-700' : 'text-stone-300'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}

                <a
                  href={`https://wa.me/918825605403?text=Hi%20Dass!%20I'm%20interested%20in%20the%20${pkg.name}%20package%20(${pkg.price}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 sm:mt-4 w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg font-sans text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:shadow-lg hover:shadow-gold-500/30 hover:scale-105'
                      : 'border border-gold-400 text-gold-600 hover:bg-gold-500 hover:text-white hover:scale-105'
                  }`}
                >
                  <MessageCircle size={14} />
                  Book Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center font-sans text-stone-400 text-sm mt-10"
        >
          * All prices are starting prices. Contact us for custom quotes based on location and event duration.
        </motion.p>
      </div>
    </section>
  );
}
