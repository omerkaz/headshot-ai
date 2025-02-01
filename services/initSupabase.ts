import config from '@/utils/config';
import { createClient } from '@supabase/supabase-js';

if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error('Supabase URL or key is not set');
}
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      detectSessionInUrl: false,
    },
  }
);
