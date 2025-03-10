export interface HeadshotProfile {
  id: string;
  user_id: string;
  name: string;
  trigger_phrase: string;
  status: string;
  created_at: string;
}

export interface ProfileImage {
  id: string;
  profile_id: string;
  image_url: string;
  created_at: string;
}

export interface PreparedProfile {
  profileId: string;
  triggerPhrase: string;
  zipUrl: string | null;
} 