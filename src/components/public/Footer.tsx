import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';

interface Props {
  groomName: string;
  brideName: string;
  weddingDateDisplay: string;
}

export const Footer: React.FC<Props> = ({ groomName, brideName, weddingDateDisplay }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 px-4 bg-royalty-deepMaroon border-t border-royalty-gold/30 text-center relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-royalty-gold mb-2">
          {groomName} &amp; {brideName}
        </h2>
        <p className="font-serif text-sm tracking-widest text-royalty-champagne/80 mb-6">{weddingDateDisplay}</p>

        <p className="font-hindi mb-8 max-w-2xl whitespace-pre-line text-sm leading-8 text-royalty-blush/90 sm:text-base">
          {'आपके आने से खिल उठीं खुशियों की कलियाँ,\nरोशन हो गईं हमारे घर-आँगन की गलियाँ।\nदिया आपने जो स्नेहमयी आशीर्वाद और प्यार,\nदिल से अदा करता है अपना शुक्रिया —\nसमस्त पसावत परिवार'}
        </p>

        <button
          onClick={scrollToTop}
          className="p-3 rounded-full border border-royalty-gold/40 text-royalty-gold hover:bg-royalty-gold hover:text-royalty-deepMaroon transition-all shadow-md mb-8"
          title="Return to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        <div className="text-sm text-royalty-warmBeige/60 font-sans flex items-center justify-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          <span>by Girish Joshi</span>
        </div>
      </div>
    </footer>
  );
};
