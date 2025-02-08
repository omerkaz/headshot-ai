import { useMutation } from '@tanstack/react-query';
import type { HeadshotGeneratorInput, StreamEvent } from '../services/fal.ai.service';
import { generateHeadshot } from '../services/fal.ai.service';

interface GenerateParams {
  input: HeadshotGeneratorInput;
  onProgress?: (event: StreamEvent) => void;
}

export const useHeadshotGenerator = () => {
  return useMutation({
    mutationFn: ({ input, onProgress }: GenerateParams) => generateHeadshot(input, onProgress),
  });
};
