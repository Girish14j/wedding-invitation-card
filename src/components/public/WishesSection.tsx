import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquareHeart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createWhatsAppUrl } from '../../lib/whatsapp';

const WEDDING_WHATSAPP_NUMBER = '919637792195';

export const WishesSection: React.FC = () => {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      const whatsappMessage = [
        'Wedding Wish for Khushal & Bhanupriya',
        '',
        `Guest Name: ${name.trim()}`,
        ...(relation.trim() ? [`Relationship: ${relation.trim()}`] : []),
        `Wedding Wish: ${message.trim()}`,
      ].join('\n');
      window.open(createWhatsAppUrl(WEDDING_WHATSAPP_NUMBER, whatsappMessage), '_blank', 'noopener,noreferrer');

      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#FAF3DC', '#670A17'],
      });

      setName('');
      setRelation('');
      setMessage('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Could not open WhatsApp.';
      alert(errorMessage);
    }
  };

  return (
    <section id="wishes" className="mx-auto max-w-3xl px-4 py-24">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-royalty-gold font-sans mb-2">Heartfelt Blessings</p>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-royalty-champagne">Wedding Wishes</h2>
        <div className="w-20 h-0.5 bg-royalty-gold mx-auto mt-4" />
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-royalty-gold/30 bg-royalty-deepMaroon/70 p-6 shadow-xl backdrop-blur-md sm:p-10">
          <h3 className="font-serif text-2xl font-bold text-royalty-champagne mb-4 flex items-center gap-2">
            <MessageSquareHeart className="w-6 h-6 text-royalty-gold" />
            <span>Send Your Blessings</span>
          </h3>

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-royalty-maroon/60 border border-royalty-gold/50 flex items-center gap-3 text-royalty-champagne text-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-royalty-gold shrink-0" />
              <span>WhatsApp is open with your blessing ready to send directly to the family.</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-1 font-sans">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Joshi"
                className="w-full px-4 py-2.5 rounded-xl bg-royalty-deepMaroon border border-royalty-gold/30 text-royalty-warmBeige focus:outline-none focus:border-royalty-gold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-1 font-sans">
                Relationship (Optional)
              </label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="e.g. Groom's Friend / Bride's Cousin"
                className="w-full px-4 py-2.5 rounded-xl bg-royalty-deepMaroon border border-royalty-gold/30 text-royalty-warmBeige focus:outline-none focus:border-royalty-gold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-1 font-sans">
                Your Wedding Wish / Message *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your blessings and congratulations..."
                className="w-full px-4 py-2.5 rounded-xl bg-royalty-deepMaroon border border-royalty-gold/30 text-royalty-warmBeige focus:outline-none focus:border-royalty-gold text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-royalty-champagne via-royalty-gold to-yellow-600 py-3.5 font-serif text-sm font-bold uppercase tracking-widest text-royalty-deepMaroon shadow-lg transition-all hover:shadow-royalty-gold/40"
            >
              <span>Send Wish on WhatsApp</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
