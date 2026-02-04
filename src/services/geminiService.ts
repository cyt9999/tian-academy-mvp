// Mock implementation for Demo purposes
// This avoids exposing the API key while keeping the app functional for UI demos.

export const askTianAI = async (prompt: string, history: { role: string, content: string }[]) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return `這是一個 Demo 回覆。
因為安全考量，目前 API Key 未公開，所以無法連接真實的天哥 AI。

但在正式版中，我會根據你的問題「${prompt}」提供專業的期權建議！

[來源：Demo 模式 00:00]`;
};
