import { Link } from 'react-router-dom';
import { Camera, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-b border-stone-700">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
              <div>
                <p className="font-script text-gold-400 text-xl">DJ Photography</p>
                <p className="font-sans text-xs tracking-widest text-stone-400 uppercase">Karaikudi</p>
              </div>
            </div>
            <p className="font-serif text-stone-400 text-sm leading-relaxed italic">
              "Capturing Love, Light & Emotion — one frame at a time."
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/dj_photography_kkdi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-stone-600 flex items-center justify-center text-stone-400 hover:text-gold-400 hover:border-gold-500 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://wa.me/918825605403"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-stone-600 flex items-center justify-center text-stone-400 hover:text-gold-400 hover:border-gold-500 transition-colors"
              >
                <Phone size={16} />
              </a>
              <a
                href="mailto:djphotographykkdi@gmail.com"
                className="w-9 h-9 rounded-full border border-stone-600 flex items-center justify-center text-stone-400 hover:text-gold-400 hover:border-gold-500 transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-sm font-medium tracking-widest uppercase text-gold-400 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/#about' },
                { label: 'Services', to: '/#services' },
                { label: 'Gallery', to: '/#gallery' },
                { label: 'Contact', to: '/#contact' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="font-sans text-stone-400 hover:text-gold-400 transition-colors text-sm tracking-wide"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-sm font-medium tracking-widest uppercase text-gold-400 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-gold-500 mt-0.5 flex-shrink-0" />
                <a href="tel:+918825605403" className="font-sans text-stone-400 hover:text-gold-400 transition-colors text-sm">
                  +91 88256 05403
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Instagram size={15} className="text-gold-500 mt-0.5 flex-shrink-0" />
                <a
                  href="https://www.instagram.com/dj_photography_kkdi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-stone-400 hover:text-gold-400 transition-colors text-sm"
                >
                  @dj_photography_kkdi
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-gold-500 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:djphotographykkdi@gmail.com"
                  className="font-sans text-stone-400 hover:text-gold-400 transition-colors text-sm break-all"
                >
                  djphotographykkdi@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="font-sans text-stone-400 text-sm">Karaikudi, Tamil Nadu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-stone-500 text-xs tracking-wide">
            &copy; {year} DJ Photography, Karaikudi. All rights reserved.
          </p>
          <p className="font-sans text-stone-500 text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-maroon-500 fill-maroon-500" /> for beautiful memories
          </p>
        </div>
      </div>
    </footer>
  );
}
