import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Images, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';

const categories = ['All', 'Wedding', 'Pre-Wedding', 'Engagement', 'Reception', 'Ceremony', 'Event'];

export default function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const { events, loading, error, refetch } = useEvents();

  const filtered = activeCategory === 'All'
    ? events
    : events.filter((e) => e.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-cream-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-heading">Our Work</span>
          <h2 className="section-title">
            Gallery of{' '}
            <span className="italic text-gold-600">Memories</span>
          </h2>
          <span className="gold-divider" />
          <p className="font-sans text-stone-500 mt-6 max-w-xl mx-auto text-base">
            Every photograph tells a story. Browse through our curated collection of
            weddings, pre-wedding shoots, and special celebrations.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-sans text-sm tracking-wide transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gold-500 text-white shadow-md shadow-gold-500/30'
                  : 'bg-white text-stone-600 border border-cream-300 hover:border-gold-400 hover:text-gold-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="text-gold-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 max-w-md mx-auto">
              <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-stone-800 mb-2">Failed to Load Gallery</h3>
              <p className="font-sans text-stone-500 text-sm mb-6">
                Unable to connect to the server. Please check your connection and try again.
              </p>
              <button
                onClick={refetch}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-500 text-white font-sans text-sm font-medium tracking-wide rounded-full hover:bg-gold-600 transition-colors"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Event Grid */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  onClick={() => navigate(`/gallery/${event.slug}`)}
                  className="group relative rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={event.coverImage}
                      alt={event.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Category tag */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gold-500/90 backdrop-blur-sm text-white font-sans text-xs tracking-widest uppercase px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>

                    {/* Photo count */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white/80 text-xs font-sans px-2.5 py-1 rounded-full">
                      <Images size={12} />
                      {event.images.length} Photos
                    </div>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-serif text-white text-2xl font-light leading-tight mb-1">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gold-300 text-sm font-sans mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>View Album</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-14"
        >
          <p className="font-serif text-stone-500 italic text-lg mb-6">
            Want to see more? Follow us on Instagram for daily updates.
          </p>
          <a
            href="https://www.instagram.com/dj_photography_kkdi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold"
          >
            @dj_photography_kkdi
          </a>
        </motion.div>
      </div>
    </section>
  );
}
