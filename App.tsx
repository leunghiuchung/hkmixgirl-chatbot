
import React, { useState, useRef, useEffect } from 'react';
import { Logo, MiniSearchBarLogo } from './components/Logo.tsx';
import { Message } from './types.ts';
import { getGeminiResponse } from './services/geminiService.ts';

const QUICK_REPLIES = [
  "屌你老母",
  "不了",
  "你咁叻你做啦",
  "笑咗",
  "月入五萬",
  "有圖有真相"
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '喂，LM先。有咩溝女理論想請教大師呀？唔好問埋晒啲廢物問題，屌你老母。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugStatus, setDebugStatus] = useState('Checking...');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 檢查環境變數
    // @ts-ignore
    const key = process.env.API_KEY;
    if (key) {
      setDebugStatus('✅ Key Detected');
    } else {
      setDebugStatus('❌ Key Missing (process.env)');
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string = input) => {
    const trimmedInput = textToSend.trim();
    if (!trimmedInput || isLoading) return;

    const userMsg: Message = { role: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const currentHistory = [...messages];
      const aiResponse = await getGeminiResponse(currentHistory, trimmedInput);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `【大師出事啦】\n${e.message}\n\n睇到呢句野代表 API 唔通。如果你喺 Vercel，記得入完 Key 要揀 "Redeploy" 最新嗰個 Build！` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border-x border-zinc-800 bg-black shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="flex flex-col items-center bg-zinc-950 border-b border-zinc-800 p-4 shrink-0 shadow-md z-10">
        <Logo size="md" />
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-56 pt-4"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${msg.role === 'user' ? 'bg-[#00d1c1] text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {msg.role === 'user' ? 'U' : '大師'}
                </div>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-[#00d1c1] text-black font-bold shadow-[2px_2px_0px_#00a396]' : 'bg-zinc-900 border border-zinc-800 text-zinc-100'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.text}</p>
                </div>
            </div>
            {msg.role === 'model' && (
                <div className="flex gap-3 mt-1 ml-10 text-[10px] text-zinc-600 font-bold uppercase">
                   <button>正評 (0)</button><button>負評 (99+)</button>
                </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="animate-pulse flex items-center gap-2 ml-2">
            <div className="w-2 h-2 bg-[#00d1c1] rounded-full"></div>
            <div className="text-zinc-600 text-xs italic">大師諗緊點樣屌你...</div>
          </div>
        )}
      </div>

      {/* Input Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black pt-12 px-4 pb-4 z-20">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
          {QUICK_REPLIES.map((reply) => (
            <button key={reply} onClick={() => handleSend(reply)} className="whitespace-nowrap bg-zinc-900 border border-zinc-700 text-zinc-400 px-4 py-2 rounded-full text-xs hover:bg-[#00d1c1] hover:text-black">
              {reply}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="問啦垃圾..." className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl px-5 py-4 pr-16 focus:outline-none focus:border-[#00d1c1] text-white" />
            <button onClick={() => handleSend()} className="absolute right-2 top-2 bottom-2 bg-[#00d1c1] text-black px-4 rounded-xl font-black">GO</button>
          </div>
          
          <div className="flex justify-between items-center opacity-50">
            <MiniSearchBarLogo />
            <div className="text-[9px] font-mono text-zinc-500">
              STATUS: <span className={debugStatus.includes('❌') ? 'text-red-500' : 'text-green-500'}>{debugStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
