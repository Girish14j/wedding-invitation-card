export interface WebsiteSettings {
  id: string;
  site_title: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  wedding_date_display: string;
  whatsapp_number: string;
  contact_email: string;
  hero_quote: string;
  hero_image_url: string | null;
  background_music_url: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  slug: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  venue_name: string;
  address: string;
  description: string | null;
  dress_code: string | null;
  image_url: string | null;
  secondary_image_url: string | null;
  google_maps_url: string | null;
  order_index: number;
}

export interface StoryTimelineItem {
  year: string;
  title: string;
  text: string;
}

export interface CoupleStory {
  id: string;
  couple_image_url: string | null;
  groom_bio: string;
  groom_image_url: string | null;
  bride_bio: string;
  bride_image_url: string | null;
  story_narrative: string;
  timeline: StoryTimelineItem[];
}

export interface FamilyMember {
  id: string;
  name: string;
  side: 'groom' | 'bride';
  relation: string;
  description: string | null;
  photo_url: string | null;
  order_index: number;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  slug: string;
  order_index: number;
}

export interface GalleryImage {
  id: string;
  album_id: string | null;
  title: string | null;
  image_url: string;
  storage_path: string;
  order_index: number;
}

export interface WeddingWish {
  id: string;
  guest_name: string;
  relationship: string | null;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export interface RSVP {
  id: string;
  full_name: string;
  phone: string;
  attending: 'attending' | 'declined';
  guest_count: number;
  selected_events: string[];
  message: string | null;
  created_at: string;
}
