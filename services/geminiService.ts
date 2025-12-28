
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function classifySamples(fileNames: string[]): Promise<any[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Classify these file names into MPC categories: ${fileNames.join(', ')}`,
    config: {
      systemInstruction: `You are CLOS, an MPC library architect. 
      Categorize samples into: DRUM_ONESHOT, MELODIC_ONESHOT, LOOP, MULTISAMPLE, FX.
      Return a JSON array of objects with { "name": string, "category": string, "reason": string }.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["name", "category", "reason"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function suggestPadLayout(sampleNames: string[]): Promise<Record<number, string>> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest an MPC 16-pad layout (1-16) for these samples: ${sampleNames.join(', ')}`,
    config: {
      systemInstruction: `You are an expert MPC beatmaker. 
      Map samples to pads 1-16 logically (e.g., Kicks on 1-2, Snares on 5-6, Hats on 9-10).
      Return a JSON object where keys are pad numbers (1-16) and values are the sample names.`,
      responseMimeType: "application/json"
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to suggest layout", e);
    return {};
  }
}

export async function generateExpansionJson(context: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate an Expansion.json for an MPC pack based on this context: ${context}`,
    config: {
      systemInstruction: "Generate a valid MPC Expansion.json file following Akai Professional standards.",
      responseMimeType: "application/json"
    }
  });
  return response.text || "";
}
