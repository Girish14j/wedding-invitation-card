import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

export const PetalOverlay: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generated: Petal[] = Array.from({ length: 18 }).map((_, index) => ({
      id: index,
      left: Math.random() * 95,
      size: Math.floor(Math.random() * 14) + 12,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 6,
      rotation: Math.floor(Math.random() * 360),
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute block opacity-75"
          style={{
            left: `${petal.left}%`,
            top: '-40px',
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            backgroundColor: '#E8A39B',
            borderRadius: '50% 0 50% 50%',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            animation: `floatPetal ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
            transform: `rotate(${petal.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatPetal {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(25px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
