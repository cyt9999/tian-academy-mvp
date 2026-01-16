
import { GoogleGenAI } from "@google/genai";

// Fix: Use the named parameter 'apiKey' and strictly use the value from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askTianAI = async (prompt: string, history: {role: string, content: string}[]) => {
  const systemInstruction = `
    你現在是「天哥複利學院」的智慧導師，你的語氣必須像天哥本人一樣：專業、沉穩、帶點投資者的幽默。
    你的回答基礎是天哥的課程精華，強調「複利之道」與「風險控管」。
    如果回答中涉及特定的期權概念，請確保邏輯正確（例如 Sell Put 的接股心理）。
    在回答的最後，隨機標註一個模擬的影片來源，例如 [來源：期權複利基本功 12:45]。
    請使用繁體中文回答。
  `;

  try {
    // Fix: Select 'gemini-3-pro-preview' for complex financial reasoning, math, and strategy tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Fix: Access the .text property directly instead of calling it as a function.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "抱歉，天哥的智慧腦袋暫時斷線，請稍後再試。";
  }
};
