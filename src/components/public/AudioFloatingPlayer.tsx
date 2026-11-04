import React from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { useWeddingAudio } from '../../context/AudioContext';

export const AudioFloatingPlayer: React.FC = () => {
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume } = useWeddingAudio();

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-2 px-3 py-2 rounded-full bg-royalty-deepMaroon/90 border border-royalty-gold/50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
      <button
        onClick={togglePlay}
        title={isPlaying ? 'Pause Instrumental' : 'Play Instrumental'}
        className="p-2 rounded-full bg-royalty-gold text-royalty-deepMaroon hover:scale-105 transition-transform"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <button
        onClick={toggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
        className="p-1.5 text-royalty-gold hover:text-royalty-champagne transition-colors"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={isMuted ? 0 : volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="h-16 w-4 accent-royalty-gold cursor-pointer"
        style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
        title="Volume"
      />

      <Music className="w-3.5 h-3.5 text-royalty-gold/70 animate-pulse mt-1" />
    </div>
  );
};
