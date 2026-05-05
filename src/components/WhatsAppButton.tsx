import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [tooltip, setTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="bg-white rounded-xl shadow-2xl p-4 w-60 border border-cream-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans font-medium text-stone-800 text-sm">Chat with us!</span>
              <button
                onClick={() => setTooltip(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={14} />
              </button>
            </div>
            <p className="font-sans text-xs text-stone-500 mb-3">
              Hi! Interested in booking? Let's chat on WhatsApp.
            </p>
            <a
              href="https://wa.me/918825605403?text=Hi%20Dass!%20I%20am%20interested%20in%20booking%20DJ%20Photography%20for%20my%20wedding."
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-xs font-sans font-medium tracking-wide uppercase transition-colors"
            >
              Open WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setTooltip(!tooltip)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40 animate-pulse-gold transition-colors"
        style={{ animation: 'pulse-gold 2s ease-in-out infinite' }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} className="text-white fill-white" />
      </motion.button>
    </div>
  );
}
