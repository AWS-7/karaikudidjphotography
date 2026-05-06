import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://binukyhszxvolmotvoxk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbnVreWhzenh2b2xtb3R2b3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTU2MTEsImV4cCI6MjA5MzU3MTYxMX0.GI85oggD0FtHkiUTeVApMY0YzUVbxOqyHaMOmIfDh9E';

const isDev = !supabaseUrl || !supabaseAnonKey;

if (isDev) {
  console.warn(
    '%c[DJ Photography] Supabase credentials not found.\n' +
    'Please create a .env file with:\n' +
    'VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=your-anon-key',
    'color: #c8972a; font-weight: bold;'
  );
}

// Create a mock client for development if credentials are missing
const createMockClient = () => {
  return {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    storage: {
      from: () => ({
        upload: () => ({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => ({ error: null }),
      }),
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as any;
};

export const supabase = isDev 
  ? createMockClient() 
  : createClient<Database>(supabaseUrl, supabaseAnonKey);

// Storage bucket name
export const STORAGE_BUCKET = 'gallery';

// Helper to get public URL for an image
export function getImageUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Helper to upload image to storage
export async function uploadImage(file: File, path: string): Promise<string | null> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  return getImageUrl(path);
}

// Helper to delete image from storage
export async function deleteImage(path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  
  if (error) {
    console.error('Delete error:', error);
    return false;
  }

  return true;
}
