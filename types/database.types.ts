export type ProfileStatus = 'pending' | 'training' | 'completed' | 'failed';

export interface HeadshotProfile {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  status: ProfileStatus;
  checkpoint_url: string | null;
  trigger_phrase: string | null;
}

export interface HeadshotProfileImage {
  id: string;
  profile_id: string;
  image_url: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      headshot_profiles: {
        Row: HeadshotProfile;
        Insert: Omit<HeadshotProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HeadshotProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
      headshot_profile_images: {
        Row: HeadshotProfileImage;
        Insert: Omit<HeadshotProfileImage, 'id' | 'created_at'>;
        Update: Partial<Omit<HeadshotProfileImage, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: unknown;
    };
    Enums: {
      profile_status: ProfileStatus;
    };
  };
} 