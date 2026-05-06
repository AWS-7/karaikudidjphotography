import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Availability } from '../types/database';

export function useAvailability() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('availability')
        .select('*')
        .order('date', { ascending: true });

      if (fetchError) {
        // If table doesn't exist yet (404/PGRST116), just return empty array instead of erroring
        if (fetchError.code === 'PGRST116' || fetchError.message?.includes('not found')) {
          setAvailability([]);
          return;
        }
        throw fetchError;
      }

      const formatted: Availability[] = (data || []).map((item: any) => ({
        id: item.id,
        date: item.date,
        status: item.status,
        note: item.note || '',
      }));

      setAvailability(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();

    const subscription = supabase
      .channel('public:availability')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, () => {
        fetchAvailability();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchAvailability]);

  return { availability, loading, error, refetch: fetchAvailability };
}

export async function updateAvailability(date: string, status: Availability['status'], note?: string) {
  // Try to find existing entry for this date
  const { data: existing } = await supabase
    .from('availability')
    .select('id')
    .eq('date', date)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('availability')
      .update({ status, note })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('availability')
      .insert({ date, status, note });
    if (error) throw error;
  }
  
  return true;
}

export async function deleteAvailability(id: string) {
  const { error } = await supabase
    .from('availability')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
