import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }
  try {
    console.log('req', req);

    // Parse the URL to extract query parameters
    const url = new URL(req.url);
    const profileId = url.searchParams.get('profileId');

   
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    if (status === 'OK') {
      const { data, error } = await supabaseClient.from('headshot_profiles').update({
        status: 'ready',
        // weight_url: diffusers_lora_file.url
      }).eq('id', profileId);
      if (error) throw error;
    }
    if (status === 'ERROR') {
      const { data, error } = await supabaseClient.from('headshot_profiles').update({
        status: 'error'
      }).eq('id', profileId);
      if (error) throw error;
    }
    return new Response(JSON.stringify({
      message: 'Webhook received with status and body: ' + status + ' ' + JSON.stringify(req.body)
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
