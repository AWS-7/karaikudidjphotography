import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react';
import { testimonials as defaultTestimonials, type Testimonial } from '../data/testimonials';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [current, setCurrent] = useState(0);
  const { data: testimonialsList, loading } = useSiteSettings<Testimonial[]>('testimonials_data', defaultTestimonials);

  const prev = () => setCurrent((c) => (c - 1 + (testimonialsList?.length || 0)) % (testimonialsList?.length || 1));
  const next = () => setCurrent((c) => (c + 1) % (testimonialsList?.length || 1));

  if (loading) {
    return (
      <section className="py-24 bg-stone-900 flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="text-gold-500 animate-spin" />
      </section>
    );
  }

  if (!testimonialsList || testimonialsList.length === 0) return null;

  const t = testimonialsList[current];

  return (
    <section className="py-24 bg-stone-900 relative overflow-hidden" ref={ref}>
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900/90 to-maroon-900/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="font-script text-gold-400 text-2xl mb-2 block">Testimonials</span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white leading-tight">
            What Our <span className="italic text-gold-300">Clients</span> Say
          </h2>
          <span className="block w-16 h-0.5 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-5" />
        </motion.div>

        {/* Testimonial Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12"
          >
            {/* Quote icon */}
            <Quote
              size={48}
              className="absolute top-6 right-6 text-gold-500/20"
              fill="currentColor"
            />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={18} className="text-gold-400 fill-gold-400" />
              ))}
            </div>

            {/* Review */}
            <p className="font-serif text-white/90 text-xl md:text-2xl leading-relaxed italic mb-8">
              "{t.review}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-500/50">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-serif text-white text-lg">{t.name}</div>
                <div className="font-sans text-gold-400/80 text-sm">{t.event}</div>
                <div className="font-sans text-white/40 text-xs mt-0.5">{t.location}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full border border-white/20 text-white/60 hover:text-gold-400 hover:border-gold-500 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {testimonialsList.map((_: Testimonial, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-gold-500 w-8' : 'bg-white/30 w-4 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full border border-white/20 text-white/60 hover:text-gold-400 hover:border-gold-500 flex items-center justify-center transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
