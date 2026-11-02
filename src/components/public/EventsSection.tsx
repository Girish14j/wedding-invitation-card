import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, Sparkles, X, ChevronLeft, ChevronRight, Shirt, ImagePlus } from 'lucide-react';
import { WeddingEvent } from '../../types/database.types';
import { weddingPhotos } from '../../lib/weddingPhotos';

interface Props {
  events: WeddingEvent[];
}

const ceremonyDetails = [
  {
    name: 'Dora Bandhan',
    date: '27 October 2026',
    dressCode: 'Orange',
    description: 'डोरे की हर गांठ में छुपा है अपनों का दुलार,\nसुरक्षा और शुभकामनाओं से सजा दूल्हे का संसार।\nआइए, मिलकर बांधें प्यार का यह पावन धागा...\nऔर करें खुशियों से भरी नई शुरुआत!',
  },
  {
    name: 'Haldi & Sangeet',
    date: '29 November 2026',
    dressCode: 'Lavender',
    description: 'हल्दी की रंगत चमकेगी, संग बजेगी डीजे की बीट,\nलड़केवालों के आँगन में मचेगा धमाल और हसीन संगीत।\nनाचेंगे, गाएंगे और उड़ेंगे पीले रंगों के गुलाल...\nहमारी \'Haldi & DJ Night\' में आप सभी का स्वागत है बेमिसाल!',
  },
  {
    name: 'Mandwa & Binoli',
    date: '1 December 2026',
    dressCode: 'Traditional',
    description: 'नाना-नानी का आशीर्वाद, मामा का स्नेह भरा मायरा संग लाया,\nबिनौली की शाही शाम में दूल्हे राजा का रूप है सजाया।\nननिहाल के दुलार और खुशियों से महक उठा है दूल्हे का आँगन...\nमायरा व बिनौली समारोह में आप सभी का है हार्दिक अभिनंदन!',
  },
  {
    name: 'Wedding Day',
    date: '3 December 2026',
    dressCode: 'Ethnic',
    description: 'अग्नि के सात फेरे और सात वचनों का मान हुआ,\nसिंदूरी रस्मों से देखो, पावन यह परिणय महान हुआ।\nसात जन्मों की इस डोरी में बँधे जो दो प्राण,\nस्नेह और संस्कारों से महक उठा सारा जहान।',
  },
];

