
export type Theme = 'light' | 'dark';

export const aspectRatios = ['Original', '9:16', '16:9', '3:2', '4:3'] as const;
export type AspectRatio = typeof aspectRatios[number];

export interface ImageData {
  base64: string;
  mimeType: string;
  previewUrl: string;
}
