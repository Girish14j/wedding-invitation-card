-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. WEBSITE SETTINGS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_title TEXT NOT NULL DEFAULT 'Khushal & Bhanupriya – A Celebration of Love',
    groom_name TEXT NOT NULL DEFAULT 'Khushal Joshi',
    bride_name TEXT NOT NULL DEFAULT 'Bhanupriya Joshi',
    wedding_date DATE NOT NULL DEFAULT '2026-12-03',
    wedding_date_display TEXT NOT NULL DEFAULT '03.12.2026',
    whatsapp_number TEXT NOT NULL DEFAULT '+919876543210',
    contact_email TEXT DEFAULT 'contact@khushal-bhanupriya.com',
    hero_quote TEXT DEFAULT 'Together with their families, invite you to celebrate their sacred union.',
    hero_image_url TEXT,
    background_music_url TEXT DEFAULT 'https://actions.google.com/sounds/v1/ambient/relaxing_flute_stream.ogg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.website_settings
    ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

----------------------------------------------------
-- 2. EVENTS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    event_date DATE,
    start_time TEXT,
    end_time TEXT,
    venue_name TEXT DEFAULT 'Details Coming Soon',
    address TEXT DEFAULT 'Details Coming Soon',
    description TEXT,
    dress_code TEXT DEFAULT 'Traditional Royal Attire',
    image_url TEXT,
    secondary_image_url TEXT,
    google_maps_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.events
    ADD COLUMN IF NOT EXISTS secondary_image_url TEXT;

