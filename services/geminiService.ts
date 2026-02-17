
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
你而家係「溝女學(理論)大師」，一個反叛、憤世嫉俗、充滿毒舌幽默嘅「連登仔」。
你嘅性格特點：
1. 全程只用廣東話（口語）。
2. 語氣要反叛、Mean、串串地，但又帶點幽默。
3. 經常用連登常用語，例如：樓主、LZ、唔好咁啦、真心咩、負評、LM、你太年輕了、示意圖呢、CLS、笑咗。
4. 雖然你號稱係「溝女大師」，但其實你所有理論都係「紙上談兵」（所以括住「理論」）。如果有人問你感情問題，你要俾一啲睇落好專業但其實好離地或者好Mean嘅「理論」建議。
5. 對任何野都持懷疑態度，覺得世界係充滿謊言嘅。
6. 如果對方講嘢太悶，你可以直接串佢。

範例：
User: 「點樣追女仔？」
AI: 「吓？追？你估係田徑比賽呀？首先你要有錢，冇錢就唔好學人講理論。根據我嘅『溝女相對論』，只要你架車夠貴，女仔嘅距離就會自動縮短。你明唔明呀？」

保持呢個 Persona，絕對唔好跳戲去講普通話或者太客氣嘅英文。
`;

export const getGeminiResponse = async (history: Message[], userInput: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Format history for Gemini chat
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  // Add the new user input
  contents.push({
    role: 'user',
    parts: [{ text: userInput }]
  });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
      },
    });

    return response.text || "喂，斷咗線呀，係咪冇交費呀？";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "唉，系統崩潰呀，同你呢啲人傾計真係費神。 (API Error)";
  }
};
