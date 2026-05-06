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
          cover_image: string | null;
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
          cover_image?: string | null;
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
          cover_image?: string | null;
          created_at?: string;
        };
      };
      enquiries: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          event_date: string;
          event_type: string;
          message: string | null;
          status: 'new' | 'read' | 'contacted' | 'booked';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email: string;
          event_date: string;
          event_type: string;
          message?: string | null;
          status?: 'new' | 'read' | 'contacted' | 'booked';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          event_date?: string;
          event_type?: string;
          message?: string | null;
          status?: 'new' | 'read' | 'contacted' | 'booked';
          created_at?: string;
        };
      };
      availability: {
        Row: {
          id: string;
          date: string;
          status: 'available' | 'busy' | 'tentative';
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          status: 'available' | 'busy' | 'tentative';
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          status?: 'available' | 'busy' | 'tentative';
          note?: string | null;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: any;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: any;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: any;
          updated_at?: string;
        };
      };
    };
  };
}

export interface SiteSettings {
  key: 'hero_data' | 'about_data' | 'testimonials_data';
  value: any;
}

export interface Stat {
  icon: string;
  value: string;
  label: string;
}

export interface AboutData {
  name: string;
  subtitle: string;
  title: string;
  description1: string;
  description2: string;
  since: string;
  location: string;
  image: string;
  specialties: string[];
  stats: Stat[];
}

export interface HeroData {
  subtitle: string;
  title: string;
  tagline: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  bgImage: string;
  bgImages: string[];
}

export interface PackageFeature {
  text: string;
  included: boolean;
}

// Frontend types matching the current app structure
export interface GalleryImage {
  id: string;
  src: string;
  storagePath?: string;
  alt: string;
  width: number;
  height: number;
}

export interface Event {
  id: string;
  slug: string;
  name: string;
  category: string;
  date?: string;
  location?: string;
  coverImage: string;
  images: GalleryImage[];
}

export interface PhotographyPackage {
  id: string;
  name: string;
  price: number;
  priceNote: string;
  badge?: string;
  popular?: boolean;
  accentColor: string;
  coverImage?: string;
  features: {
    text: string;
    included: boolean;
  }[];
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventDate: string;
  eventType: string;
  message?: string;
  status: 'new' | 'read' | 'contacted' | 'booked';
  createdAt: string;
}

export interface Availability {
  id: string;
  date: string;
  status: 'available' | 'busy' | 'tentative';
  note?: string;
}
