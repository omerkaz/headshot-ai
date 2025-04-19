  import { Env } from '@/types';
import Constants from 'expo-constants';

// Type-safe config access
const extra = Constants.expoConfig?.extra;
console.log('Config Extra:', extra);

if (!extra?.EXPO_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL in environment config');
}

if (!extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY in environment config');
}

if (!extra?.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) {
  throw new Error('Missing GOOGLE_IOS_CLIENT_ID in environment config');
}

if (!extra?.EXPO_PUBLIC_BACKEND_API_URL) {
  throw new Error('Missing BACKEND_API_URL in environment config');
}

if (!extra?.EXPO_PUBLIC_REVENUECAT_API_KEY) {
  throw new Error('Missing REVENUECAT_API_KEY in environment config');
} 

const config = {
  env: extra.env as Env,
  apiUrl: extra.EXPO_PUBLIC_BACKEND_API_URL as string,
  supabase: {
    url: extra.EXPO_PUBLIC_SUPABASE_URL as string,
    anonKey: extra.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,
  },
  google: {
    iosClientId: extra.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID as string,
  },
  revenuecat: {
    apiKey: extra.EXPO_PUBLIC_REVENUECAT_API_KEY as string,
  },  
} as const;

export default config;
