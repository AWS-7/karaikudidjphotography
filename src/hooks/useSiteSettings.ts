import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useSiteSettings<T>(key: 'hero_data' | 'about_data' | 'testimonials_data' | 'services_data' | 'categories_data' | 'font_settings', defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Only show loading if we don't have data yet (not using default)
      // Actually, since we have defaultValue, we can just fetch in background
      const { data: settings, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Key doesn't exist, use default
          setData(defaultValue);
        } else {
          console.error(`Error fetching ${key}:`, error);
        }
      } else if (settings?.value) {
        setData(settings.value as T);
      }
    } catch (err) {
      console.error(`Unexpected error fetching ${key}:`, err);
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue]);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`public:site_settings:${key}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'site_settings', filter: `key=eq.${key}` }, 
        (payload: { new: { value: any } }) => {
          if (payload.new && payload.new.value) {
            setData(payload.new.value as T);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [key, fetchData]);

  const updateSettings = async (newValue: T) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          { key, value: newValue, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )
        .select();

      if (error) throw error;
      setData(newValue);
      return true;
    } catch (err) {
      console.error(`Error updating ${key}:`, err);
      throw err;
    }
  };

  return { data, loading, updateSettings, refetch: fetchData };
}
