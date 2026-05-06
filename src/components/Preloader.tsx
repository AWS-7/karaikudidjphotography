import { motion } from 'framer-motion';
import logo from '../images/1778058672282-removebg-preview.png';

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-900"
    >
      <div className="relative flex flex-col items-center">
        {/* Animated outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-2 border-transparent border-t-gold-500 border-r-gold-500/30"
        />
        
        {/* Pulsing inner ring */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-32 h-32 rounded-full border border-gold-500/20 m-auto"
        />

        {/* Logo in the center */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img 
            src={logo} 
            alt="DJ Photography Logo" 
            className="w-20 h-20 object-contain brightness-0 invert" 
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="font-serif text-gold-500 text-lg tracking-[0.2em] uppercase">DJ Photography</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
