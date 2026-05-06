import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Heart, Users, Calendar, Baby, Star, Briefcase, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import type { Service } from '../types/database';

const iconMap: Record<string, any> = {
  Wedding: Heart,
  Engagement: Heart,
  Prewedding: Camera,
  Postwedding: Camera,
  Puberty: Star,
  Birthday: Calendar,
  Babyshoots: Baby,
  Modeling: UserCircle,
  Corporate: Briefcase,
  Portraits: Users,
};

const DEFAULT_SERVICES: Service[] = [
  { id: '1', title: 'Wedding Photography', description: 'Capturing the magic and emotion of your big day with a cinematic and candid touch.', image: 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Wedding' },
  { id: '2', title: 'Engagement Shoots', description: 'Celebrating your journey of love with beautiful, romantic pre-wedding sessions.', image: 'https://images.pexels.com/photos/256737/pexels-photo-256737.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Engagement' },
  { id: '3', title: 'Pre-Wedding & Post-Wedding', description: 'Creative and artistic shoots before and after your wedding to complete your story.', image: 'https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Prewedding' },
  { id: '4', title: 'Puberty Ceremony', description: 'Documenting traditional milestones and family celebrations with cultural respect.', image: 'https://images.pexels.com/photos/1603884/pexels-photo-1603884.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Puberty' },
  { id: '5', title: 'Birthday Shoots', description: 'Fun and vibrant photography for birthdays of all ages, from toddlers to grandparents.', image: 'https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Birthday' },
  { id: '6', title: 'Baby Shoots & Themes', description: 'Adorable outdoor and theme-based sessions for your little ones to cherish forever.', image: 'https://images.pexels.com/photos/3845492/pexels-photo-3845492.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Babyshoots' },
  { id: '7', title: 'Modeling Shoots', description: 'Professional portfolio sessions and fashion photography with high-end editing.', image: 'https://images.pexels.com/photos/157675/fashion-men-model-canvas-157675.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Modeling' },
  { id: '8', title: 'Corporate Events', description: 'High-quality coverage for business conferences, launches, and professional gatherings.', image: 'https://images.pexels.com/photos/2182973/pexels-photo-2182973.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Corporate' },
  { id: '9', title: 'Portrait Sessions', description: 'Personalized portrait photography that captures your personality and unique character.', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Portraits' },
];

export default function ServiceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const inView = useInView(sectionRef, { once: true, margin: '-50px' });
  const { data: services } = useSiteSettings<Service[]>('services_data', DEFAULT_SERVICES);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  // Auto-scroll logic for mobile
  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobile, scroll]);

  return (
    <section id="services-list" className="py-24 bg-white relative overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-script text-gold-500 text-2xl mb-2 block"
          >
            Our Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-light text-stone-800"
          >
            Photography <span className="italic text-gold-600">Services</span>
          </motion.h2>
          <div className="gold-divider" />
        </div>

        {/* Mobile Navigation Arrows */}
        {isMobile && (
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => scroll('left')}
              className="p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-gold-500 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-gold-500 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <div 
          ref={scrollRef}
          className={`${
            isMobile 
              ? 'flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-4' 
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          }`}
        >
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon || ''] || Camera;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/service/${service.id}`)}
                className={`${
                  isMobile ? 'min-w-[85vw] snap-center' : ''
                } group relative bg-stone-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gold-500/20 backdrop-blur-md rounded-lg">
                      <Icon size={20} className="text-gold-400" />
                    </div>
                    <h3 className="font-serif text-xl font-medium">{service.title}</h3>
                  </div>
                  <p className="font-sans text-sm text-white/70 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

