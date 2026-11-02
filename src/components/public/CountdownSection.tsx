import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
  targetDateIso: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

interface ScratchCardProps {
  label: string;
  value: string;
  isRevealed: boolean;
  onReveal: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ label, value, isRevealed, onReveal }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScratching = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const drawCover = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(bounds.width * pixelRatio);
      canvas.height = Math.round(bounds.height * pixelRatio);

      const context = canvas.getContext('2d');
      if (!context) return;

      context.scale(pixelRatio, pixelRatio);
      const gradient = context.createLinearGradient(0, 0, bounds.width, bounds.height);
      gradient.addColorStop(0, '#f3e5ab');
      gradient.addColorStop(0.5, '#d4af37');
      gradient.addColorStop(1, '#aa771c');
      context.fillStyle = gradient;
      context.fillRect(0, 0, bounds.width, bounds.height);

      context.strokeStyle = 'rgba(255, 255, 240, 0.32)';
      context.lineWidth = 1;
      for (let x = -bounds.height; x < bounds.width; x += 16) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x + bounds.height, bounds.height);
        context.stroke();
      }

      context.fillStyle = '#2b0202';
      context.textAlign = 'center';
      context.font = '600 11px Montserrat, sans-serif';
      context.letterSpacing = '2px';
      context.fillText('SCRATCH TO REVEAL', bounds.width / 2, bounds.height / 2 + 5);
    };

    drawCover();
    window.addEventListener('resize', drawCover);
    return () => window.removeEventListener('resize', drawCover);
  }, [isRevealed]);

  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const bounds = canvas.getBoundingClientRect();
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(event.clientX - bounds.left, event.clientY - bounds.top, 22, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = 'source-over';
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let clearedPixels = 0;
    let sampledPixels = 0;
    const sampleStep = 16;

    for (let y = 0; y < canvas.height; y += sampleStep) {
      for (let x = 0; x < canvas.width; x += sampleStep) {
        sampledPixels += 1;
        if (pixels[(y * canvas.width + x) * 4 + 3] < 32) clearedPixels += 1;
      }
    }

    if (clearedPixels / sampledPixels >= 0.38) onReveal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-royalty-gold/40 bg-royalty-deepMaroon shadow-xl"
    >
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-royalty-burgundy to-royalty-deepMaroon">
        <div className="text-center">
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-royalty-gold">{label}</p>
          <p className="font-serif text-3xl font-bold text-royalty-champagne">{value}</p>
        </div>
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            aria-label={`Scratch to reveal the wedding ${label.toLowerCase()}`}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            onPointerDown={(event) => {
              isScratching.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              scratch(event);
            }}
            onPointerMove={(event) => {
              if (isScratching.current) scratch(event);
            }}
            onPointerUp={() => {
              isScratching.current = false;
              checkScratchProgress();
            }}
            onPointerCancel={() => {
              isScratching.current = false;
              checkScratchProgress();
            }}
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <span className="text-xs text-royalty-warmBeige/70">
          {isRevealed ? 'Revealed!' : 'Use your finger or cursor'}
        </span>
        {!isRevealed && (
          <button
            type="button"
            onClick={onReveal}
            className="text-xs font-semibold text-royalty-gold underline underline-offset-4 hover:text-royalty-champagne"
          >
            Reveal
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const CountdownSection: React.FC<Props> = ({ targetDateIso }) => {
  const [revealedCards, setRevealedCards] = useState<Set<string>>(() => new Set());
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null);
  const weddingDate = new Date(`${targetDateIso.slice(0, 10)}T12:00:00`);
  const cards = [
    { id: 'date', label: 'Date', value: new Intl.DateTimeFormat('en', { day: '2-digit' }).format(weddingDate) },
    { id: 'month', label: 'Month', value: new Intl.DateTimeFormat('en', { month: 'long' }).format(weddingDate) },
    { id: 'year', label: 'Year', value: new Intl.DateTimeFormat('en', { year: 'numeric' }).format(weddingDate) },
  ];
  const countdownStarted = revealedCards.size === cards.length;

  useEffect(() => {
    if (!countdownStarted) return;

    const calculateTime = (): TimeRemaining => {
      const difference = new Date(targetDateIso).getTime() - Date.now();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isPast: false,
      };
    };

    setTimeLeft(calculateTime());
    const timer = window.setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => window.clearInterval(timer);
  }, [countdownStarted, targetDateIso]);

  const revealCard = (id: string) => {
    setRevealedCards((previous) => new Set(previous).add(id));
  };

  return (
    <section className="relative border-y border-royalty-gold/20 bg-royalty-burgundy/40 px-4 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-3 flex items-center justify-center gap-2 text-royalty-gold">
          <Sparkles className="h-4 w-4" />
          <p className="text-xs uppercase tracking-[0.3em]">A little surprise</p>
          <Sparkles className="h-4 w-4" />
        </div>
        <h2 className="mb-3 font-serif text-3xl font-bold text-royalty-champagne md:text-4xl">
          Scratch to Reveal the Date
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-royalty-warmBeige/75">
          Uncover the date, month, and year of our celebration. Once all three are revealed, the countdown begins!
        </p>

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
            >
              <ScratchCard
                label={card.label}
                value={card.value}
                isRevealed={revealedCards.has(card.id)}
                onReveal={() => revealCard(card.id)}
              />
            </motion.div>
          ))}
        </div>

        {countdownStarted && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-14"
          >
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-royalty-gold">
              Counting Down to Our Celebration
            </p>
            {timeLeft?.isPast ? (
              <div className="mx-auto max-w-xl rounded-2xl border border-royalty-gold bg-royalty-deepMaroon/80 p-8 shadow-2xl">
                <h3 className="font-serif text-2xl font-bold text-royalty-gold md:text-3xl">
                  The Celebration Has Begun!
                </h3>
                <p className="mt-2 text-sm text-royalty-warmBeige/80">
                  Thank you for sharing your love and blessings with us.
                </p>
              </div>
            ) : timeLeft ? (
              <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center rounded-xl border border-royalty-gold/30 bg-royalty-deepMaroon/90 p-5 shadow-lg backdrop-blur-sm"
                  >
                    <span className="font-serif text-4xl font-extrabold text-royalty-gold sm:text-5xl">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="mt-2 text-xs font-medium uppercase tracking-widest text-royalty-blush">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </motion.div>
        )}
      </div>
    </section>
  );
};
