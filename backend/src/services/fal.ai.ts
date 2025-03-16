// import config from '@/utils/config';
import { fal } from '@fal-ai/client';
import config from '../../config';

// Add configuration at the top of the file
const FAL_API_KEY = config.fal.apiKey;
console.log('FAL Key loaded:', config.fal.apiKey);
// Add validation for API key
if (!FAL_API_KEY) {
  throw new Error('FAL_API_KEY environment variable is not set');
}

fal.config({
  credentials: FAL_API_KEY,
});

// Remove or comment out this line for security
// console.log('FAL Key loaded:', process.env.FAL_API_KEY);

export interface HeadshotGeneratorInput {
  images_data_url: string;  // This should be a zip file URL
  trigger_phrase: string;
  learning_rate: number;
  steps: number;
  multiresolution_training: boolean;
  subject_crop: boolean;
}

export interface StreamEvent {
  status?: string;
  request_id?: string;
}

export const generateHeadshotWeight = async (
  input: HeadshotGeneratorInput,
  headshotProfileId: string,
  onProgress?: (event: StreamEvent) => void
) => {
  try {
    console.log(`Starting first phase headshot generation for profile: ${headshotProfileId}`);
    console.log('input', input);

    // Create webhook URL with the profile ID included
    const webhookUrl = `${config.supabase.url}/functions/v1/webhook-handler?profileId=${headshotProfileId}`;
    
    // Use fetch to directly call the queue.fal.run endpoint with the fal_webhook parameter
    const response = await fetch(
      `https://queue.fal.run/fal-ai/flux-lora-portrait-trainer?fal_webhook=${encodeURIComponent(webhookUrl)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...input,
          metadata: {
            headshotProfileId,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to queue request: ${response.status} - ${errorText}`);
    }

    const { request_id, gateway_request_id } = await response.json();
    console.log('Request submitted with ID:', request_id);

    // We can still implement polling for status updates if needed
    const maxAttempts = 12; // 1 minute maximum polling (5s * 12)
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const status = await fal.queue.status('fal-ai/flux-lora-portrait-trainer', {
        requestId: request_id,
        logs: true,
      });

      console.log('Status:', status);
      console.log('Queue status:', status.status);
      
      onProgress?.({
        status: status.status,
        request_id,
      });

      // Handle different status cases
      switch (status.status) {
        case 'COMPLETED':
          return { request_id, status: status.status };
        case 'IN_PROGRESS':
        case 'IN_QUEUE':
          attempts++;
          if (attempts === maxAttempts - 1) {
            return { request_id, status: status.status };
          }
          await new Promise(resolve => setTimeout(resolve, 5000));
          break;
      }
    }
    
    return { request_id, status: 'PENDING_WEBHOOK_CALLBACK' };
  } catch (error) {
    console.error('Error in headshot generation:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: (error as any)?.status,
      details: (error as any)?.body?.detail,
    });

    if (error instanceof Error) {
      throw new Error(`Headshot generation failed: ${error.message}`);
    }
    throw error;
  }
};


