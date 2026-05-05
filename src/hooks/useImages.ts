import { useState, useCallback } from 'react';
import { supabase, uploadImage, getImageUrl } from '../lib/supabase';

// Upload multiple images to an event
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  const uploadImages = useCallback(
    async (files: File[], eventId: string, eventSlug: string) => {
      setUploading(true);
      setError(null);
      const uploadedUrls: string[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${i}.${fileExt}`;
          const storagePath = `${eventSlug}/${fileName}`;

          setProgress((prev) => ({ ...prev, [file.name]: 0 }));

          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(storagePath, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const imageUrl = getImageUrl(storagePath);
          uploadedUrls.push(imageUrl);

          // Save to database
          const { error: dbError } = await supabase.from('gallery_images').insert({
            event_id: eventId,
            image_url: imageUrl,
            storage_path: storagePath,
            alt_text: file.name,
          });

          if (dbError) throw dbError;

          setProgress((prev) => ({ ...prev, [file.name]: 100 }));
        }

        return uploadedUrls;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload images');
        throw err;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return { uploadImages, uploading, progress, error };
}

// Delete image (admin only)
export async function deleteImage(imageId: string, storagePath: string) {
  // Delete from storage
  const { error: storageError } = await supabase.storage.from('gallery').remove([storagePath]);

  if (storageError) throw storageError;

  // Delete from database
  const { error: dbError } = await supabase.from('gallery_images').delete().eq('id', imageId);

  if (dbError) throw dbError;
  return true;
}

// Fetch images for an event
export async function getImagesByEvent(eventId: string) {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}
