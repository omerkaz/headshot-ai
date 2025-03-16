import dotenv from 'dotenv';

const config = {
  fal: {
    apiKey: dotenv.config().parsed?.FAL_API_KEY,
  },
  supabase: {
    url: dotenv.config().parsed?.SUPABASE_URL,
    key: dotenv.config().parsed?.SUPABASE_KEY,
  },
};

if (!config.fal.apiKey) {
  throw new Error('FAL_API_KEY environment variable is not set');
}

if (!config.supabase.url || !config.supabase.key) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY environment variables are not set');
}

export default config;