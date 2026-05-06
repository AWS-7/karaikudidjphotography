import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Enquiry } from '../types/database';

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        // If table doesn't exist yet (404/PGRST116), just return empty array instead of erroring
        if (fetchError.code === 'PGRST116' || fetchError.message?.includes('not found')) {
          setEnquiries([]);
          return;
        }
        throw fetchError;
      }

      const formatted: Enquiry[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email,
        eventDate: item.event_date,
        eventType: item.event_type,
        message: item.message || '',
        status: item.status,
        createdAt: item.created_at,
      }));

      setEnquiries(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();

    const subscription = supabase
      .channel('public:enquiries')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, () => {
        fetchEnquiries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchEnquiries]);

  return { enquiries, loading, error, refetch: fetchEnquiries };
}

export async function createEnquiry(enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) {
  const { data, error } = await supabase
    .from('enquiries')
    .insert({
      name: enquiryData.name,
      phone: enquiryData.phone,
      email: enquiryData.email,
      event_date: enquiryData.eventDate,
      event_type: enquiryData.eventType,
      message: enquiryData.message,
      status: 'new'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status']) {
  const { error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function deleteEnquiry(id: string) {
  const { error } = await supabase
    .from('enquiries')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
