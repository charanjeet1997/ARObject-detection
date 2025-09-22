
import { GoogleGenAI, Type } from "@google/genai";
import type { DetectedObject } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    objectName: {
      type: Type.STRING,
      description: "The name of the main object identified in the image."
    },
    description: {
      type: Type.STRING,
      description: "A brief, one-sentence description of the object."
    }
  },
  required: ["objectName", "description"]
};

export const identifyObject = async (base64Image: string): Promise<DetectedObject | null> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    
    const textPart = {
      text: "Identify the main object in this image. If no clear object is visible, set objectName to 'No object detected' and provide a relevant description."
    };

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonString = response.text.trim();
    if (jsonString) {
      const detectedObject: DetectedObject = JSON.parse(jsonString);
      if (detectedObject.objectName.toLowerCase() !== 'no object detected') {
          return detectedObject;
      }
    }
    return null;

  } catch (error) {
    console.error("Error identifying object:", error);
    return null;
  }
};
