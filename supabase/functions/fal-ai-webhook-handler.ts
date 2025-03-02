import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// import { createClient } from "jsr:@supabase/supabase-js";

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } });
  }

  try {
    console.log(req.body);
    const { headshotProfileId, status, diffusers_lora_file, seed, images } = await req.json();
    console.log({headshotProfileId, status, diffusers_lora_file, seed, images});
    // const supabaseClient = createClient(
    //   Deno.env.get('SUPABASE_URL')!,
    //   Deno.env.get('SUPABASE_ANON_KEY')!,
    //   {
    //     global: {
    //       headers: { Authorization: req.headers.get('Authorization')! },
    //     },
    //   } 
    // );
    // if (status === 'OK') {
    // const { data, error } = await supabaseClient
    //   .from('headshot_profiles')
    //   .update({ status: "ready", weight_url: diffusers_lora_file.url })
    //   .eq('id', headshotProfileId);
    //   if (error) throw error;
    // }
    // if (status === 'ERROR') {
    //   const { data, error } = await supabaseClient
    //     .from('headshot_profiles')
    //     .update({ status: "not_ready"})
    //     .eq('id', headshotProfileId);
    //   if (error) throw error;
    // }
   

    return new Response(JSON.stringify({ message: 'Webhook received with status and body: ' + status + ' ' + JSON.stringify(req.body) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: (error as Error) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});