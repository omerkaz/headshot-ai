import config from '@/utils/config';
import { fal } from '@fal-ai/client';

// Add configuration at the top of the file
fal.config({
  credentials: config.falAi.apiKey,
});

console.log('FAL Key loaded:', config.falAi.apiKey);

export interface HeadshotGeneratorInput {
  images_data_url: string;  // This should be a zip file URL
  trigger_phrase: string;
  steps: number;
  resume_from_checkpoint: string;
  prompt: string;
  num_images: number;
}

export interface StreamEvent {
  status?: string;
}

export const generateHeadshotWeightAndTenHeadshots = async (
  input: HeadshotGeneratorInput,
  headshotProfileId: string,
  onProgress?: (event: StreamEvent) => void
) => {
  try {
    console.log(`Starting first phase headshot generation for profile: ${headshotProfileId}`);
    
    const inputWithWebhook = {
      ...input,
      webhook_url: `${config.supabase.url}/functions/v1/webhook-handler`,
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

export const generateHeadshotImage = async (
  input: HeadshotGeneratorInput,
  headshotProfileId: string,
  onProgress?: (event: StreamEvent) => void
) => {
  try {
    console.log(`Starting second phase headshot generation for profile: ${headshotProfileId}`);
    
    const inputWithWebhook = {
      ...input,
      webhook_url: `${config.supabase.url}/functions/v1/fal-ai-webhook-handler`,
      metadata: {
          headshotProfileId,
      },
    };

    console.log('Sending request to fal.ai with input:', JSON.stringify({
      ...inputWithWebhook,
        images_data_url: inputWithWebhook.images_data_url.substring(0, 30) + '...' // Truncate URLs for logging
    }, null, 2));

    const stream = await fal.stream('workflows/omerkaz/headshot-weight', {
      input: inputWithWebhook,
    });

    console.log('Stream connection established');
    
    for await (const event of stream) {
      console.log(`Stream event received: ${event.status || 'unknown'}, progress: ${event.progress || 'unknown'}`);
      onProgress?.(event);
    }

    const result = await stream.done();
    console.log('Second phase completed successfully');
    return result;
  } catch (error) {
    console.error('Error generating headshot in second phase:', error);
    throw error;
  }
};
