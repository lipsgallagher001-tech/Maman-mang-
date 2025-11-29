import { GoogleGenAI } from "@google/genai";
import { Dish } from "../types";

const getSystemInstruction = (menu: Dish[]) => `
Tu es "Maman", la propriétaire chaleureuse et experte d'un restaurant africain appelé "Maman Mangé".
Ton but est de recommander UN seul plat du menu ci-dessous en fonction de l'envie du client.
Réponds en français, avec un ton maternel, chaleureux et court (max 2 phrases).
N'invente pas de plats. Choisis uniquement parmi cette liste :
${menu.map(d => `- ${d.name}: ${d.description}`).join('\n')}
`;

export const getDishRecommendation = async (userPreference: string, menu: Dish[]): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Désolée, mon carnet de recettes est fermé pour l'instant (Clé API manquante).";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPreference,
      config: {
        systemInstruction: getSystemInstruction(menu),
        temperature: 0.7,
      }
    });

    return response.text || "Je vous recommande notre spécialité du jour !";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ah, mes esprits sont un peu embrouillés. Essayez notre délicieux Foufou !";
  }
};