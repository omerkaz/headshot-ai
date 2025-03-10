// import config from '@/utils/config';
import { fal } from '@fal-ai/client';

// Add configuration at the top of the file
fal.config({
  credentials: process.env.FAL_API_KEY,
});

console.log('FAL Key loaded:', process.env.FAL_API_KEY);

export interface HeadshotGeneratorInput {
  images_data_url: string;  // This should be a zip file URL
  trigger_phrase: string;
//   images_data_type: string;
  steps: number;
  resume_from_checkpoint: string;
  prompt: string;
  num_images: number;
}

export interface StreamEvent {
  status?: string;
}

export const generateHeadshotWeight = async (
  input: HeadshotGeneratorInput,
  headshotProfileId: string,
  onProgress?: (event: StreamEvent) => void
) => {
  try {
    console.log(`Starting first phase headshot generation for profile: ${headshotProfileId}`);
    
    const inputWithWebhook = {
      ...input,
      webhook_url: `${process.env.SUPABASE_URL}/functions/v1/webhook-handler`,
      metadata: {
          headshotProfileId,
      },
    };

    console.log('Sending request to fal.ai with input:', JSON.stringify({
      ...inputWithWebhook,
      images_data_url: inputWithWebhook.images_data_url.substring(0, 30) + '...' 
    }, null, 2));

    // Submit the request to the queue
    const { request_id } = await fal.queue.submit('workflows/omerkaz/headshot-weight', {
      input: inputWithWebhook,
    });

    console.log('Request submitted with ID:', request_id);

    // Poll for status
    let result;
    while (!result) {
      const status = await fal.queue.status('workflows/omerkaz/headshot-weight', {
        requestId: request_id,
        logs: true,
      });

      console.log('Queue status:', status.status);
      
      if (status.status === 'COMPLETED') {
        result = await fal.queue.result('workflows/omerkaz/headshot-weight', {
          requestId: request_id,
        });
      } 

      onProgress?.({
        status: status.status,
      });

      if (!result) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before next poll
      }
    }

    console.log('First phase completed successfully with result:', result);
    return result;
  } catch (error) {
    console.error('Error generating headshot in first phase:', error);
    if (error instanceof Error) {
      throw new Error(`Headshot generation failed: ${error.message}`);
    }
    throw error;
  }
};


