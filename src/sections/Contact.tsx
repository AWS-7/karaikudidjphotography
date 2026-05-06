import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, Instagram, MapPin, Send, MessageCircle, Loader2 } from 'lucide-react';
import { createEnquiry } from '../hooks/useEnquiries';
import { useToast } from '../contexts/ToastContext';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { showToast } = useToast();
  const [formState, setFormState] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    date: '', 
    eventType: 'Wedding',
    message: '' 
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEnquiry({
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        eventDate: formState.date,
        eventType: formState.eventType,
        message: formState.message,
      });

      // Automated WhatsApp Notification Logic
      const adminPhone = '918825605403';
      const message = `*New Enquiry from Website*%0A%0A*Name:* ${formState.name}%0A*Phone:* ${formState.phone}%0A*Event:* ${formState.eventType}%0A*Date:* ${formState.date}%0A*Message:* ${formState.message}`;
      
      // Open WhatsApp in a new tab (simulating automated notification for the admin)
      window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');

      setSubmitted(true);
      showToast('success', 'Enquiry sent successfully!');
      setFormState({ name: '', phone: '', email: '', date: '', eventType: 'Wedding', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      showToast('error', 'Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-cream-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-heading">Get In Touch</span>
          <h2 className="section-title">
            Let's Create{' '}
            <span className="italic text-gold-600">Magic Together</span>
          </h2>
          <span className="gold-divider" />
          <p className="font-sans text-stone-500 mt-6 max-w-xl mx-auto text-base">
            Ready to book your wedding photography? Reach out and let's discuss your dream shoot.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="font-serif text-2xl text-stone-800 mb-6">Contact Details</h3>
              <div className="space-y-5">
                {[
                  {
                    icon: Phone,
                    label: 'Phone / WhatsApp',
                    value: '+91 88256 05403',
                    href: 'tel:+918825605403',
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'djphotographykkdi@gmail.com',
                    href: 'mailto:djphotographykkdi@gmail.com',
                  },
                  {
                    icon: Instagram,
                    label: 'Instagram',
                    value: '@dj_photography_kkdi',
                    href: 'https://www.instagram.com/dj_photography_kkdi',
                  },
                  {
                    icon: MapPin,
                    label: 'Location',
                    value: 'Karaikudi, Tamil Nadu, India',
                    href: undefined,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-gold-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={18} className="text-gold-600" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-1">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="font-sans text-stone-700 hover:text-gold-600 transition-colors text-sm break-all"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-sans text-stone-700 text-sm">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
              <h4 className="font-serif text-stone-800 text-lg mb-2">Prefer to chat directly?</h4>
              <p className="font-sans text-stone-500 text-sm mb-4">
                Message us on WhatsApp for the fastest response. We're available 9 AM – 8 PM.
              </p>
              <a
                href="https://wa.me/918825605403?text=Hi%20Dass!%20I%20would%20like%20to%20book%20DJ%20Photography."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp inline-flex"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-xl overflow-hidden border border-cream-200 shadow-sm">
              <div className="bg-cream-100 h-52 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cream-100 to-cream-200" />
                <div className="relative z-10 text-center">
                  <MapPin size={32} className="text-gold-500 mx-auto mb-2" />
                  <p className="font-serif text-stone-600 text-lg">Karaikudi</p>
                  <p className="font-sans text-stone-400 text-sm">Tamil Nadu, India</p>
                  <a
                    href="https://www.google.com/maps/search/Karaikudi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-gold-600 text-xs mt-2 inline-block hover:underline"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-cream-200 p-8 md:p-10">
              <h3 className="font-serif text-2xl text-stone-800 mb-8">Send an Enquiry</h3>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 font-sans text-sm"
                >
                  Thank you! We'll get back to you within 24 hours.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Bride / Groom name"
                      className="w-full border border-cream-300 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors bg-cream-50"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full border border-cream-300 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors bg-cream-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full border border-cream-300 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors bg-cream-50"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">
                      Event Type *
                    </label>
                    <select
                      required
                      value={formState.eventType}
                      onChange={(e) => setFormState({ ...formState, eventType: e.target.value })}
                      className="w-full border border-cream-300 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors bg-cream-50"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Reception">Reception</option>
                      <option value="Other">Other Event</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="w-full border border-cream-300 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors bg-cream-50"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us about your wedding plans, venue, guest count..."
                    className="w-full border border-cream-300 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors bg-cream-50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold justify-center py-4 rounded-lg text-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Send Enquiry
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
