import { Env } from '@/types';
import Constants from 'expo-constants';

// Type-safe config access
const extra = Constants.expoConfig?.extra;
console.log('extra', extra);
if (!extra?.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL in environment config');
}

if (!extra?.SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY in environment config');
}

if (!extra?.FAL_API_KEY) {
  throw new Error('Missing FAL_API_KEY in environment config');
}

const config = {
  env: (process.env.NODE_ENV ?? 'development') as Env,
  apiUrl: extra.API_URL as string,
  supabase: {
    url: extra.SUPABASE_URL as string,
    anonKey: extra.SUPABASE_ANON_KEY as string,
  },
  falAi: {
    apiKey: extra.FAL_API_KEY as string,
  },
} as const;

export default config;