----------------------------------------------------
-- 3. COUPLE STORY
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.couple_story (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_image_url TEXT,
    groom_bio TEXT NOT NULL,
    groom_image_url TEXT,
    bride_bio TEXT NOT NULL,
    bride_image_url TEXT,
    story_narrative TEXT NOT NULL,
    timeline JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.couple_story
    ADD COLUMN IF NOT EXISTS couple_image_url TEXT;

----------------------------------------------------
-- 4. FAMILY MEMBERS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    side TEXT CHECK (side IN ('groom', 'bride')) NOT NULL,
    relation TEXT NOT NULL,
    description TEXT,
    photo_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

----------------------------------------------------
-- 5. GALLERY ALBUMS & IMAGES
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES public.gallery_albums(id) ON DELETE SET NULL,
    title TEXT,
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    width INT,
    height INT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

----------------------------------------------------
-- 6. WEDDING WISHES
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wedding_wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_name TEXT NOT NULL,
    relationship TEXT,
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

----------------------------------------------------
-- 7. RSVPS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    attending TEXT CHECK (attending IN ('attending', 'declined')) NOT NULL,
    guest_count INT DEFAULT 1,
    selected_events TEXT[] DEFAULT ARRAY[]::TEXT[],
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

----------------------------------------------------
-- SEED INITIAL DATA
----------------------------------------------------
INSERT INTO public.website_settings (id, site_title, groom_name, bride_name, wedding_date, wedding_date_display, whatsapp_number, hero_quote)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Khushal & Bhanupriya – A Celebration of Love',
    'Khushal Joshi',
    'Bhanupriya Joshi',
    '2026-12-03',
    '03.12.2026',
    '+919876543210',
    'With hearts full of joy and devotion, we invite you to honor our sacred journey into love and companionship.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.events (name, slug, event_date, start_time, end_time, venue_name, address, description, dress_code, order_index)
VALUES 
('Dora Bandhan', 'dora-bandhan', '2026-10-27', NULL, NULL, 'Details Coming Soon', 'Details Coming Soon', 'डोरे की हर गांठ में छुपा है अपनों का दुलार,
सुरक्षा और शुभकामनाओं से सजा दूल्हे का संसार।
आइए, मिलकर बांधें प्यार का यह पावन धागा...
और करें खुशियों से भरी नई शुरुआत!', 'Orange', 1),
('Haldi & Sangeet', 'haldi-sangeet', '2026-11-29', NULL, NULL, 'Details Coming Soon', 'Details Coming Soon', 'हल्दी की रंगत चमकेगी, संग बजेगी डीजे की बीट,
लड़केवालों के आँगन में मचेगा धमाल और हसीन संगीत।
नाचेंगे, गाएंगे और उड़ेंगे पीले रंगों के गुलाल...
हमारी ''Haldi & DJ Night'' में आप सभी का स्वागत है बेमिसाल!', 'Lavender', 2),
('Mandwa & Binoli', 'mandwa-binoli', '2026-12-01', NULL, NULL, 'Details Coming Soon', 'Details Coming Soon', 'नाना-नानी का आशीर्वाद, मामा का स्नेह भरा मायरा संग लाया,
बिनौली की शाही शाम में दूल्हे राजा का रूप है सजाया।
ननिहाल के दुलार और खुशियों से महक उठा है दूल्हे का आँगन...
मायरा व बिनौली समारोह में आप सभी का है हार्दिक अभिनंदन!', 'Traditional', 3),
('Wedding Day', 'wedding-day', '2026-12-03', NULL, NULL, 'Details Coming Soon', 'Details Coming Soon', 'अग्नि के सात फेरे और सात वचनों का मान हुआ,
सिंदूरी रस्मों से देखो, पावन यह परिणय महान हुआ।
सात जन्मों की इस डोरी में बँधे जो दो प्राण,
स्नेह और संस्कारों से महक उठा सारा जहान।', 'Ethnic', 4)
ON CONFLICT DO NOTHING;

UPDATE public.events
SET name = 'Dora Bandhan', slug = 'dora-bandhan', event_date = '2026-10-27',
    dress_code = 'Orange', description = 'डोरे की हर गांठ में छुपा है अपनों का दुलार,
सुरक्षा और शुभकामनाओं से सजा दूल्हे का संसार।
आइए, मिलकर बांधें प्यार का यह पावन धागा...
और करें खुशियों से भरी नई शुरुआत!'
WHERE order_index = 1;

UPDATE public.events
SET name = 'Haldi & Sangeet', slug = 'haldi-sangeet', event_date = '2026-11-29',
    dress_code = 'Lavender', description = 'हल्दी की रंगत चमकेगी, संग बजेगी डीजे की बीट,
लड़केवालों के आँगन में मचेगा धमाल और हसीन संगीत।
नाचेंगे, गाएंगे और उड़ेंगे पीले रंगों के गुलाल...
हमारी ''Haldi & DJ Night'' में आप सभी का स्वागत है बेमिसाल!'
WHERE order_index = 2;

UPDATE public.events
SET name = 'Mandwa & Binoli', slug = 'mandwa-binoli', event_date = '2026-12-01',
    dress_code = 'Traditional', description = 'नाना-नानी का आशीर्वाद, मामा का स्नेह भरा मायरा संग लाया,
बिनौली की शाही शाम में दूल्हे राजा का रूप है सजाया।
ननिहाल के दुलार और खुशियों से महक उठा है दूल्हे का आँगन...
मायरा व बिनौली समारोह में आप सभी का है हार्दिक अभिनंदन!'
WHERE order_index = 3;

UPDATE public.events
SET name = 'Wedding Day', slug = 'wedding-day', event_date = '2026-12-03',
    dress_code = 'Ethnic', description = 'अग्नि के सात फेरे और सात वचनों का मान हुआ,
सिंदूरी रस्मों से देखो, पावन यह परिणय महान हुआ।
सात जन्मों की इस डोरी में बँधे जो दो प्राण,
स्नेह और संस्कारों से महक उठा सारा जहान।'
WHERE order_index = 4;

INSERT INTO public.couple_story (id, groom_bio, bride_bio, story_narrative, timeline)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'A passionate innovator with deep reverence for culture, Khushal is known for his warmth, intellect, and dedication to his family and dreams.',
    'Graceful, artistic, and deeply compassionate, Bhanupriya brings light, wisdom, and joy to everyone fortunate enough to know her.',
    'What began as a meeting blessed by family traditions transformed into a profound communion of minds and hearts. Through seasons of shared laughter, quiet conversations, and mutual aspirations, Khushal and Bhanupriya realized they were not merely companions, but each other''s sacred home.',
    '[
        {"year": "First Chapter", "title": "When Destinies Aligned", "text": "Their first meeting was framed by ancestral blessings and an effortless conversation that lingered long into the dusk."},
        {"year": "The Bond", "title": "Journeys & Milestones", "text": "Deep conversations over chai, shared ambitions, and discovering an unspoken rhythm of mutual trust."},
        {"year": "The Roka", "title": "Two Families, One Heart", "text": "Surrounded by loved ones, their commitment was solemnized with sacred sweet offerings and pure joy."},
        {"year": "03.12.2026", "title": "The Royal Wedding", "text": "Beginning their lifetime of love and shared destiny under the canopy of stars and blessings."}
    ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gallery_albums (name, slug, order_index)
VALUES 
('All Photos', 'all', 0),
('Engagement', 'engagement', 1),
('Pre-Wedding Moments', 'pre-wedding', 2)
ON CONFLICT (slug) DO NOTHING;

----------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
----------------------------------------------------
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_story ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view website settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public can view couple story" ON public.couple_story FOR SELECT USING (true);
CREATE POLICY "Public can view family members" ON public.family_members FOR SELECT USING (true);
CREATE POLICY "Public can view gallery albums" ON public.gallery_albums FOR SELECT USING (true);
CREATE POLICY "Public can view gallery images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Public can view approved wishes" ON public.wedding_wishes FOR SELECT USING (is_approved = true);

CREATE POLICY "Public can submit wedding wishes" ON public.wedding_wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit rsvp" ON public.rsvps FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins have full access to settings" ON public.website_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to events" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to couple story" ON public.couple_story FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to family members" ON public.family_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to gallery albums" ON public.gallery_albums FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to gallery images" ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to wishes" ON public.wedding_wishes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to rsvps" ON public.rsvps FOR ALL TO authenticated USING (true) WITH CHECK (true);

----------------------------------------------------
-- 9. SUPABASE STORAGE BUCKETS & POLICIES
----------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
('wedding-gallery', 'wedding-gallery', true),
('family-photos', 'family-photos', true),
('event-images', 'event-images', true),
('wedding-music', 'wedding-music', true),
('website-assets', 'website-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read storage wedding-gallery" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-gallery');
CREATE POLICY "Admin write storage wedding-gallery" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'wedding-gallery') WITH CHECK (bucket_id = 'wedding-gallery');

CREATE POLICY "Public read storage family-photos" ON storage.objects FOR SELECT USING (bucket_id = 'family-photos');
CREATE POLICY "Admin write storage family-photos" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'family-photos') WITH CHECK (bucket_id = 'family-photos');

CREATE POLICY "Public read storage event-images" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Admin write storage event-images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'event-images') WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Public read storage wedding-music" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-music');
CREATE POLICY "Admin write storage wedding-music" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'wedding-music') WITH CHECK (bucket_id = 'wedding-music');

CREATE POLICY "Public read storage website-assets" ON storage.objects FOR SELECT USING (bucket_id = 'website-assets');
CREATE POLICY "Admin write storage website-assets" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'website-assets') WITH CHECK (bucket_id = 'website-assets');
