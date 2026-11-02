import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  ExternalLink,
  Calendar,
  ImagePlus,
  Image,
  Images,
  Music,
  Trash2,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSupabaseErrorMessage, supabase, uploadFileToBucket } from '../lib/supabase';
import { WeddingEvent, CoupleStory, WebsiteSettings, GalleryImage } from '../types/database.types';

export const AdminDashboardPage: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'events' | 'couple' | 'hero' | 'gallery' | 'music'>('events');

  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [coupleStory, setCoupleStory] = useState<CoupleStory | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [isUploadingHeroPhoto, setIsUploadingHeroPhoto] = useState(false);
  const [heroPhotoError, setHeroPhotoError] = useState('');
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [musicError, setMusicError] = useState('');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  const [deletingGalleryImage, setDeletingGalleryImage] = useState<string | null>(null);
  const [uploadingEventPhoto, setUploadingEventPhoto] = useState<string | null>(null);
  const [eventPhotoError, setEventPhotoError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [{ data: eData }, { data: storyData }, { data: settingsData }, { data: galleryData }] = await Promise.all([
        supabase.from('events').select('*').order('order_index', { ascending: true }),
        supabase.from('couple_story').select('*').limit(1).single(),
        supabase.from('website_settings').select('*').limit(1).single(),
        supabase.from('gallery_images').select('*').order('order_index', { ascending: true }),
      ]);

      if (eData) setEvents(eData);
      if (storyData) setCoupleStory(storyData);
      if (settingsData) setWebsiteSettings(settingsData);
      if (galleryData) setGalleryImages(galleryData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const uploadCouplePhoto = async (file: File) => {
    if (!coupleStory) {
      setPhotoError('Couple story could not be loaded. Please refresh and try again.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('Please choose an image smaller than 10 MB.');
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoError('');
    try {
      const { publicUrl } = await uploadFileToBucket('website-assets', file, 'couple');
      const { data, error } = await supabase
        .from('couple_story')
        .update({ couple_image_url: publicUrl })
        .eq('id', coupleStory.id)
        .select('*')
        .single();

      if (error) throw error;
      setCoupleStory(data);
    } catch (error) {
      const message = getSupabaseErrorMessage(error);
      setPhotoError(
        message.includes('couple_image_url')
          ? 'The database is missing couple_image_url. In Supabase SQL Editor run: ALTER TABLE public.couple_story ADD COLUMN IF NOT EXISTS couple_image_url TEXT; NOTIFY pgrst, \'reload schema\'; Then refresh this admin page and try again.'
          : `Could not upload the couple photo: ${message}`
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const uploadHeroPhoto = async (file: File) => {
    if (!websiteSettings) {
      setHeroPhotoError('Website settings could not be loaded. Refresh the page and try again.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setHeroPhotoError('Please choose an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setHeroPhotoError('Please choose an image smaller than 10 MB.');
      return;
    }

    setIsUploadingHeroPhoto(true);
    setHeroPhotoError('');
    try {
      const { publicUrl } = await uploadFileToBucket('website-assets', file, 'hero');
      const { data, error } = await supabase
        .from('website_settings')
        .update({ hero_image_url: publicUrl })
        .eq('id', websiteSettings.id)
        .select('*')
        .single();

      if (error) throw error;
      setWebsiteSettings(data);
    } catch (error) {
      const message = getSupabaseErrorMessage(error);
      setHeroPhotoError(
        message.toLowerCase().includes('hero_image_url')
          ? 'Supabase is missing the hero image column. In Supabase SQL Editor run: ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT; NOTIFY pgrst, \'reload schema\'; Then refresh this admin page.'
          : `Could not upload the hero photo: ${message}`
      );
    } finally {
      setIsUploadingHeroPhoto(false);
    }
  };

  const uploadGalleryPhotos = async (files: File[]) => {
    const invalidFile = files.find((file) => !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024);
    if (invalidFile) {
      setGalleryError(
        !invalidFile.type.startsWith('image/')
          ? `${invalidFile.name} is not an image file.`
          : `${invalidFile.name} is larger than 10 MB.`
      );
      return;
    }

    setIsUploadingGallery(true);
    setGalleryError('');
    const uploadedImages: GalleryImage[] = [];
    let orderIndex = galleryImages.reduce((maxIndex, image) => Math.max(maxIndex, image.order_index), -1) + 1;
    try {
      for (const file of files) {
        const { publicUrl, path } = await uploadFileToBucket('wedding-gallery', file, 'gallery');
        const { data, error } = await supabase
          .from('gallery_images')
          .insert({
            album_id: null,
            title: file.name.replace(/\.[^.]+$/, ''),
            image_url: publicUrl,
            storage_path: path,
            order_index: orderIndex++,
          })
          .select('*')
          .single();

        if (error) throw error;
        uploadedImages.push(data);
      }

      setGalleryImages((currentImages) => [...currentImages, ...uploadedImages]);
    } catch (error) {
      if (uploadedImages.length > 0) {
        setGalleryImages((currentImages) => [...currentImages, ...uploadedImages]);
      }
      const message = getSupabaseErrorMessage(error);
      setGalleryError(
        uploadedImages.length > 0
          ? `Uploaded ${uploadedImages.length} photo(s), but couldn't finish the rest: ${message}`
          : `Could not upload gallery photos: ${message}`
      );
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const deleteGalleryPhoto = async (image: GalleryImage) => {
    if (!window.confirm(`Delete "${image.title || 'this gallery photo'}"? This cannot be undone.`)) return;

    setDeletingGalleryImage(image.id);
    setGalleryError('');
    try {
      const { error } = await supabase.from('gallery_images').delete().eq('id', image.id);
      if (error) throw error;

      setGalleryImages((currentImages) => currentImages.filter((current) => current.id !== image.id));

      if (image.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('wedding-gallery')
          .remove([image.storage_path]);
        if (storageError) {
          setGalleryError(`Photo removed from the gallery, but its stored file could not be deleted: ${storageError.message}`);
        }
      }
    } catch (error) {
      setGalleryError(`Could not delete the gallery photo: ${getSupabaseErrorMessage(error)}`);
    } finally {
      setDeletingGalleryImage(null);
    }
  };

  const uploadWeddingMusic = async (file: File) => {
    if (!websiteSettings) {
      setMusicError('Website settings could not be loaded. Refresh the page and try again.');
      return;
    }
    const isMp4Audio = /\.(m4a|mp4)$/i.test(file.name);
    if (!file.type.startsWith('audio/') && !isMp4Audio) {
      setMusicError('Please choose an audio file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setMusicError('Please choose an audio file smaller than 20 MB.');
      return;
    }

    setIsUploadingMusic(true);
    setMusicError('');
    try {
      const { publicUrl } = await uploadFileToBucket(
        'wedding-music',
        file,
        'background',
        isMp4Audio ? 'audio/mp4' : undefined
      );
      const { data, error } = await supabase
        .from('website_settings')
        .update({ background_music_url: publicUrl })
        .eq('id', websiteSettings.id)
        .select('*')
        .single();

      if (error) throw error;
      setWebsiteSettings(data);
    } catch (error) {
      setMusicError(`Could not upload the music: ${getSupabaseErrorMessage(error)}`);
    } finally {
      setIsUploadingMusic(false);
    }
  };

  const uploadEventPhoto = async (
    event: WeddingEvent,
    file: File,
    imageField: 'image_url' | 'secondary_image_url'
  ) => {
    if (!file.type.startsWith('image/')) {
      setEventPhotoError('Please choose an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setEventPhotoError('Please choose an image smaller than 10 MB.');
      return;
    }

    const uploadKey = `${event.id}-${imageField}`;
    setUploadingEventPhoto(uploadKey);
    setEventPhotoError('');
    try {
      const { publicUrl } = await uploadFileToBucket('event-images', file, `event-${event.order_index}`);
      const imageUpdate = imageField === 'image_url'
        ? { image_url: publicUrl }
        : { secondary_image_url: publicUrl };
      const { data, error } = await supabase
        .from('events')
        .update(imageUpdate)
        .eq('id', event.id)
        .select('*')
        .single();

      if (error) throw error;
      setEvents((currentEvents) => currentEvents.map((current) => current.id === data.id ? data : current));
    } catch (error) {
      const message = getSupabaseErrorMessage(error);
      setEventPhotoError(
        message.toLowerCase().includes('secondary_image_url')
          ? 'Supabase is missing the Binoli photo column. In your Supabase SQL Editor, run: ALTER TABLE public.events ADD COLUMN IF NOT EXISTS secondary_image_url TEXT; NOTIFY pgrst, \'reload schema\'; Then wait a few seconds, refresh this page, and upload the Binoli photo again.'
          : `Could not upload the event photo: ${message}`
      );
    } finally {
      setUploadingEventPhoto(null);
    }
  };

  return (
    <div className="min-h-screen bg-royalty-deepMaroon text-royalty-warmBeige flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-royalty-burgundy/80 border-r border-royalty-gold/30 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h2 className="font-serif text-xl font-bold text-royalty-gold">Royal CMS</h2>
            <p className="text-xs text-royalty-champagne/60 font-sans">Khushal &amp; Bhanupriya</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-colors ${
                activeTab === 'events' ? 'bg-royalty-gold text-royalty-deepMaroon font-bold' : 'hover:bg-royalty-maroon/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Ceremony Events</span>
            </button>

            <button
              onClick={() => setActiveTab('couple')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-colors ${
                activeTab === 'couple' ? 'bg-royalty-gold text-royalty-deepMaroon font-bold' : 'hover:bg-royalty-maroon/50'
              }`}
            >
              <ImagePlus className="w-4 h-4" />
              <span>Couple Photo</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-colors ${
                activeTab === 'hero' ? 'bg-royalty-gold text-royalty-deepMaroon font-bold' : 'hover:bg-royalty-maroon/50'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Hero Photo</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-colors ${
                activeTab === 'gallery' ? 'bg-royalty-gold text-royalty-deepMaroon font-bold' : 'hover:bg-royalty-maroon/50'
              }`}
            >
              <Images className="w-4 h-4" />
              <span>Photo Gallery ({galleryImages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-colors ${
                activeTab === 'music' ? 'bg-royalty-gold text-royalty-deepMaroon font-bold' : 'hover:bg-royalty-maroon/50'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Wedding Music</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-royalty-gold/20 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-royalty-champagne hover:text-royalty-gold transition-colors py-2 px-3"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={() => signOut().then(() => navigate('/admin/login'))}
            className="w-full flex items-center gap-2 text-xs text-red-300 hover:text-red-100 py-2 px-3 rounded-lg hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'events' && (
          <div>
            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-royalty-champagne">Ceremony Photos</h1>
              <p className="text-xs text-royalty-warmBeige/60">
                Upload photos for each ceremony. Mandwa and Binoli have separate photo slots.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { index: 1, name: 'Dora Bandhan', date: '27 October 2026', dressCode: 'Orange' },
                { index: 2, name: 'Haldi & Sangeet', date: '29 November 2026', dressCode: 'Lavender' },
                { index: 3, name: 'Mandwa & Binoli', date: '1 December 2026', dressCode: 'Traditional' },
                { index: 4, name: 'Wedding Day', date: '3 December 2026', dressCode: 'Ethnic' },
              ].map((details) => {
                const evt = events.find((event) => event.order_index === details.index);
                return (
                    <div key={details.index} className="rounded-2xl border border-royalty-gold/30 bg-royalty-burgundy/40 p-6">
                      <h3 className="mb-3 font-serif text-xl font-bold text-royalty-gold">{details.name}</h3>
                      <div className="grid gap-4 text-xs sm:grid-cols-2">
                        <div>
                          <span className="block font-semibold text-royalty-champagne/70">Date:</span>
                          <p>{details.date}</p>
                        </div>
                        <div>
                          <span className="block font-semibold text-royalty-champagne/70">Dress code:</span>
                          <p>{details.dressCode}</p>
                        </div>
                      </div>
                      {evt ? (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          {(details.index === 3
                            ? [
                                { field: 'image_url' as const, label: 'Mandwa Photo' },
                                { field: 'secondary_image_url' as const, label: 'Binoli Photo' },
                              ]
                            : [{ field: 'image_url' as const, label: 'Event Photo' }]
                          ).map(({ field, label }) => {
                            const uploadKey = `${evt.id}-${field}`;
                            const currentImage = evt[field];
                            return (
                              <div key={field} className="rounded-xl border border-royalty-gold/20 bg-royalty-deepMaroon/40 p-4">
                                <p className="mb-2 text-xs font-semibold text-royalty-champagne">{label}</p>
                                {currentImage && (
                                  <img src={currentImage} alt={`${label} preview`} className="mb-3 h-32 w-full rounded-lg object-cover" />
                                )}
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-royalty-gold/40 px-4 py-2 text-xs font-semibold text-royalty-gold transition-colors hover:bg-royalty-gold hover:text-royalty-deepMaroon">
                                  <Upload className="h-4 w-4" />
                                  <span>{uploadingEventPhoto === uploadKey ? 'Uploading…' : currentImage ? `Replace ${label}` : `Upload ${label}`}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingEventPhoto !== null}
                                    className="sr-only"
                                    onChange={(inputEvent) => {
                                      const file = inputEvent.currentTarget.files?.[0];
                                      inputEvent.currentTarget.value = '';
                                      if (file) void uploadEventPhoto(evt, file, field);
                                    }}
                                  />
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="mt-5 text-xs text-amber-200">
                          This event is not in the database yet. Run the events migration in README.md to enable its photo upload.
                        </p>
                      )}
                      {eventPhotoError && <p role="alert" className="mt-3 text-sm text-red-300">{eventPhotoError}</p>}
                    </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'couple' && (
          <div className="max-w-3xl">
            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-royalty-champagne">Couple Photo</h1>
              <p className="text-xs text-royalty-warmBeige/60">
                Upload one portrait to use as the shared background in the Our Story section. JPG, PNG, or WebP up to 10 MB.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-royalty-gold/30 bg-royalty-burgundy/30">
              {coupleStory?.couple_image_url ? (
                <img
                  src={coupleStory.couple_image_url}
                  alt="Current couple portrait"
                  className="max-h-[75vh] w-full bg-royalty-deepMaroon object-contain"
                />
              ) : (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-royalty-gold/70">
                  <ImagePlus className="h-12 w-12" />
                  <span className="text-sm">No couple photo uploaded yet</span>
                </div>
              )}

              <div className="p-6">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-royalty-gold px-5 py-3 font-serif text-xs font-bold uppercase tracking-wider text-royalty-deepMaroon transition-colors hover:bg-yellow-400">
                  <Upload className="h-4 w-4" />
                  <span>{isUploadingPhoto ? 'Uploading…' : coupleStory?.couple_image_url ? 'Replace Photo' : 'Upload Couple Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingPhoto}
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      event.currentTarget.value = '';
                      if (file) void uploadCouplePhoto(file);
                    }}
                  />
                </label>
                {photoError && <p role="alert" className="mt-4 text-sm text-red-300">{photoError}</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-royalty-champagne">Hero Photo</h1>
              <p className="text-xs text-royalty-warmBeige/60">
                This image appears behind the names at the top of the homepage. JPG, PNG, or WebP up to 10 MB.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-royalty-gold/30 bg-royalty-burgundy/30">
              <img
                src={websiteSettings?.hero_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85'}
                alt="Current homepage hero background"
                className="h-64 w-full object-cover sm:h-96"
              />
              <div className="p-6">
                <p className="mb-4 text-xs text-royalty-warmBeige/70">
                  {websiteSettings?.hero_image_url ? 'Your uploaded hero photo is active.' : 'The default photo is currently active.'}
                </p>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-royalty-gold px-5 py-3 font-serif text-xs font-bold uppercase tracking-wider text-royalty-deepMaroon transition-colors hover:bg-yellow-400">
                  <Upload className="h-4 w-4" />
                  <span>{isUploadingHeroPhoto ? 'Uploading…' : websiteSettings?.hero_image_url ? 'Replace Hero Photo' : 'Upload Hero Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingHeroPhoto}
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      event.currentTarget.value = '';
                      if (file) void uploadHeroPhoto(file);
                    }}
                  />
                </label>
                {heroPhotoError && <p role="alert" className="mt-4 text-sm text-red-300">{heroPhotoError}</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="max-w-5xl">
            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-royalty-champagne">Photo Gallery</h1>
              <p className="text-xs text-royalty-warmBeige/60">
                Upload one or more photos to show them in the website gallery. JPG, PNG, or WebP up to 10 MB each.
              </p>
            </div>

            <div className="mb-8 rounded-2xl border border-royalty-gold/30 bg-royalty-burgundy/30 p-6">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-royalty-gold px-5 py-3 font-serif text-xs font-bold uppercase tracking-wider text-royalty-deepMaroon transition-colors hover:bg-yellow-400">
                <Upload className="h-4 w-4" />
                <span>{isUploadingGallery ? 'Uploading photos…' : 'Upload Gallery Photos'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isUploadingGallery}
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(event.currentTarget.files || []);
                    event.currentTarget.value = '';
                    if (files.length > 0) void uploadGalleryPhotos(files);
                  }}
                />
              </label>
              <p className="mt-3 text-xs text-royalty-warmBeige/60">You can select multiple images at once.</p>
              {galleryError && <p role="alert" className="mt-4 text-sm text-red-300">{galleryError}</p>}
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {galleryImages.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-xl border border-royalty-gold/20 bg-royalty-burgundy/30">
                    <img src={image.image_url} alt={image.title || 'Wedding gallery photo'} className="aspect-[4/5] w-full object-cover" />
                    <div className="flex items-center justify-between gap-2 p-3">
                      <p className="truncate text-xs text-royalty-champagne">{image.title || 'Wedding moment'}</p>
                      <button
                        type="button"
                        onClick={() => void deleteGalleryPhoto(image)}
                        disabled={deletingGalleryImage !== null}
                        aria-label={`Delete ${image.title || 'gallery photo'}`}
                        title="Delete photo"
                        className="shrink-0 rounded-lg p-2 text-red-300 transition-colors hover:bg-red-950/60 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-royalty-gold/30 p-10 text-center text-sm text-royalty-warmBeige/60">
                No uploaded gallery photos yet.
              </div>
            )}
              </div>
        )}

        {activeTab === 'music' && (
              <div className="max-w-3xl">
                <div className="mb-8">
                  <h1 className="font-serif text-3xl font-bold text-royalty-champagne">Wedding Music</h1>
                  <p className="text-xs text-royalty-warmBeige/60">
                    Upload background music for the website. Audio files up to 20 MB are supported.
                  </p>
                </div>

                <div className="rounded-2xl border border-royalty-gold/30 bg-royalty-burgundy/30 p-6">
                  {websiteSettings?.background_music_url && (
                    <audio
                      key={websiteSettings.background_music_url}
                      controls
                      preload="none"
                      src={websiteSettings.background_music_url}
                      className="mb-5 w-full"
                    >
                      Your browser does not support audio playback.
                    </audio>
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-royalty-gold px-5 py-3 font-serif text-xs font-bold uppercase tracking-wider text-royalty-deepMaroon transition-colors hover:bg-yellow-400">
                    <Upload className="h-4 w-4" />
                    <span>{isUploadingMusic ? 'Uploading…' : websiteSettings?.background_music_url ? 'Replace Music' : 'Upload Music'}</span>
                    <input
                      type="file"
                      accept="audio/*,.m4a,.mp4"
                      disabled={isUploadingMusic}
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        event.currentTarget.value = '';
                        if (file) void uploadWeddingMusic(file);
                      }}
                    />
                  </label>
                  {musicError && <p role="alert" className="mt-4 text-sm text-red-300">{musicError}</p>}
                </div>
          </div>
        )}
      </main>
    </div>
  );
};
