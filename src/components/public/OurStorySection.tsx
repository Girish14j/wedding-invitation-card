import React from 'react';
import { motion } from 'framer-motion';
import { ImagePlus } from 'lucide-react';
import { CoupleStory } from '../../types/database.types';

interface Props {
  story: CoupleStory | null;
  groomName: string;
  brideName: string;
}

export const OurStorySection: React.FC<Props> = ({ story, groomName, brideName }) => {
  return (
    <section id="story" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-royalty-gold font-sans mb-2">Sacred Harmony</p>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-royalty-champagne">Our Journey Of Love</h2>
        <div className="w-20 h-0.5 bg-royalty-gold mx-auto mt-4" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto mb-10 flex min-h-96 max-w-5xl items-end justify-center overflow-hidden rounded-3xl border border-royalty-gold/30 bg-gradient-to-br from-royalty-burgundy via-royalty-deepMaroon to-black shadow-2xl sm:min-h-[42rem]"
      >
        {story?.couple_image_url ? (
          <img
            src={story.couple_image_url}
            alt={`${groomName} and ${brideName}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-royalty-gold/75">
            <ImagePlus className="h-12 w-12" />
            <span className="text-xs uppercase tracking-[0.2em]">Couple photo coming soon</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-royalty-deepMaroon/90 via-royalty-deepMaroon/10 to-transparent" />
        <div className="relative z-10 flex items-center justify-center gap-3 px-3 pb-7 text-center sm:gap-6 sm:pb-10">
          <span className="font-serif text-base font-semibold text-royalty-champagne drop-shadow-lg sm:text-3xl">{groomName}</span>
          <span className="font-script text-3xl text-royalty-gold sm:text-5xl">&amp;</span>
          <span className="font-serif text-base font-semibold text-royalty-champagne drop-shadow-lg sm:text-3xl">{brideName}</span>
        </div>
      </motion.div>

      <div className="mb-20 grid gap-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-royalty-gold/25 bg-royalty-deepMaroon/50 p-7 text-center sm:p-9"
        >
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-royalty-gold">The Groom</p>
          <h3 className="mb-4 font-serif text-2xl font-bold text-royalty-champagne">{groomName}</h3>
          <p className="font-hindi whitespace-pre-line text-sm leading-8 text-royalty-warmBeige/85">
            {'माता-पिता का मान, पूरे कुल का जो अभिमान है,\nसादगी जिसकी पहचान और होठों पर सदा मुस्कान है।\nआज बंधने चला है जन्मों के पवित्र बंधन में,\nहमारा खुशाल ही तो इस आँगन की शान और जान है।'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-royalty-gold/25 bg-royalty-deepMaroon/50 p-7 text-center sm:p-9"
        >
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-royalty-gold">The Bride</p>
          <h3 className="mb-4 font-serif text-2xl font-bold text-royalty-champagne">{brideName}</h3>
          <p className="font-hindi whitespace-pre-line text-sm leading-8 text-royalty-warmBeige/85">
            {'संस्कारों की छांव में पली, जिसने हर रिश्ते का मान बढ़ाया है,\nआपनी मीठी बोली और मुस्कान से सदा सबका दिल जीता है,\nहमारे आंगन की खुशबू, हमारे कुल का अभिमान,\nआज पिया के आंगन की रौशनी बनने चली है हमारी भानुप्रिया।'}
          </p>
        </motion.div>
      </div>

    </section>
  );
};
