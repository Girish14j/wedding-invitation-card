import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const supabaseError = error as { message: unknown; details?: unknown; hint?: unknown };
    const parts = [supabaseError.message, supabaseError.details, supabaseError.hint]
      .filter((part): part is string => typeof part === 'string' && part.length > 0);
    if (parts.length > 0) return parts.join(' ');
  }
  return 'Unexpected upload error.';
}

export async function uploadFileToBucket(
  bucket: 'wedding-gallery' | 'family-photos' | 'event-images' | 'wedding-music' | 'website-assets',
  file: File,
  folder: string = '',
  contentType?: string
): Promise<{ publicUrl: string; path: string }> {
  const fileExt = file.name.split('.').pop();
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = folder ? `${folder}/${cleanFileName}` : cleanFileName;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    publicUrl: data.publicUrl,
    path: filePath,
  };
}
