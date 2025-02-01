import config from '@/utils/config';
import { fal } from '@fal-ai/client';

// Add configuration at the top of the file
fal.config({
  credentials: config.falAi.apiKey,
});

console.log('FAL Key loaded:', config.falAi.apiKey);

export interface HeadshotGeneratorInput {
  images_data_url: string;
  trigger_phrase: string;
  steps: number;
  resume_from_checkpoint: string;
  prompt: string;
}

export interface StreamEvent {
  status?: string;
  progress?: number;
  partial_result?: any;
}


export const generateHeadshot = async (
  input: HeadshotGeneratorInput,
  onProgress?: (event: StreamEvent) => void
) => {
  try {
    const stream = await fal.stream("workflows/omerkaz/headshot-generator", {
      input,
    });

    for await (const event of stream) {
      onProgress?.(event);
    }

    const result = await stream.done();
    return result;
  } catch (error) {
    console.error("Error generating headshot:", error);
    throw error;
  }
};
