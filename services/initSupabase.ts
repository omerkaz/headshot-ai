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

// Create custom storage implementation with async/await
const ExpoSecureStorage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      return await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
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
      // Add these options to ensure proper session handling
      flowType: 'pkce',
      debug: __DEV__,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'professional-headshot-generator',
      },
    },
  }
);

// Add this to debug auth state changes
if (__DEV__) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    console.log('Session token:', session?.access_token);
  });
}
