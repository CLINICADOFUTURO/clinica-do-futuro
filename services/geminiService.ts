import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const summarizeAnamnesis = async (notes: string): Promise<string> => {
  if (!apiKey) return "API Key not configured. (Mock: Patient reports sensitivity in lower molars.)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a dental assistant. Summarize the following raw notes into a professional medical anamnesis entry. Keep it concise (max 2 sentences). Notes: ${notes}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating summary.";
  }
};

export const generateReceiptText = async (patientName: string, amount: number, service: string): Promise<string> => {
  if (!apiKey) return `Receipt for ${patientName} - $${amount} for ${service}. (Mock)`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a polite and professional text for a dental service receipt/payment confirmation. 
      Patient: ${patientName}. 
      Amount: R$ ${amount}. 
      Service: ${service}. 
      Include placeholders for date and signature. Write it in Portuguese.`,
    });
    return response.text || "Could not generate receipt.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating receipt.";
  }
};