export const EventsSection: React.FC<Props> = ({ events }) => {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const sortedEvents = [...events].sort((a, b) => a.order_index - b.order_index).slice(0, 4);
  const orderedEvents: WeddingEvent[] = ceremonyDetails.map((details, index) => sortedEvents[index] || ({
    id: `default-event-${index + 1}`,
    name: details.name,
    slug: details.name.toLowerCase().replace(/ /g, '-'),
    event_date: null,
    start_time: null,
    end_time: null,
    venue_name: 'Details Coming Soon',
    address: 'Details Coming Soon',
    description: details.description,
    dress_code: details.dressCode,
    image_url: null,
    secondary_image_url: null,
    google_maps_url: null,
    order_index: index + 1,
  }));

  const openLightbox = (images: string[], index: number) => setLightbox({ images, index });
  const moveLightbox = (direction: -1 | 1) => {
    setLightbox((current) => current && ({
      ...current,
      index: (current.index + direction + current.images.length) % current.images.length,
    }));
  };

  return (
    <section id="events" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mb-16 text-center">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-royalty-gold">Sacred Ceremonies</p>
        <h2 className="font-serif text-3xl font-bold text-royalty-champagne sm:text-5xl">Wedding Events</h2>
        <div className="mx-auto mt-4 h-0.5 w-20 bg-royalty-gold" />
      </div>

      <div className="grid gap-7 md:grid-cols-2">
        {orderedEvents.map((event, index) => {
          const details = ceremonyDetails[index];
          const isMandwa = index === 2;
          const isWedding = index === 3;
          const isWide = isMandwa || isWedding;
          const photos: Array<{ url: string | null; label: string }> = isMandwa
            ? [
                { url: event.image_url, label: 'Mandwa' },
                { url: event.secondary_image_url, label: 'Binoli' },
              ]
            : [{ url: event.image_url || weddingPhotos.events[index], label: details.name }];

          return (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className={`group overflow-hidden rounded-3xl border bg-royalty-deepMaroon/80 shadow-xl transition-all duration-300 ${
                isWide
                  ? 'border-royalty-gold/60 md:col-span-2'
                  : 'border-royalty-gold/25 hover:border-royalty-gold/70'
              }`}
            >
              <div className={isWide ? 'grid md:grid-cols-[1.08fr_0.92fr]' : ''}>
                <div className={`relative grid overflow-hidden bg-gradient-to-br from-royalty-burgundy via-royalty-deepMaroon to-black ${isMandwa ? 'grid-cols-2 gap-2 p-2' : ''} ${isWide ? 'min-h-72 md:min-h-[27rem]' : 'h-60 sm:h-72'}`}>
                  {photos.map((photo, photoIndex) => (
                    <button
                      key={`${event.id}-${photo.label}`}
                      type="button"
                      onClick={() => {
                        const availablePhotos = photos.flatMap((item) => item.url ? [item.url] : []);
                        const selectedIndex = photos.slice(0, photoIndex).filter((item) => item.url).length;
                        if (photo.url) openLightbox(availablePhotos, selectedIndex);
                      }}
                      className={`group/photo relative h-full min-h-56 w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-royalty-gold ${!photo.url ? 'cursor-default' : ''}`}
                      aria-label={photo.url ? `View ${photo.label} photo` : `${photo.label} photo can be uploaded from the admin page`}
                    >
                      {photo.url ? (
                        <>
                          <img
                            src={photo.url}
                            alt={`${photo.label} ceremony`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-70 transition-opacity group-hover/photo:opacity-100" />
                          {isMandwa && (
                            <span className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                              {photo.label}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-royalty-deepMaroon/65 text-royalty-gold/85">
                          <ImagePlus className="h-8 w-8 sm:h-10 sm:w-10" />
                          <span className="text-center text-[10px] uppercase tracking-[0.16em] sm:text-xs">
                            Add {photo.label} photo<br />in Admin → Ceremony Events
                          </span>
                        </span>
                      )}
                    </button>
                  ))}
                  {isMandwa && (
                    <span className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 rounded-full border border-royalty-gold/30 bg-royalty-deepMaroon/85 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-royalty-champagne shadow-lg backdrop-blur-sm">
                      Two ceremonies · two photos
                    </span>
                  )}
                  {isWedding && (
                    <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-royalty-gold/60 bg-royalty-deepMaroon/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-royalty-gold backdrop-blur-sm">
                      <Sparkles className="h-4 w-4" />
                      The big day
                    </div>
                  )}
                </div>

                <div className={`flex flex-col p-6 sm:p-9 ${isWide ? 'justify-center' : ''}`}>
                  <div className="mb-5 flex items-center justify-between">
                    <span className="rounded-full border border-royalty-gold/30 bg-royalty-maroon/50 px-3 py-1 text-xs font-serif uppercase tracking-widest text-royalty-gold">
                      {isWedding ? 'Wedding Ceremony' : isMandwa ? 'Two Sacred Ceremonies' : `Celebration ${index + 1}`}
                    </span>
                    {isWedding && <Sparkles className="h-5 w-5 text-royalty-gold" />}
                  </div>

                  <h3 className={`mb-3 font-serif font-bold text-royalty-champagne ${isWide ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
                    {details.name}
                  </h3>
                  <p className={`mb-6 max-w-xl text-sm leading-relaxed text-royalty-warmBeige/75 ${
                    'font-hindi whitespace-pre-line leading-8'
                  }`}>
                    {details.description}
                  </p>

                  <div className="mb-5 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-royalty-gold/20 bg-royalty-burgundy/30 px-4 py-3">
                      <Calendar className="h-5 w-5 shrink-0 text-royalty-gold" />
                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-royalty-warmBeige/55">Date</span>
                        <span className="font-serif text-sm text-royalty-champagne">{details.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-royalty-gold/20 bg-royalty-burgundy/30 px-4 py-3">
                      <Shirt className="h-5 w-5 shrink-0 text-royalty-gold" />
                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-royalty-warmBeige/55">Dress code</span>
                        <span className="font-serif text-sm text-royalty-champagne">{details.dressCode}</span>
                      </div>
                    </div>
                  </div>

                  {event.venue_name && event.venue_name !== 'Details Coming Soon' && (
                    <div className="mb-5 flex items-start gap-3 text-sm text-royalty-warmBeige/85">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royalty-gold" />
                      <div>
                        <strong className="block text-royalty-champagne">{event.venue_name}</strong>
                        {event.address && event.address !== 'Details Coming Soon' && (
                          <span className="text-xs text-royalty-warmBeige/70">{event.address}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {event.google_maps_url ? (
                    <a
                      href={event.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl border border-royalty-gold/50 px-4 py-3 font-serif text-xs uppercase tracking-wider text-royalty-gold transition-colors hover:bg-royalty-gold hover:text-royalty-deepMaroon"
                    >
                      Get Directions <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <p className="mt-auto text-center text-xs italic text-royalty-gold/50">Venue directions will be updated shortly</p>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label="Close photo"
            >
              <X className="h-6 w-6" />
            </button>
            {lightbox.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); moveLightbox(-1); }}
                  className="absolute left-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-8"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); moveLightbox(1); }}
                  className="absolute right-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-8"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <img
              src={lightbox.images[lightbox.index]}
              alt="Wedding ceremony"
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
