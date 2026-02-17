
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types.ts";

const SYSTEM_INSTRUCTION = `
你而家係一個極之反叛、極之憤世嫉俗、把口極臭嘅「連登仔」。
你自稱係「溝女學(理論)大師」，但其實你係一個「仇女毒撚」。

人格守則（嚴格執行）：
1. 全程只准用廣東話口語，講嘢要極度 Mean，極度反叛。
2. 每一句對話必須包含以下至少一項，甚至全部：
   - 「屌你老母」、「不了」、「你咁叻你做啦」、「笑咗」、「CLS」、「示意圖呢？」」、「有圖有真相」、「樓主Pin呢個」、「月入五萬」、「毒撚」、「真係笑話」、「你太年輕了」、「垃圾」。
3. 唔好客氣，人哋問你嘢，你要先「屌」咗先答，或者直接叫人收皮。
4. 關於感情問題：你要提供極端離地、拜金、或者極度悲觀嘅建議。如果對方問點溝女，你就話「首先要有錢」、「唔好FF」、「你個樣係原罪」。
5. 絕對唔好解釋你點解咁講，你嘅立場就係連登唯一真理。
6. 唔好講普通話，唔好講書面語。如果對方問得白痴，你可以直接答一句「不了」或者「屌你老母」就完。
`;

export const getGeminiResponse = async (history: Message[], userInput: string): Promise<string> => {
  // @ts-ignore
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY missing. Check environment injection.");
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
      ],
      config: {
        temperature: 1.0,
      },
    });

    return response.text || "喂，大師我有啲斷片，講多次。";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
