import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }
  
  try {
    console.log('Request received:', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Log the complete raw request body
    const rawBody = await req.text();
    console.log('Raw webhook payload:', rawBody);

    // Then re-create the request for JSON parsing
    req = new Request(req.url, {
      method: req.method,
      headers: req.headers,
      body: rawBody
    });

    // Parse the URL to extract query parameters
    const url = new URL(req.url);
    const profileId = url.searchParams.get('profileId');
    
    if (!profileId) {
      throw new Error('Profile ID is missing from the webhook URL');
    }
    
    // Parse the request body as JSON
    const payload = await req.json();
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));
    
    // Extract relevant information from the payload
    // fal.ai webhook typically includes status and result fields
    const status = payload.status || 'UNKNOWN';
    const result = payload.result || {};
    
    // The diffusers_lora_file should be in the result
    const diffusers_lora_file = result.diffusers_lora_file || {};
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization') || ''
          }
        }
      }
    );

    // Update the profile based on the status
    if (status === 'COMPLETED' || status === 'OK') {
      console.log('Training completed successfully, updating profile status to ready');
      const { data, error } = await supabaseClient
        .from('headshot_profiles')
        .update({
          status: 'ready',
          weight_url: diffusers_lora_file.url || result.url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);
        
      if (error) throw error;
      console.log('Profile updated successfully', data);
    } else if (status === 'ERROR' || status === 'FAILED') {
      console.log('Training failed, updating profile status to error');
      const { data, error } = await supabaseClient
        .from('headshot_profiles')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);
        
      if (error) throw error;
      console.log('Profile status updated to error', data);
    } else {
      console.log(`Received status "${status}", no action taken`);
    }

    return new Response(JSON.stringify({
      message: 'Webhook received and processed successfully',
      status: status,
      profileId: profileId
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
