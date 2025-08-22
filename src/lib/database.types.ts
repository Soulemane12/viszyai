export interface Profile {
  id: string;
  user_id: string;
  handle: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
  bio?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
  created_at: string;
}

export interface ProfileView {
  id: string;
  profile_id: string;
  viewer_ip?: string;
  viewer_user_agent?: string;
  viewer_country?: string;
  viewer_city?: string;
  viewer_latitude?: number;
  viewer_longitude?: number;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
}

export interface QRScan {
  id: string;
  profile_id: string;
  scanner_ip?: string;
  scanner_user_agent?: string;
  scanner_country?: string;
  scanner_city?: string;
  scanner_latitude?: number;
  scanner_longitude?: number;
  device_type?: string;
  created_at: string;
}

export interface ContactDownload {
  id: string;
  profile_id: string;
  downloader_ip?: string;
  downloader_user_agent?: string;
  downloader_country?: string;
  downloader_city?: string;
  download_type?: string;
  created_at: string;
}

export interface SocialClick {
  id: string;
  profile_id: string;
  social_link_id: string;
  clicker_ip?: string;
  clicker_user_agent?: string;
  clicker_country?: string;
  clicker_city?: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      social_links: {
        Row: SocialLink;
        Insert: Omit<SocialLink, 'id' | 'created_at'>;
        Update: Partial<Omit<SocialLink, 'id' | 'created_at'>>;
      };
      profile_views: {
        Row: ProfileView;
        Insert: Omit<ProfileView, 'id' | 'created_at'>;
        Update: Partial<Omit<ProfileView, 'id' | 'created_at'>>;
      };
      qr_scans: {
        Row: QRScan;
        Insert: Omit<QRScan, 'id' | 'created_at'>;
        Update: Partial<Omit<QRScan, 'id' | 'created_at'>>;
      };
      contact_downloads: {
        Row: ContactDownload;
        Insert: Omit<ContactDownload, 'id' | 'created_at'>;
        Update: Partial<Omit<ContactDownload, 'id' | 'created_at'>>;
      };
      social_clicks: {
        Row: SocialClick;
        Insert: Omit<SocialClick, 'id' | 'created_at'>;
        Update: Partial<Omit<SocialClick, 'id' | 'created_at'>>;
      };
    };
    Functions: {
      get_profile_analytics: {
        Args: { profile_handle: string };
        Returns: {
          total_views: number;
          total_scans: number;
          total_downloads: number;
          total_social_clicks: number;
          unique_visitors: number;
          top_countries: unknown;
          recent_activity: unknown;
          monthly_views: unknown;
        }[];
      };
    };
  };
}
