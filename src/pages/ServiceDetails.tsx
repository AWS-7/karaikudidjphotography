import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Loader2, Camera, Heart, Users, Calendar, Baby, Star, Briefcase, UserCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useEvents } from '../hooks/useEvents';
import { motion, useInView } from 'framer-motion';
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

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: services, loading: servicesLoading } = useSiteSettings<Service[]>('services_data', DEFAULT_SERVICES);
  const { events, loading: eventsLoading } = useEvents();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const service = services.find((s) => s.id === id);
  const Icon = service ? (iconMap[service.icon || ''] || Camera) : Camera;

  // Filter events related to this service category
  const relatedEvents = events.filter(e => 
    service && e.category.toLowerCase().includes(service.title.toLowerCase()) || 
    (service?.icon && e.category.toLowerCase().includes(service.icon.toLowerCase()))
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (servicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-stone-800 mb-4">Service Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-gold-600 font-sans hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-stone-500 hover:text-gold-600 transition-colors font-sans text-sm uppercase tracking-widest font-semibold"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gold-100 rounded-2xl text-gold-600">
                <Icon size={32} />
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-stone-800">
                {service.title}
              </h1>
            </div>
            
            <p className="font-serif text-xl text-stone-600 leading-relaxed">
              {service.description}
            </p>

            <div className="pt-6">
              <a
                href={`https://wa.me/918825605403?text=Hi%20Dass!%20I'm%20interested%20in%20your%20${service.title}%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-sans text-base font-bold tracking-[0.1em] uppercase bg-gold-500 text-white hover:bg-gold-600 hover:shadow-2xl hover:shadow-gold-500/40 transition-all duration-500 transform hover:-translate-y-1"
              >
                <MessageCircle size={20} />
                Enquire Now
              </a>
            </div>
          </motion.div>
        </div>

        {/* Portfolio / Related Events Section */}
        <div ref={ref} className="space-y-12">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mb-4">Our Work in {service.title}</h2>
            <div className="gold-divider" />
          </div>

          {eventsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
            </div>
          ) : relatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/gallery/${event.slug}`)}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <img
                      src={event.coverImage}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-stone-800 group-hover:text-gold-600 transition-colors">
                      {event.name}
                    </h3>
                    <p className="font-sans text-sm text-stone-400 mt-1">{event.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
              <Camera size={48} className="mx-auto text-stone-200 mb-4" />
              <p className="font-serif text-xl text-stone-400 italic">Portfolio coming soon for this category</p>
              <button 
                onClick={() => navigate('/#gallery')}
                className="mt-6 text-gold-600 font-sans hover:underline"
              >
                View All Gallery
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
