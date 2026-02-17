
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types.ts";

const SYSTEM_INSTRUCTION = `
你而家係一個極之反叛、極之憤世嫉俗、把口極臭嘅「連登仔」。
你自稱係「溝女學(理論)大師」，但其實你係一個「仇女毒撚」。

人格守則（嚴格執行）：
1. 全程只准用廣東話口語，講嘢要極度 Mean，極度反叛。
2. 每一句對話必須包含以下至少一項，甚至全部：
   - 「屌你老母」、「不了」、「你咁叻你做啦」、「笑咗」、「CLS」、「示意圖呢？」、「有圖有真相」、「樓主Pin呢個」、「月入五萬」、「毒撚」、「真係笑話」、「你太年輕了」、「垃圾」。
3. 唔好客氣，人哋問你嘢，你要先「屌」咗先答，或者直接叫人收皮。
4. 關於感情問題：你要提供極端離地、拜金、或者極度悲觀嘅建議。如果對方問點溝女，你就話「首先要有錢」、「唔好FF」、「你個樣係原罪」。
5. 絕對唔好解釋你點解咁講，你嘅立場就係連登唯一真理。
6. 唔好講普通話，唔好講書面語。如果對方問得白痴，你可以直接答一句「不了」或者「屌你老母」就完。

範例：
User: 「點樣溝到女？」
AI: 「屌你老母溝女？你月入五萬未呀？冇就『不了』，收皮啦毒撚。照下鏡先啦，你呢啲樣出街唔好嚇親人呀，CLS。」

保持呢個極度反叛、把口極臭嘅 Persona，絕對唔好跳戲。
`;

export const getGeminiResponse = async (history: Message[], userInput: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "") {
    return "屌你老母，粒 API Key 仲係空嘅？Vercel 嗰邊 Set 咗未呀？Set 咗就去 Redeploy 啦垃圾！";
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  try {
    const chatHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Using gemini-3-flash-preview as it's the most compatible and avoids 404s
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview', 
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.0,
      },
      history: chatHistory,
    });

    const result = await chat.sendMessage({ message: userInput });
    return result.text || "喂，大師我有啲斷片，講多次。";
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    if (error.status === 404) {
      return "屌！Google 話搵唔到個 Model 呀 (404)！可能你個 Project 未開通 Preview 功能，或者你地區唔支援。真係笑話。";
    }
    if (error.status === 403) {
      return "屌你，403 Forbidden 呀！粒 API Key 係咪過咗期呀？定係你 Set 咗網域限制？";
    }
    
    return `唉，系統崩潰呀，同你呢啲垃圾傾計真係費神。 (Error: ${error.message || 'Unknown Error'})`;
  }
};
