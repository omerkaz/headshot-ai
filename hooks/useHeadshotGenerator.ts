import { useMutation } from '@tanstack/react-query';
import type { HeadshotGeneratorInput, StreamEvent } from '../services/fal.ai.service';
import { generateHeadshotImage, generateHeadshotWeightAndTenHeadshots } from '../services/fal.ai.service';

interface GenerateParams {
  input: HeadshotGeneratorInput;
  headshotProfileId: string;
  onProgress?: (event: StreamEvent) => void;
}

export const useHeadshotGeneratorFirstPhase = () => {
  return useMutation({
    mutationFn: ({ input, headshotProfileId, onProgress }: GenerateParams) =>
      generateHeadshotWeightAndTenHeadshots(input, headshotProfileId, onProgress),
  });
};

export const useHeadshotGeneratorSecondPhase = () => {
  return useMutation({
    mutationFn: ({ input, headshotProfileId, onProgress }: GenerateParams) =>
      generateHeadshotImage(input, headshotProfileId, onProgress),
  });
};
  