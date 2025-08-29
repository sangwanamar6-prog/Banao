
import { GoogleGenAI, Modality } from "@google/genai";
import type { AspectRatio } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateSwappedImage(
  personBase64: string,
  personMimeType: string,
  styleBase64: string,
  styleMimeType: string,
  aspectRatio: AspectRatio
): Promise<string | null> {
  const model = 'gemini-2.5-flash-image-preview';

  const personImagePart = {
    inlineData: {
      data: personBase64,
      mimeType: personMimeType,
    },
  };

  const styleImagePart = {
    inlineData: {
      data: styleBase64,
      mimeType: styleMimeType,
    },
  };

  const aspectRatioInstruction = aspectRatio === 'Original'
    ? 'Match the aspect ratio of the first input image (the person).'
    : `The final output image must have a ${aspectRatio} aspect ratio.`;
  
  const textPrompt = `
    You are an expert photo editor. Your task is to combine two images. The first image contains the main subject (a person). The second image contains a style reference (e.g., clothes, an accessory like a bag, or a vehicle).
    You must seamlessly integrate the main subject from the first image into the context of the second image. Specifically:
    - If the second image features clothing, redraw the person from the first image wearing that clothing.
    - If the second image features an accessory like a handbag, redraw the person from the first image holding it.
    - If the second image features a vehicle like a car or bike, redraw the person from the first image sitting in or on it.
    The final image should be photorealistic and cohesive. The background and overall style should be inspired by the second image.
    Output only the final edited image without any text.
    Aspect ratio instruction: ${aspectRatioInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [personImagePart, styleImagePart, { text: textPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate image due to an API error.");
  }
}
