import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useWeddingAudio } from '../context/AudioContext';
import {
  WebsiteSettings,
  WeddingEvent,
  CoupleStory,
  GalleryImage,
} from '../types/database.types';

import { RoyalCurtainEntrance } from '../components/public/RoyalCurtainEntrance';
import { HeroSection } from '../components/public/HeroSection';
import { CountdownSection } from '../components/public/CountdownSection';
import { OurStorySection } from '../components/public/OurStorySection';
import { EventsSection } from '../components/public/EventsSection';
import { FamilySection } from '../components/public/FamilySection';
import { GallerySection } from '../components/public/GallerySection';
import { WishesSection } from '../components/public/WishesSection';
import { AudioFloatingPlayer } from '../components/public/AudioFloatingPlayer';
import { PetalOverlay } from '../components/ui/PetalOverlay';
import { Footer } from '../components/public/Footer';

export const HomePage: React.FC = () => {
  const [curtainOpened, setCurtainOpened] = useState(false);

  const [settings, setSettings] = useState<WebsiteSettings>({
    id: 'default',
    site_title: 'Khushal & Bhanupriya – A Celebration of Love',
    groom_name: 'Khushal Joshi',
    bride_name: 'Bhanupriya Joshi',
    wedding_date: '2026-12-03',
    wedding_date_display: '03.12.2026',
    whatsapp_number: '+919876543210',
    contact_email: 'contact@khushal-bhanupriya.com',
    hero_quote: 'दो दिलों का मिलन, एक नया अध्याय,\nसात जन्मों का साथ, जो हमेशा निभाए।\nप्यार के इस पावन बंधन की शुरुआत यहाँ से होती है।',
    hero_image_url: null,
    background_music_url: 'https://actions.google.com/sounds/v1/ambient/relaxing_flute_stream.ogg',
  });

  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [story, setStory] = useState<CoupleStory | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);

  const { setTrackUrl, play } = useWeddingAudio();

  const loadData = async () => {
    try {
      const [
        { data: sData },
        { data: eData },
        { data: stData },
        { data: iData },
      ] = await Promise.all([
        supabase.from('website_settings').select('*').limit(1).single(),
        supabase.from('events').select('*').order('order_index', { ascending: true }),
        supabase.from('couple_story').select('*').limit(1).single(),
        supabase.from('gallery_images').select('*').order('order_index', { ascending: true }),
      ]);

      if (sData) {
        setSettings(sData);
        if (sData.background_music_url) {
          setTrackUrl(sData.background_music_url);
        }
      }
      if (eData) setEvents(eData);
      if (stData) setStory(stData);
      if (iData) setImages(iData);
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenInvitation = () => {
    setCurtainOpened(true);
    play();
  };

  const handleExploreScroll = () => {
    const el = document.getElementById('story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-royalty-deepMaroon text-royalty-warmBeige">
      <PetalOverlay />

      <RoyalCurtainEntrance
        isOpen={curtainOpened}
        onOpen={handleOpenInvitation}
        groomName={settings.groom_name}
        brideName={settings.bride_name}
        weddingDateDisplay={settings.wedding_date_display}
      />

      <main className={`${curtainOpened ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        <HeroSection
          groomName={settings.groom_name}
          brideName={settings.bride_name}
          weddingDateDisplay={settings.wedding_date_display}
          heroImageUrl={settings.hero_image_url}
          quote={'दो दिलों का मिलन, एक नया अध्याय,\nसात जन्मों का साथ, जो हमेशा निभाए।\nप्यार के इस पावन बंधन की शुरुआत यहाँ से होती है।'}
          onExploreClick={handleExploreScroll}
        />

        <CountdownSection targetDateIso={settings.wedding_date} />

        <OurStorySection
          story={story}
          groomName={settings.groom_name}
          brideName={settings.bride_name}
        />

        <EventsSection events={events} />

        <FamilySection />

        <GallerySection images={images} />

        <WishesSection />

        <Footer
          groomName={settings.groom_name}
          brideName={settings.bride_name}
          weddingDateDisplay={settings.wedding_date_display}
        />
      </main>

      <AudioFloatingPlayer />
    </div>
  );
};
