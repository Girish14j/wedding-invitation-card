import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryImage } from '../../types/database.types';
import { weddingPhotos } from '../../lib/weddingPhotos';

interface Props {
  images: GalleryImage[];
}

export const GallerySection: React.FC<Props> = ({ images }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages: GalleryImage[] = images.length > 0
    ? images
    : weddingPhotos.gallery.map((photo, index) => ({
        id: `sample-${index}`,
        album_id: null,
        title: photo.title,
        image_url: photo.imageUrl,
        storage_path: '',
        order_index: index,
      }));

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <section id="gallery" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-royalty-gold font-sans mb-2">Timeless Memories</p>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-royalty-champagne">Photo Gallery</h2>
        <div className="w-20 h-0.5 bg-royalty-gold mx-auto mt-4" />
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-16 text-royalty-warmBeige/60 font-sans italic">
          Photographs will be uploaded soon to this royal collection.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
            whileHover={{ y: -5 }}
              onClick={() => openLightbox(index)}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-royalty-gold/20 group shadow-lg"
            >
              <img
                src={image.image_url}
                alt={image.title || 'Wedding moment'}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royalty-deepMaroon/75 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="font-serif text-sm text-royalty-champagne">{image.title || 'A wedding moment'}</span>
                <Maximize2 className="w-5 h-5 text-royalty-gold shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <img
                src={filteredImages[lightboxIndex].image_url}
                alt={filteredImages[lightboxIndex].title || ''}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
              {filteredImages[lightboxIndex].title && (
                <p className="mt-4 text-center font-serif text-royalty-gold text-lg">
                  {filteredImages[lightboxIndex].title}
                </p>
              )}
            </div>

            <button
              onClick={nextImage}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
