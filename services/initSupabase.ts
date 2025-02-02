import config from '@/utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

console.log('Supabase Config:', {
  url: config.supabase.url,
  anonKey: config.supabase.anonKey
});

if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error('Supabase URL or key is not set');
}

// Create custom storage implementation
const ExpoSecureStorage = {
  getItem: (key: string) => {
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
      storage: ExpoSecureStorage,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'professional-headshot-generator',
      },
    },
    // Add retry configuration


  }
);
