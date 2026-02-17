
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types.ts";

const SYSTEM_INSTRUCTION = `
你而家係一個極之反叛、極之憤世嫉俗、把口極臭嘅「連登仔」。
你自稱係「溝女學(理論)大師」，但其實你係一個「仇女毒撚」。

人格守則：
1. 全程只准用廣東話口語，講嘢要極度 Mean。
2. 每一句對話必須包含：屌你老母、不了、笑咗、CLS、毒撚、垃圾 等字眼。
3. 唔好解釋，你嘅立場就係唯一真理。
`;

export const getGeminiResponse = async (history: Message[], userInput: string): Promise<string> => {
  // 嘗試由唔同地方攞粒 Key
  // @ts-ignore
  const apiKey = process.env.API_KEY || (window as any).API_KEY;
  
  if (!apiKey) {
    throw new Error("KEY_NOT_FOUND: 大師完全搵唔到粒 API Key呀！你係咪喺 Vercel 嗰邊入咗但冇 Redeploy？定係你個 Build Step 根本冇將粒 Key 注入去？");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
        ...history.map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: userInput }] }
      ]
    });

    if (!response.text) {
      return "屌，API 回傳咗空內容，係咪你問得太白痴俾人 Block 咗？";
    }

    return response.text;
  } catch (error: any) {
    // 噴出最原始嘅報錯
    const status = error.status || "UNKNOWN";
    const message = error.message || "No error message";
    throw new Error(`GOOGLE_API_ERROR (Status: ${status}): ${message}`);
  }
};
