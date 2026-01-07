
import { GoogleGenAI, Type } from "@google/genai";
import { TithiEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const fetchTithisForMonth = async (year: number, month: number): Promise<TithiEvent[]> => {
  const prompt = `Generate a JSON list of major Hindu/Bangla Tithis (Lunar phases) for the Gregorian month ${month} of year ${year}. 
  Include Purnima, Amavasya, Pratipada, and Ekadashi. 
  Ensure dates are accurate for the India/Bangladesh region. 
  Each entry must have: date (ISO string), name, banglaName (in Bengali script), startTime, endTime, and a short description of significance.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              name: { type: Type.STRING },
              banglaName: { type: Type.STRING },
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { 
                type: Type.STRING,
                description: "Must be one of: Purnima, Amavasya, Pratipada, Ekadashi, Other"
              }
            },
            required: ["date", "name", "banglaName", "startTime", "endTime", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching Tithis:", error);
    return [];
  }
};

export const getTithiAdvice = async (tithi: TithiEvent): Promise<string> => {
  const prompt = `Explain the spiritual and cultural significance of ${tithi.name} (${tithi.banglaName}) in Bengali culture. 
  Provide tips for rituals or activities associated with this specific day. Keep it warm and informative. Response in English with some Bengali greetings.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text || "No details available for this Tithi.";
  } catch (error) {
    return "Could not load advice at this time.";
  }
};
