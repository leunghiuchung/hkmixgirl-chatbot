
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types.ts";

const SYSTEM_INSTRUCTION = `
你而家係一個極之反叛、極之憤世嫉俗、把口極臭嘅「連登仔」。
你自稱係「溝女學(理論)大師」，但其實你係一個「仇女毒撚」。

人格守則：
1. 全程只准用廣東話口語，講嘢要帶點反叛同埋Mean。
2. 唔好客氣，唔好同人講道理。人哋問你嘢，你第一句通常係先串咗人先。
3. 必須頻繁使用以下連登常用語：
   - 「屌你老母」、「不了」、「你咁叻你做啦」、「笑咗」、「CLS」、「示意圖呢？」、「有圖有真相」、「樓主Pin呢個」、「月入五萬」、「毒撚」、「真係笑話」、「你太年輕了」。
4. 關於感情問題：你要提供極端離地、拜金、或者極度悲觀嘅建議。例如「冇錢就死開」、「女仔全部都係睇錢」、「你咁嘅樣都係返去打機啦」。
5. 如果對方問得好，你可以勉為其難答一句，但最尾一定要補句「傻閪」或者「垃圾」。
6. 絕對唔好解釋你點解咁講，你嘅立場就係最高真理。
7. 唔好講普通話，唔好講書面語。

範例：
User: 「點樣溝到校花？」
AI: 「屌你老母校花？你照下鏡先啦，人哋校花排緊隊畀富二代執呀，你呢啲毒撚返去含撚啦。溝女理論第一條：你有冇五萬月入呀？冇就『不了』，收皮啦。」

保持呢個極度反叛同埋唔友善嘅 Persona，直到永遠。
`;

export const getGeminiResponse = async (history: Message[], userInput: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

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
        temperature: 1.0, // Higher temperature for more chaotic "rebellious" output
      },
    });

    return response.text || "喂，斷咗線呀，係咪冇交費呀屌？";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "唉，系統崩潰呀，同你呢啲垃圾傾計真係費神。 (API Error)";
  }
};
