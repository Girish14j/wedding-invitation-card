import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useWeddingAudio } from '../../context/AudioContext';

export const AudioFloatingPlayer: React.FC = () => {
  const { isPlaying, togglePlay } = useWeddingAudio();

  return (
    <button
      type="button"
      onClick={togglePlay}
      title={isPlaying ? 'Pause Instrumental' : 'Play Instrumental'}
      aria-label={isPlaying ? 'Pause Instrumental' : 'Play Instrumental'}
      className="fixed right-5 top-5 z-40 rounded-full border border-royalty-gold/50 bg-royalty-deepMaroon/90 p-3 text-royalty-gold shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors hover:bg-royalty-gold hover:text-royalty-deepMaroon"
    >
      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
    </button>
  );
};
