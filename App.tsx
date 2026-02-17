
import React, { useState, useRef, useEffect } from 'react';
import { Logo, MiniSearchBarLogo } from './components/Logo';
import { Message } from './types';
import { getGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '喂，LM先。有咩溝女理論想請教大師呀？唔好問埋晒啲廢物問題。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getGeminiResponse(messages, input);
    
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border-x border-zinc-800 bg-black shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="flex flex-col items-center bg-zinc-950 border-b border-zinc-800 p-4">
        <Logo size="md" />
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-[#00d1c1] text-black font-medium' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
              } shadow-lg`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-4 py-2 rounded-2xl animate-pulse">
              大師思考中... (唔好催啦)
            </div>
          </div>
        )}
      </div>

      {/* Footer / Input Area */}
      <footer className="p-4 bg-zinc-950 border-t border-zinc-800">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className="flex-1 relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="輸入你嘅溝女疑問..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00d1c1] transition-all text-white placeholder-zinc-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 bg-[#00d1c1] hover:bg-opacity-80 disabled:opacity-50 text-black px-4 rounded-lg font-bold transition-all"
                >
                  發送
                </button>
             </div>
          </div>
          
          <div className="flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
            <MiniSearchBarLogo />
            <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">
              v1.0 Theory Master | Licensed to HKMIXGIRL
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
