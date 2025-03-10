import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

console.log("supabaseUrl", supabaseUrl);
console.log("supabaseKey", supabaseKey);

// Create a second client with service role if needed for admin operations
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!, // Make sure this is the service key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 
