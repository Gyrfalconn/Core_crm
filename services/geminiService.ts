import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initialization must use named parameter and directly use process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartLeadInsight = async (leadName: string, company: string, score: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a 2-sentence strategic advice for sales representative to handle a lead named ${leadName} from ${company} who has a high-priority lead score of ${score}/100.`,
      config: {
        temperature: 0.7,
        // Fix: maxOutputTokens requires a corresponding thinkingBudget for Gemini 3 series models
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 50 },
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight error:", error);
    return "Focus on establishing direct communication and identifying key pain points.";
  }
};

export const generateLeadScoreReasoning = async (leadData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this lead and give a 1-sentence reason for its current score of ${leadData.score}: ${JSON.stringify(leadData)}`,
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    return "Score based on historical engagement patterns.";
  }
};