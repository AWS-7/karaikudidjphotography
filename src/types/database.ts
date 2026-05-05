export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          event_name: string;
          slug: string;
          category: string;
          event_date: string;
          location: string;
          description: string | null;
          cover_image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_name: string;
          slug: string;
          category: string;
          event_date: string;
          location: string;
          description?: string | null;
          cover_image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_name?: string;
          slug?: string;
          category?: string;
          event_date?: string;
          location?: string;
          description?: string | null;
          cover_image?: string | null;
          created_at?: string;
        };
      };
      gallery_images: {
        Row: {
          id: string;
          event_id: string;
          image_url: string;
          storage_path: string;
          alt_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          image_url: string;
          storage_path: string;
          alt_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          image_url?: string;
          storage_path?: string;
          alt_text?: string | null;
          created_at?: string;
        };
      };
      packages: {
        Row: {
          id: string;
          name: string;
          price: number;
          price_note: string | null;
          badge: string | null;
          popular: boolean;
          accent_color: string;
          features: PackageFeature[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          price_note?: string | null;
          badge?: string | null;
          popular?: boolean;
          accent_color: string;
          features: PackageFeature[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          price_note?: string | null;
          badge?: string | null;
          popular?: boolean;
          accent_color?: string;
          features?: PackageFeature[];
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface PackageFeature {
  text: string;
  included: boolean;
}

// Frontend types matching the current app structure
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Event {
  id: string;
  slug: string;
  name: string;
  category: string;
  date: string;
  location: string;
  coverImage: string;
  images: GalleryImage[];
}

export interface PhotographyPackage {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  badge?: string;
  popular?: boolean;
  accentColor: string;
  features: {
    text: string;
    included: boolean;
  }[];
}
