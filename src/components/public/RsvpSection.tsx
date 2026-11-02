import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CalendarCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../../lib/supabase';
import { createWhatsAppUrl } from '../../lib/whatsapp';
import { WeddingEvent } from '../../types/database.types';

interface Props {
  events: WeddingEvent[];
  whatsappNumber: string;
}

export const RsvpSection: React.FC<Props> = ({ events, whatsappNumber }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'attending' | 'declined'>('attending');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleEvent = (eventName: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventName) ? prev.filter((e) => e !== eventName) : [...prev, eventName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const rsvpMessage = [
        'Wedding RSVP for Khushal & Bhanupriya',
        '',
        `Name: ${fullName.trim()}`,
        `Phone: ${phone.trim()}`,
        `Response: ${attending === 'attending' ? 'Joyfully accepting' : 'Regretfully declining'}`,
        ...(attending === 'attending'
          ? [
              `Guests: ${guestCount}`,
              `Ceremonies: ${selectedEvents.length > 0 ? selectedEvents.join(', ') : 'Not specified'}`,
            ]
          : []),
        ...(message.trim() ? ['', `Note: ${message.trim()}`] : []),
      ].join('\n');
      window.open(createWhatsAppUrl(whatsappNumber, rsvpMessage), '_blank', 'noopener,noreferrer');

      const { error } = await supabase.from('rsvps').insert([
        {
          full_name: fullName.trim(),
          phone: phone.trim(),
          attending,
          guest_count: attending === 'attending' ? guestCount : 0,
          selected_events: attending === 'attending' ? selectedEvents : [],
          message: message.trim() || null,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFFFF0', '#4A0404'],
      });
    } catch (err: any) {
      alert(`RSVP submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-24 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-royalty-gold font-sans mb-2">Grace Us With Your Presence</p>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-royalty-champagne">Confirm Attendance</h2>
        <div className="w-20 h-0.5 bg-royalty-gold mx-auto mt-4" />
      </div>

      <div className="p-8 sm:p-12 rounded-2xl bg-royalty-deepMaroon/80 border border-royalty-gold/40 shadow-2xl backdrop-blur-md">
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-10"
          >
            <CheckCircle2 className="w-16 h-16 text-royalty-gold mx-auto mb-4" />
            <h3 className="font-serif text-3xl font-bold text-royalty-champagne mb-2">
              Thank You, {fullName}!
            </h3>
            <p className="text-royalty-warmBeige/90 max-w-md mx-auto text-sm leading-relaxed">
              Your response has been recorded, and your RSVP is ready to send in WhatsApp. Khushal, Bhanupriya, and their families can’t wait to celebrate with you.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-1 font-sans">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-royalty-deepMaroon border border-royalty-gold/30 text-royalty-warmBeige focus:outline-none focus:border-royalty-gold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-1 font-sans">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-royalty-deepMaroon border border-royalty-gold/30 text-royalty-warmBeige focus:outline-none focus:border-royalty-gold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-2 font-sans">
                Will You Attend?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAttending('attending')}
                  className={`py-3 rounded-xl border text-sm font-serif font-bold transition-all ${
                    attending === 'attending'
                      ? 'bg-royalty-gold text-royalty-deepMaroon border-royalty-gold shadow-md'
                      : 'border-royalty-gold/30 text-royalty-warmBeige/70 hover:border-royalty-gold/60'
                  }`}
                >
                  Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => setAttending('declined')}
                  className={`py-3 rounded-xl border text-sm font-serif font-bold transition-all ${
                    attending === 'declined'
                      ? 'bg-royalty-maroon text-royalty-champagne border-royalty-gold shadow-md'
                      : 'border-royalty-gold/30 text-royalty-warmBeige/70 hover:border-royalty-gold/60'
                  }`}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            {attending === 'attending' && (
              <>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-1 font-sans">
                    Total Number of Guests Attending
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-royalty-deepMaroon border border-royalty-gold/30 text-royalty-warmBeige focus:outline-none focus:border-royalty-gold text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-2 font-sans">
                    Ceremonies You Will Join
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {events.map((evt) => (
                      <label
                        key={evt.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          selectedEvents.includes(evt.name)
                            ? 'border-royalty-gold bg-royalty-maroon/40 text-royalty-champagne'
                            : 'border-royalty-gold/20 bg-royalty-deepMaroon text-royalty-warmBeige/70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(evt.name)}
                          onChange={() => toggleEvent(evt.name)}
                          className="accent-royalty-gold w-4 h-4"
                        />
                        <span className="text-xs font-serif">{evt.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-1 font-sans">
                Note for the Couple / Dietary Preferences
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Let us know if you have specific travel arrangements or preferences..."
                className="w-full px-4 py-2.5 rounded-xl bg-royalty-deepMaroon border border-royalty-gold/30 text-royalty-warmBeige focus:outline-none focus:border-royalty-gold text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-serif text-sm uppercase tracking-widest font-bold bg-gradient-to-r from-royalty-champagne via-royalty-gold to-yellow-600 text-royalty-deepMaroon shadow-xl hover:shadow-royalty-gold/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>{isSubmitting ? 'Opening WhatsApp...' : 'Send RSVP on WhatsApp'}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
