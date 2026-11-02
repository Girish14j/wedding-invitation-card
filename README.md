# Khushal & Bhanupriya – Royal Wedding Invitation & Management Suite

A premium, animated, full-stack Indian wedding invitation website built with:
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti
- **Backend**: Supabase (PostgreSQL, Storage, Auth, RLS)
- **Deployment**: Vercel

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and execute the entire contents of `supabase/schema.sql`.
   If your Supabase project already has the wedding schema, run this migration to apply the updated ceremony details and enable photo uploads:
   ```sql
   ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
   ALTER TABLE public.couple_story ADD COLUMN IF NOT EXISTS couple_image_url TEXT;
   ALTER TABLE public.events ADD COLUMN IF NOT EXISTS secondary_image_url TEXT;
   NOTIFY pgrst, 'reload schema';

   INSERT INTO storage.buckets (id, name, public)
   VALUES
     ('website-assets', 'website-assets', true),
     ('event-images', 'event-images', true),
     ('wedding-gallery', 'wedding-gallery', true),
     ('wedding-music', 'wedding-music', true),
     ('wedding-music', 'wedding-music', true)
   ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

   DO $$
   BEGIN
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Public read storage website-assets'
     ) THEN
       EXECUTE 'CREATE POLICY "Public read storage website-assets" ON storage.objects FOR SELECT USING (bucket_id = ''website-assets'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Admin write storage website-assets'
     ) THEN
       EXECUTE 'CREATE POLICY "Admin write storage website-assets" ON storage.objects FOR ALL TO authenticated USING (bucket_id = ''website-assets'') WITH CHECK (bucket_id = ''website-assets'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Public read storage event-images'
     ) THEN
       EXECUTE 'CREATE POLICY "Public read storage event-images" ON storage.objects FOR SELECT USING (bucket_id = ''event-images'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Admin write storage event-images'
     ) THEN
       EXECUTE 'CREATE POLICY "Admin write storage event-images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = ''event-images'') WITH CHECK (bucket_id = ''event-images'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Public read storage wedding-gallery'
     ) THEN
       EXECUTE 'CREATE POLICY "Public read storage wedding-gallery" ON storage.objects FOR SELECT USING (bucket_id = ''wedding-gallery'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Admin write storage wedding-gallery'
     ) THEN
       EXECUTE 'CREATE POLICY "Admin write storage wedding-gallery" ON storage.objects FOR ALL TO authenticated USING (bucket_id = ''wedding-gallery'') WITH CHECK (bucket_id = ''wedding-gallery'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Public read storage wedding-music'
     ) THEN
       EXECUTE 'CREATE POLICY "Public read storage wedding-music" ON storage.objects FOR SELECT USING (bucket_id = ''wedding-music'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Admin write storage wedding-music'
     ) THEN
       EXECUTE 'CREATE POLICY "Admin write storage wedding-music" ON storage.objects FOR ALL TO authenticated USING (bucket_id = ''wedding-music'') WITH CHECK (bucket_id = ''wedding-music'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Public read storage wedding-music'
     ) THEN
       EXECUTE 'CREATE POLICY "Public read storage wedding-music" ON storage.objects FOR SELECT USING (bucket_id = ''wedding-music'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Admin write storage wedding-music'
     ) THEN
       EXECUTE 'CREATE POLICY "Admin write storage wedding-music" ON storage.objects FOR ALL TO authenticated USING (bucket_id = ''wedding-music'') WITH CHECK (bucket_id = ''wedding-music'')';
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'gallery_images'
         AND policyname = 'Admins have full access to gallery images'
     ) THEN
       EXECUTE 'CREATE POLICY "Admins have full access to gallery images" ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true)';
     END IF;
   END $$;

   UPDATE public.events
   SET name = 'Dora Bandhan', slug = 'dora-bandhan', event_date = '2026-10-27', dress_code = 'Orange',
       description = 'डोरे की हर गांठ में छुपा है अपनों का दुलार,
   सुरक्षा और शुभकामनाओं से सजा दूल्हे का संसार।
   आइए, मिलकर बांधें प्यार का यह पावन धागा...
   और करें खुशियों से भरी नई शुरुआत!'
   WHERE order_index = 1;
   UPDATE public.events
   SET name = 'Haldi & Sangeet', slug = 'haldi-sangeet', event_date = '2026-11-29', dress_code = 'Lavender',
       description = 'हल्दी की रंगत चमकेगी, संग बजेगी डीजे की बीट,
   लड़केवालों के आँगन में मचेगा धमाल और हसीन संगीत।
   नाचेंगे, गाएंगे और उड़ेंगे पीले रंगों के गुलाल...
   हमारी ''Haldi & DJ Night'' में आप सभी का स्वागत है बेमिसाल!'
   WHERE order_index = 2;
   UPDATE public.events
   SET name = 'Mandwa & Binoli', slug = 'mandwa-binoli', event_date = '2026-12-01', dress_code = 'Traditional',
       description = 'नाना-नानी का आशीर्वाद, मामा का स्नेह भरा मायरा संग लाया,
   बिनौली की शाही शाम में दूल्हे राजा का रूप है सजाया।
   ननिहाल के दुलार और खुशियों से महक उठा है दूल्हे का आँगन...
   मायरा व बिनौली समारोह में आप सभी का है हार्दिक अभिनंदन!'
   WHERE order_index = 3;
   UPDATE public.events
   SET name = 'Wedding Day', slug = 'wedding-day', event_date = '2026-12-03', dress_code = 'Ethnic',
       description = 'अग्नि के सात फेरे और सात वचनों का मान हुआ,
   सिंदूरी रस्मों से देखो, पावन यह परिणय महान हुआ।
   सात जन्मों की इस डोरी में बँधे जो दो प्राण,
   स्नेह और संस्कारों से महक उठा सारा जहान।'
   WHERE order_index = 4;
   ```
   For an existing project that only needs the new gallery uploader, run this gallery-only SQL in the Supabase SQL Editor instead of rerunning the full schema:
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('wedding-gallery', 'wedding-gallery', true)
   ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

   ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

   DO $$
   BEGIN
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'gallery_images'
         AND policyname = 'Public can view gallery images'
     ) THEN
       CREATE POLICY "Public can view gallery images"
         ON public.gallery_images FOR SELECT USING (true);
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'gallery_images'
         AND policyname = 'Admins have full access to gallery images'
     ) THEN
       CREATE POLICY "Admins have full access to gallery images"
         ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Public read storage wedding-gallery'
     ) THEN
       CREATE POLICY "Public read storage wedding-gallery"
         ON storage.objects FOR SELECT USING (bucket_id = 'wedding-gallery');
     END IF;
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'storage' AND tablename = 'objects'
         AND policyname = 'Admin write storage wedding-gallery'
     ) THEN
       CREATE POLICY "Admin write storage wedding-gallery"
         ON storage.objects FOR ALL TO authenticated
         USING (bucket_id = 'wedding-gallery')
         WITH CHECK (bucket_id = 'wedding-gallery');
     END IF;
   END $$;
   ```
3. Create an admin user under **Authentication > Users** (e.g. `admin@khushal-bhanupriya.com`).
4. Copy your Project URL & Anon Key into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Run Locally
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### Upload Photos
Run the Supabase migration above when upgrading an existing database. Sign in at `/admin/login`, then open **Hero Photo** to upload the homepage background, **Couple Photo** to upload the couple portrait, **Ceremony Events** to upload event pictures, **Photo Gallery** to add multiple photos to the public gallery, or **Wedding Music** to upload or replace the website's background track (audio files, including `.m4a` and audio-only `.mp4`, up to 20 MB). The Mandwa & Binoli event has separate photo slots. Uploads require a logged-in Supabase admin account.

Open **Ceremony Events** in the admin dashboard to upload event photos. The Mandwa & Binoli card has separate photo slots for both ceremonies; the other events each have one.
