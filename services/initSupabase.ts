    import { createClient } from "@supabase/supabase-js";

// Better put your these secret keys in .env file
export const supabase = createClient("supabaseUrl", "supabaseKey", {
  auth: {
    detectSessionInUrl: false as any,
  },
});
