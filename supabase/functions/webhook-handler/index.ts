import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js';

// --- Constants ---
const JSON_CONTENT_TYPE = { 'Content-Type': 'application/json' };

// --- Helper Functions ---

// Creates standardized CORS responses
function createCorsResponse(status = 200, body: string | object = 'ok', extraHeaders = {}) {
  const isObject = typeof body === 'object' && body !== null;
  const responseBody = isObject ? JSON.stringify(body) : (body as string);
  const headers = {
    'Access-Control-Allow-Origin': '*', // Be more specific in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Fal-Webhook-Secret', // Allow potential secret header
    ...(isObject && JSON_CONTENT_TYPE), // Add JSON content type if body is object
    ...extraHeaders,
  };
  return new Response(responseBody, { status, headers });
}

// --- Main Request Handler ---

Deno.serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return createCorsResponse();
  }

  // 2. Validate Method
  if (req.method !== 'POST') {
    return createCorsResponse(405, { error: 'Method Not Allowed' });
  }

  // --- Environment Variable Check (Early Exit) ---
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  // Optional: Add secret check here if implemented
  // const expectedSecret = Deno.env.get('FAL_WEBHOOK_SECRET');

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables not set.'
    );
    return createCorsResponse(500, { error: 'Server configuration error' });
  }
  // Optional: Check for expectedSecret here too

  try {
    console.log('Webhook POST request received:', {
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()), // Log headers
    });

    // Optional: Add Shared Secret Verification here
    /*
    const receivedSecret = req.headers.get('X-Fal-Webhook-Secret');
    if (!expectedSecret) { // Check if secret is configured server-side
       console.warn('Webhook secret check not configured (FAL_WEBHOOK_SECRET env var missing).');
    } else if (receivedSecret !== expectedSecret) {
       console.warn('Invalid or missing webhook secret received.');
       return createCorsResponse(401, { error: 'Unauthorized' });
    }
    console.log('Webhook secret verified.'); // Only if using secrets
    */

    // 3. Parse JSON Payload
    let webhookData: any;
    try {
      webhookData = await req.json();
      console.log('Webhook payload parsed successfully.', webhookData);
      // Avoid logging the full payload in production if it contains sensitive data,
      // or log only specific fields if needed for debugging.
      // console.debug('Parsed payload:', JSON.stringify(webhookData, null, 2)); // Use debug level
    } catch (parseError) {
      console.error('Error parsing webhook JSON payload:', parseError);
      try {
        // Clone request to read body text after failed .json() attempt
        const rawBody = await req.clone().text();
        console.error('Raw body on parse error:', rawBody.substring(0, 500)); // Log truncated body
      } catch (readError) {
        console.error('Could not read raw body after JSON parse error:', readError);
      }
      return createCorsResponse(400, { error: 'Invalid JSON payload' });
    }

    // 4. Extract Data from Payload
    const metadata = webhookData?.metadata || {};
    const result = webhookData?.result || {};
    const headshotProfileId = metadata.headshotProfileId;
    const status = webhookData?.status || 'UNKNOWN'; // Default to UNKNOWN
    // Adjust loraUrl extraction based on confirmed fal.ai payload structure
    const loraUrl = result?.output?.url;

    // 5. Validate Essential Data
    if (!headshotProfileId) {
      console.error('headshotProfileId missing from webhook payload metadata.', { metadata });
      return createCorsResponse(400, { error: 'Profile ID missing in webhook payload metadata' });
    }

    console.log(`Processing webhook for Profile ID: ${headshotProfileId}`, { status, loraUrl });

    // 6. Initialize Supabase Client (already checked vars)
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // 7. Determine Database Update
    const now = new Date().toISOString();
    let updateData: { status: string; weight_url?: string; updated_at: string } | null = null;
    let logMessage: string | null = null;

    // Normalize status checks (adjust based on actual fal.ai values)
    const isCompleted = status === 'COMPLETED' || status === 'OK';
    const isFailed = status === 'FAILED' || status === 'ERROR';

    if (isCompleted) {
      if (!loraUrl) {
        console.warn(
          `Status is ${status} for profile ${headshotProfileId} but loraUrl is missing.`,
          { result }
        );
        updateData = { status: 'failed', updated_at: now }; // Mark as failed if URL missing
        logMessage = `Training completed (${status}) but URL missing, marking profile ${headshotProfileId} as failed.`;
      } else {
        updateData = { status: 'ready', weight_url: loraUrl, updated_at: now };
        logMessage = `Training completed (${status}), setting profile ${headshotProfileId} to ready with weight_url.`;
      }
    } else if (isFailed) {
      if (webhookData.error) {
        console.error(
          `Fal.ai failure details for profile ${headshotProfileId}:`,
          webhookData.error
        );
      }
      updateData = { status: 'failed', updated_at: now };
      logMessage = `Training failed (${status}), setting profile ${headshotProfileId} to failed.`;
    } else {
      console.log(
        `Received unhandled status "${status}" for profile ${headshotProfileId}. No database update.`
      );
      // Acknowledge receipt even if status is unhandled
      return createCorsResponse(200, {
        message: 'Webhook received, status unhandled',
        status,
        profileId: headshotProfileId,
      });
    }

    // 8. Perform Database Update (if needed)
    if (updateData && logMessage) {
      console.log(logMessage);
      const { data, error } = await supabaseClient
        .from('headshot_profiles') // Ensure table name is correct
        .update(updateData)
        .eq('id', headshotProfileId);

      if (error) {
        console.error(`Database update error for profile ${headshotProfileId}:`, error);
        // Throwing will be caught by the main catch block
        throw new Error(`Database update failed for profile ${headshotProfileId}.`);
      }
      console.log(`Profile ${headshotProfileId} updated successfully in database.`);
    }

    // 9. Return Success Response
    return createCorsResponse(200, {
      message: 'Webhook processed successfully',
      status,
      profileId: headshotProfileId,
    });
  } catch (error) {
    // 10. Handle Critical Errors
    console.error('Critical error in webhook handler:', error.message, { stack: error.stack });
    return createCorsResponse(500, { error: 'Internal Server Error' });
  }
});
