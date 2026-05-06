import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Event, GalleryImage } from '../types/database';

// Fetch all events with image count
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch image counts for each event
      const eventsWithImages = await Promise.all(
        (eventsData || []).map(async (event: any) => {
          const { data: imagesData, error: imagesError } = await supabase
            .from('gallery_images')
            .select('id, image_url, storage_path, alt_text')
            .eq('event_id', event.id);

          if (imagesError) throw imagesError;

          const images: GalleryImage[] = (imagesData || []).map((img: any) => ({
            id: img.id,
            src: img.image_url,
            storagePath: img.storage_path,
            alt: img.alt_text || 'Gallery image',
            width: 1200,
            height: 800,
          }));

          return {
            id: event.id,
            slug: event.slug,
            name: event.event_name,
            category: event.category,
            date: event.event_date,
            location: event.location,
            coverImage: event.cover_image || 'https://placehold.co/800x600',
            images,
          };
        })
      );

      setEvents(eventsWithImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

// Fetch single event by slug
export function useEvent(slug: string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch event
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('slug', slug)
          .single();

        if (eventError) throw eventError;
        if (!eventData) throw new Error('Event not found');

        // Fetch images
        const { data: imagesData, error: imagesError } = await supabase
          .from('gallery_images')
          .select('id, image_url, storage_path, alt_text, created_at')
          .eq('event_id', eventData.id)
          .order('created_at', { ascending: true });

        if (imagesError) throw imagesError;

        const images: GalleryImage[] = (imagesData || []).map((img: any) => ({
          id: img.id,
          src: img.image_url,
          storagePath: img.storage_path,
          alt: img.alt_text || 'Gallery image',
          width: 1200,
          height: 800,
        }));

        setEvent({
          id: eventData.id,
          slug: eventData.slug,
          name: eventData.event_name,
          category: eventData.category,
          date: eventData.event_date,
          location: eventData.location,
          coverImage: eventData.cover_image || 'https://placehold.co/800x600',
          images,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  return { event, loading, error };
}

// Create new event (admin only)
export async function createEvent(eventData: {
  event_name: string;
  slug: string;
  category: string;
  event_date?: string;
  location?: string;
  description?: string;
  cover_image?: string;
}) {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update event (admin only)
export async function updateEvent(
  id: string,
  eventData: Partial<{
    event_name: string;
    slug: string;
    category: string;
    event_date?: string;
    location?: string;
    description?: string;
    cover_image?: string;
  }>
) {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete event (admin only)
export async function deleteEvent(id: string) {
  try {
    // First delete all associated images from storage
    const { data: images, error: fetchError } = await supabase
      .from('gallery_images')
      .select('storage_path')
      .eq('event_id', id);

    if (fetchError) throw fetchError;

    if (images && images.length > 0) {
      const paths = images
        .map((img: any) => img.storage_path as string)
        .filter((path: string): path is string => !!path);
      
      if (paths.length > 0) {
        // Delete in chunks of 100 to avoid Supabase limits
        for (let i = 0; i < paths.length; i += 100) {
          const chunk = paths.slice(i, i + 100);
          const { error: storageError } = await supabase.storage.from('gallery').remove(chunk);
          if (storageError) {
            console.warn('Storage removal warning for chunk:', storageError);
          }
        }
      }
    }

    // Then delete the event
    // We use .select() to verify that the deletion actually happened
    const { error: imagesDbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('event_id', id)
      .select();
    
    if (imagesDbError) throw imagesDbError;

    const { data: deletedEvent, error: eventError } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .select();

    if (eventError) throw eventError;

    // If nothing was returned by .select(), it means no rows were deleted
    if (!deletedEvent || deletedEvent.length === 0) {
      throw new Error('No event was deleted. This might be due to database permissions (RLS).');
    }

    return true;
  } catch (err) {
    console.error('Delete event error:', err);
    throw err;
  }
}
