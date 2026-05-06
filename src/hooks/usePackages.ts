import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PhotographyPackage, PackageFeature } from '../types/database';

// Fetch all packages
export function usePackages() {
  const [packages, setPackages] = useState<PhotographyPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('packages')
        .select('*')
        .order('price', { ascending: true });

      if (fetchError) throw fetchError;

      const formattedPackages: PhotographyPackage[] = (data || []).map((pkg: any) => ({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        priceNote: pkg.price_note || 'Starting price',
        badge: pkg.badge || undefined,
        popular: pkg.popular || false,
        accentColor: pkg.accent_color,
        coverImage: pkg.cover_image || undefined,
        features: pkg.features,
      }));

      setPackages(formattedPackages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();

    // Subscribe to real-time changes
    const packagesSubscription = supabase
      .channel('public:packages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, () => {
        fetchPackages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(packagesSubscription);
    };
  }, [fetchPackages]);

  return { packages, loading, error, refetch: fetchPackages };
}

// Create package (admin only)
export async function createPackage(pkgData: {
  name: string;
  price: number;
  price_note?: string;
  badge?: string;
  popular?: boolean;
  accent_color: string;
  cover_image?: string;
  features: PackageFeature[];
}) {
  try {
    const { data, error } = await supabase.from('packages').insert(pkgData).select().single();
    if (error) throw error;
    return data;
  } catch (err: any) {
    // Fallback if cover_image column doesn't exist yet
    if (err.message?.includes("cover_image") || err.details?.includes("cover_image")) {
      const { cover_image, ...dataWithoutImage } = pkgData;
      const { data, error } = await supabase.from('packages').insert(dataWithoutImage).select().single();
      if (error) throw error;
      return data;
    }
    throw err;
  }
}

// Update package (admin only)
export async function updatePackage(
  id: string,
  pkgData: Partial<{
    name: string;
    price: number;
    price_note: string;
    badge: string;
    popular: boolean;
    accent_color: string;
    cover_image: string;
    features: PackageFeature[];
  }>
) {
  try {
    const { data, error } = await supabase.from('packages').update(pkgData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (err: any) {
    // Fallback if cover_image column doesn't exist yet
    if (err.message?.includes("cover_image") || err.details?.includes("cover_image")) {
      const { cover_image, ...dataWithoutImage } = pkgData;
      const { data, error } = await supabase.from('packages').update(dataWithoutImage).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
    throw err;
  }
}

// Delete package (admin only)
export async function deletePackage(id: string) {
  const { error } = await supabase.from('packages').delete().eq('id', id);

  if (error) throw error;
  return true;
}
