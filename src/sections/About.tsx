import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Award, Heart, Star } from 'lucide-react';

const stats = [
  { icon: Camera, value: '8+', label: 'Years of Experience' },
  { icon: Heart, value: '1500+', label: 'Weddings Captured' },
  { icon: Award, value: '50+', label: 'Awards & Recognition' },
  { icon: Star, value: '100%', label: 'Client Satisfaction' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-24 bg-cream-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-full h-full border-2 border-gold-300 rounded-lg z-0" />
              <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Dass - DJ Photography Karaikudi"
                  className="w-full h-[350px] sm:h-[450px] lg:h-[560px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-white rounded-xl shadow-2xl p-3 sm:p-5 border border-cream-200 z-20"
              >
                <div className="text-center">
                  <div className="font-script text-gold-500 text-2xl sm:text-3xl">Since</div>
                  <div className="font-serif text-stone-800 text-3xl sm:text-4xl font-semibold leading-none">2016</div>
                  <div className="font-sans text-stone-400 text-xs tracking-widest uppercase mt-1">Karaikudi</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <span className="section-heading">About Me</span>
              <h2 className="section-title">
                I'm Dass,{' '}
                <span className="italic text-gold-600">DJ Photography</span>
              </h2>
              <span className="gold-divider !mx-0 mt-5" />
            </div>

            <p className="font-serif text-stone-600 text-lg leading-relaxed">
              Based in the heart of Karaikudi, I've spent over 8 years perfecting the art of
              capturing life's most precious moments. Every wedding is a unique story — and
              I believe in telling it through candid emotions, natural light, and real moments
              that you'll treasure forever.
            </p>

            <p className="font-sans text-stone-500 text-base leading-relaxed">
              From the nervous excitement of the morning preparations to the joyful tears
              during the ceremony, I document every layer of your wedding day with a cinematic
              eye and a respectful presence. My approach is unobtrusive, allowing genuine
              moments to unfold naturally.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                'Candid Storytelling',
                'Emotion-First Approach',
                'Cinematic Filmmaking',
                'Pre-Wedding Shoots',
                'Chettinad Specialist',
                'Same-Day Edits',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                  <span className="font-sans text-stone-600 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://wa.me/918825605403"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                Book a Consultation
              </a>
              <button
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline-gold"
              >
                See My Work
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-cream-200 hover:shadow-md hover:border-gold-200 transition-all duration-300 group
            >
              <div className="w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gold-50 transition-colors">
                <stat.icon size={22} className="text-gold-600" />
              </div>
              <div className="font-serif text-3xl text-stone-800 font-light">{stat.value}</div>
              <div className="font-sans text-stone-400 text-xs tracking-wide uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
