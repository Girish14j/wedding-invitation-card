import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  groomName: string;
  brideName: string;
  weddingDateDisplay: string;
}

export const RoyalCurtainEntrance: React.FC<Props> = ({
  isOpen,
  onOpen,
  groomName,
  brideName,
  weddingDateDisplay,
}) => {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="curtain-container"
          exit={{ opacity: 0, transition: { duration: 1.2, delay: 0.8 } }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-royalty-deepMaroon"
        >
          {/* Left Palace Door */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '-100%', transition: { duration: 1.3, ease: [0.77, 0, 0.175, 1] } }}
            className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-royalty-deepMaroon via-royalty-maroon to-royalty-burgundy border-r-2 border-royalty-gold/40 shadow-2xl z-10 flex items-center justify-end overflow-hidden"
          >
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="w-16 h-48 border-y-2 border-l-2 border-royalty-gold/30 rounded-l-full mr-2 hidden md:block" />
          </motion.div>

          {/* Right Palace Door */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '100%', transition: { duration: 1.3, ease: [0.77, 0, 0.175, 1] } }}
            className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-royalty-deepMaroon via-royalty-maroon to-royalty-burgundy border-l-2 border-royalty-gold/40 shadow-2xl z-10 flex items-center justify-start overflow-hidden"
          >
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="w-16 h-48 border-y-2 border-r-2 border-royalty-gold/30 rounded-r-full ml-2 hidden md:block" />
          </motion.div>

          {/* Center Royal Seal & Invitation Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0, transition: { duration: 0.7 } }}
            className="relative z-30 max-w-xl mx-4 p-8 md:p-12 text-center rounded-2xl bg-royalty-deepMaroon/95 border border-royalty-gold/50 shadow-[0_0_50px_rgba(212,175,55,0.3)] backdrop-blur-md"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-royalty-maroon/60 rounded-full border border-royalty-gold/40">
                <Sparkles className="w-8 h-8 text-royalty-gold animate-spin-slow" />
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-royalty-champagne/80 font-sans mb-3">
              Together with our families
            </p>

            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wider text-royalty-gold mb-2">
              {groomName}
            </h1>
            <p className="font-script text-3xl md:text-4xl text-royalty-blush my-1">&amp;</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-wider text-royalty-gold mb-4">
              {brideName}
            </h2>

            <p className="text-sm md:text-base font-sans tracking-wide text-royalty-warmBeige/90 mb-4">
              Invite You to Celebrate Their Wedding
            </p>

            <div className="inline-block px-5 py-1.5 rounded-full border border-royalty-gold/40 bg-royalty-maroon/40 text-royalty-champagne font-serif text-sm tracking-widest mb-8">
              {weddingDateDisplay}
            </div>

            <div>
              <button
                onClick={onOpen}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-serif text-sm md:text-base font-semibold tracking-wider uppercase text-royalty-deepMaroon bg-gradient-to-r from-royalty-champagne via-royalty-gold to-yellow-600 hover:shadow-[0_0_25px_rgba(212,175,55,0.8)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Open Your Invitation</span>
                <Heart className="w-4 h-4 fill-royalty-deepMaroon group-hover:scale-125 transition-transform" />
              </button>
            </div>

            <p className="mt-4 text-[11px] text-royalty-champagne/50 tracking-wider">
              Clicking initiates celebration music &amp; full entrance
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
