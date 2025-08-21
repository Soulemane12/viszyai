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
    };
  };
}
