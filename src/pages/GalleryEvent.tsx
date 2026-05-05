import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Images, ZoomIn, Loader2 } from 'lucide-react';
import { useEvent } from '../hooks/useEvents';
import Lightbox from '../components/Lightbox';

export default function GalleryEvent() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { event, loading, error } = useEvent(slug);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((i) => i !== null && event ? (i + 1) % event.images.length : 0);
  const prevImage = () => setLightboxIndex((i) => i !== null && event ? (i - 1 + event.images.length) % event.images.length : 0);

  const markLoaded = (id: string) => setLoaded((prev) => new Set(prev).add(id));

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <Loader2 size={48} className="text-gold-500 animate-spin mx-auto mb-4" />
          <p className="font-sans text-stone-500">Loading album...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <p className="font-serif text-3xl text-stone-400 mb-4">
            {error || 'Event not found'}
          </p>
          <button onClick={() => navigate('/')} className="btn-outline-gold">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={event.coverImage}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-6 flex items-center gap-2 text-white/80 hover:text-white font-sans text-sm tracking-wide transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Event info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gold-500/90 backdrop-blur-sm text-white font-sans text-xs tracking-widest uppercase px-3 py-1 rounded-full mb-4 inline-block">
              {event.category}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-white font-light leading-tight mb-3">
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/60 font-sans text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {event.date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {event.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Images size={14} />
                {event.images.length} Photos
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="font-serif text-2xl text-stone-700">
            Full Album –{' '}
            <span className="italic text-gold-600">{event.images.length} Photographs</span>
          </h2>
          <p className="font-sans text-stone-400 text-sm mt-1">Click any photo to view full size</p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {event.images.map((image, i) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow"
              onClick={() => openLightbox(i)}
            >
              {/* Skeleton */}
              {!loaded.has(image.id) && (
                <div className="absolute inset-0 bg-stone-200 animate-pulse rounded-xl" />
              )}
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded.has(image.id) ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => markLoaded(image.id)}
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom navigation */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cream-200 pt-10">
          <button
            onClick={() => navigate('/#gallery')}
            className="flex items-center gap-2 font-sans text-stone-500 hover:text-gold-600 text-sm transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to All Events
          </button>
          <a
            href="https://wa.me/918825605403?text=Hi%20Dass!%20I%20loved%20the%20photos%20from%20the%20event%20and%20I%27d%20like%20to%20book%20you."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            Book DJ Photography
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={event.images}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
