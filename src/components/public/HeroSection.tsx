import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar, Sparkles } from 'lucide-react';
import { weddingPhotos } from '../../lib/weddingPhotos';

interface Props {
  groomName: string;
  brideName: string;
  weddingDateDisplay: string;
  heroImageUrl?: string | null;
  quote?: string;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<Props> = ({
  groomName,
  brideName,
  weddingDateDisplay,
  heroImageUrl,
  quote,
  onExploreClick,
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden pt-20 pb-16">
    <div
      className="absolute inset-0 z-0 bg-cover bg-center"
      style={{ backgroundImage: `url("${heroImageUrl || weddingPhotos.hero}")` }}
    />
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-royalty-deepMaroon/65 via-royalty-deepMaroon/60 to-royalty-deepMaroon" />
    <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#D4AF37_1.2px,transparent_1.2px)] [background-size:28px_28px]" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 text-royalty-gold mb-6"
        >
          <div className="h-[1px] w-12 bg-royalty-gold/50" />
          <Sparkles className="w-4 h-4 text-royalty-gold" />
          <span className="text-xs uppercase tracking-[0.35em] font-sans">A Sacred Celebration of Love</span>
          <Sparkles className="w-4 h-4 text-royalty-gold" />
          <div className="h-[1px] w-12 bg-royalty-gold/50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-5xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-royalty-champagne via-royalty-gold to-yellow-200 tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        >
          {groomName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-script text-4xl sm:text-5xl md:text-6xl text-royalty-blush my-2 md:my-4"
        >
          weds
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-5xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-royalty-champagne via-royalty-gold to-yellow-200 tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        >
          {brideName}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 flex items-center gap-3 px-6 py-2.5 rounded-full border border-royalty-gold/40 bg-royalty-deepMaroon/80 backdrop-blur-sm shadow-xl"
        >
          <Calendar className="w-5 h-5 text-royalty-gold" />
          <span className="font-serif text-lg md:text-xl tracking-widest text-royalty-champagne font-medium">
            {weddingDateDisplay}
          </span>
        </motion.div>

        {quote && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="font-hindi mt-6 max-w-xl whitespace-pre-line text-base leading-relaxed text-royalty-warmBeige/90 sm:text-lg"
          >
            "{quote}"
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10"
        >
          <button
            onClick={onExploreClick}
            className="px-8 py-3 rounded-full text-xs md:text-sm uppercase tracking-[0.2em] font-serif font-semibold border-2 border-royalty-gold text-royalty-gold hover:bg-royalty-gold hover:text-royalty-deepMaroon transition-all duration-300 shadow-lg hover:shadow-royalty-gold/30"
          >
            Explore Our Wedding
          </button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-14 text-royalty-gold/60 cursor-pointer"
          onClick={onExploreClick}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </section>
  );
};
