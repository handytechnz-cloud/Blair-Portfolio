
import { GoogleGenAI, Type } from "@google/genai";
import { AISuggestion } from "../types";

// Safe initialization
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key missing. Gemini features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getArtisticStatement = async (imageData: string): Promise<AISuggestion | null> => {
  try {
    const ai = getAIClient();
    if (!ai) return null;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: imageData.split(',')[1], mimeType: "image/jpeg" } },
          { text: "Analyze this photograph and provide: 1. A poetic artistic statement (short story). 2. A catchy title suggestion. 3. Three technical tips to improve or replicate this style. Return in JSON format." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING },
            titleSuggestion: { type: Type.STRING },
            technicalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["story", "titleSuggestion", "technicalTips"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as AISuggestion;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getShootingAdvice = async (location: string): Promise<{ text: string; sources: any[] }> => {
  try {
    const ai = getAIClient();
    if (!ai) return { text: "AI features are currently unavailable. Check your API configuration.", sources: [] };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide expert photography advice for shooting in ${location}. Include best times of day, potential gear needs, and hidden spots if possible. Use Google Search.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    return {
      text: response.text || "I couldn't find specific advice for this location at the moment.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { text: "Error fetching location data. Please try again later.", sources: [] };
  }
};
