
import { GoogleGenAI, Type } from "@google/genai";
import { TithiEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches Tithis and major Bengali Festivals for a range of months.
 */
export const fetchTithisForRange = async (startYear: number, startMonth: number, monthCount: number = 6): Promise<TithiEvent[]> => {
  const prompt = `Generate a JSON list of major Hindu/Bangla Tithis (Lunar phases) and significant Bengali Festivals (Pujas) starting from ${startMonth}/${startYear} for a duration of ${monthCount} months.
  Include Purnima, Amavasya, Pratipada, Ekadashi, and major Festivals like Durga Puja, Lakshmi Puja, Kali Puja, Saraswati Puja, etc.
  Ensure dates are accurate for the India/Bangladesh region (IST/BST). 
  Each entry must have: 
  - date: The Gregorian date (YYYY-MM-DD) on which the event is primarily observed.
  - name: English name
  - banglaName: in Bengali script
  - startDateTime: Absolute ISO 8601 timestamp of when the Tithi or Puja mahuratam begins.
  - endDateTime: Absolute ISO 8601 timestamp of when it ends.
  - description: English significance
  - type: One of: Purnima, Amavasya, Pratipada, Ekadashi, Festival, Other.
  Ensure the output is strictly a valid JSON array.`;

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
              startDateTime: { type: Type.STRING },
              endDateTime: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["date", "name", "banglaName", "startDateTime", "endDateTime", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching Tithis range:", error);
    return [];
  }
};

export const getTithiAdvice = async (tithi: TithiEvent): Promise<string> => {
  const prompt = `Explain the spiritual and cultural significance of ${tithi.name} (${tithi.banglaName}) in Bengali culture. 
  Provide tips for rituals or activities associated with this specific day. Keep it warm and informative. 
  The response MUST be strictly in Bengali (বাংলা) language.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text || "এই তিথি সম্পর্কে কোনো তথ্য পাওয়া যায়নি।";
  } catch (error) {
    return "দুঃখিত, এই মুহূর্তে তথ্য লোড করা সম্ভব হচ্ছে না।";
  }
};
