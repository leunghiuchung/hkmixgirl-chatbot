
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
  "樓主Pin呢個"
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '喂，LM先。有咩溝女理論想請教大師呀？唔好問埋晒啲廢物問題，屌你。' }
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

    const userMsg: Message = { role: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getGeminiResponse(messages, trimmedInput);
    
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border-x border-zinc-800 bg-black shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="flex flex-col items-center bg-zinc-950 border-b border-zinc-800 p-4 shrink-0">
        <Logo size="md" />
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth pb-32"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-[#00d1c1] text-black font-bold shadow-[4px_4px_0px_rgba(0,209,193,0.3)]' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
              } shadow-lg`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-500 px-4 py-2 rounded-2xl animate-pulse italic">
              大師思考緊點樣串你...
            </div>
          </div>
        )}
      </div>

      {/* Input Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-10 px-4 pb-4">
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar scroll-smooth">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className="whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="有咩問題快撚啲問..."
              className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-4 pr-16 focus:outline-none focus:border-[#00d1c1] transition-all text-white placeholder-zinc-600"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 bg-[#00d1c1] hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black px-4 rounded-lg font-black transition-all uppercase tracking-tighter"
            >
              發送
            </button>
          </div>
          
          <div className="flex justify-between items-center px-1">
            <MiniSearchBarLogo />
            <div className="text-[9px] text-zinc-700 font-mono font-bold uppercase tracking-widest">
              HKMIXGIRL ANTI-SIMP SYSTEM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
