
import React, { useState, useRef, useEffect } from 'react';
import { Logo, MiniSearchBarLogo } from './components/Logo.tsx';
import { Message } from './types.ts';
import { getGeminiResponse } from './services/geminiService.ts';

const QUICK_REPLIES = [
  "屌你老母",
  "不了",
  "你咁叻你做啦",
  "示意圖呢？",
  "CLS",
  "月入五萬",
  "笑咗",
  "樓主Pin呢個",
  "有圖有真相"
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '喂，LM先。有咩溝女理論想請教大師呀？唔好問埋晒啲廢物問題，屌你老母。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string = input) => {
    const trimmedInput = textToSend.trim();
    if (!trimmedInput || isLoading) return;

    const currentHistory = [...messages];
    const userMsg: Message = { role: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getGeminiResponse(currentHistory, trimmedInput);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "屌，斷咗線呀，係咪你粒 API Key 廢架？定係你未 Redeploy 呀？" }]);
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
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-48 pt-4"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Profile Avatar Placeholder */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${msg.role === 'user' ? 'bg-[#00d1c1] text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {msg.role === 'user' ? 'U' : '大師'}
                </div>
                
                <div 
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-[#00d1c1] text-black font-bold rounded-tr-none shadow-[2px_2px_0px_#00a396]' 
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none'
                  } shadow-lg`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.text}</p>
                </div>
            </div>
            {msg.role === 'model' && (
                <div className="flex gap-3 mt-1 ml-10 text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">
                   <button className="hover:text-zinc-400 transition-colors">正評 (0)</button>
                   <button className="hover:text-red-500 transition-colors">負評 (99+)</button>
                   <button className="hover:text-[#00d1c1] transition-colors">回覆</button>
                </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-zinc-700 animate-pulse">大師</div>
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-500 px-4 py-3 rounded-2xl rounded-tl-none animate-pulse italic text-sm">
              大師思考緊點樣「屌」你...
            </div>
          </div>
        )}
      </div>

      {/* Input Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black pt-12 px-4 pb-6 z-20">
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar scroll-smooth">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className="whitespace-nowrap bg-zinc-900 hover:bg-[#00d1c1] hover:text-black border border-zinc-700 text-zinc-400 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-90"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-4">
          <div className="relative group">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="有咩問題快撚啲問，廢柴..."
              className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl px-5 py-5 pr-20 focus:outline-none focus:border-[#00d1c1] transition-all text-white placeholder-zinc-700 shadow-inner"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-3 bottom-3 bg-[#00d1c1] hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black px-5 rounded-xl font-black transition-all uppercase tracking-tighter"
            >
              發送
            </button>
          </div>
          
          <div className="flex justify-between items-center px-1">
            <MiniSearchBarLogo />
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-700 font-black uppercase tracking-widest leading-none mb-1">
                  HKMIXGIRL ANTI-SIMP SYSTEM
                </span>
                <span className="text-[8px] text-zinc-800 font-mono tracking-tighter">
                  CONNECTION STATUS: {process.env.API_KEY ? 'SECURED' : 'KEY_MISSING'}
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
