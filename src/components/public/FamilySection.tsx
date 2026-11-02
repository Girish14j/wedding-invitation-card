import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const familyIntroductions = [
  {
    side: "Groom's Family",
    father: 'Shri. Kanhaiyalal Joshi',
    mother: 'Smt. Dina Joshi',
    family: 'Samast Pasawat Parivaar',
  },
  {
    side: "Bride's Family",
    father: 'Shri. Shankarji Joshi',
    mother: 'Smt. Pushpa Joshi',
    family: 'Samast Joshi Family',
  },
];

export const FamilySection: React.FC = () => (
  <section id="family" className="relative overflow-hidden border-y border-royalty-gold/20 px-4 py-24">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent_65%)]" />
    <div className="relative mx-auto max-w-6xl">
      <div className="mb-14 text-center">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-royalty-gold">With the blessings of</p>
        <h2 className="font-serif text-3xl font-bold text-royalty-champagne sm:text-5xl">The Families</h2>
        <div className="mx-auto mt-4 h-0.5 w-20 bg-royalty-gold" />
      </div>

      <div className="space-y-7">
        {familyIntroductions.map((family, index) => (
          <motion.article
            key={family.side}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12 }}
            className="relative overflow-hidden rounded-3xl border border-royalty-gold/30 bg-gradient-to-br from-royalty-burgundy/75 via-royalty-deepMaroon/90 to-royalty-burgundy/50 p-6 shadow-xl sm:p-9"
          >
            <div className="pointer-events-none absolute inset-3 rounded-2xl border border-royalty-gold/10" />
            <p className="relative mb-7 text-center font-sans text-[10px] uppercase tracking-[0.28em] text-royalty-gold/75 sm:text-xs">
              {family.side}
            </p>

            <div className="relative grid items-center gap-5 text-center md:grid-cols-[1fr_auto_1fr] md:gap-8">
              <div className="order-2 md:order-1">
                <h3 className="font-serif text-xl font-semibold leading-snug text-royalty-champagne sm:text-2xl lg:text-4xl">
                  {family.father}
                </h3>
              </div>

              <div className="order-1 flex flex-col items-center md:order-2">
                <Heart className="mb-3 h-5 w-5 fill-royalty-gold/20 text-royalty-gold" />
                <span className="h-px w-14 bg-royalty-gold/50" />
              </div>

              <div className="order-3">
                <h3 className="font-serif text-xl font-semibold leading-snug text-royalty-champagne sm:text-2xl lg:text-4xl">
                  {family.mother}
                </h3>
              </div>
            </div>

            <p className="relative mt-5 text-center font-serif text-2xl font-bold leading-snug text-royalty-gold sm:mt-7 sm:text-3xl lg:text-4xl">
              {family.family}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);
