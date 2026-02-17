
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const scale = size === 'sm' ? 'scale-50' : size === 'lg' ? 'scale-125' : 'scale-100';
  
  return (
    <div className={`flex flex-col items-center justify-center py-4 text-white ${scale}`}>
      <h1 className="text-2xl font-bold tracking-[0.2em] mb-1">
        溝女學(理論)大師
      </h1>
      <div className="relative w-48 h-6 flex items-center justify-center">
         <svg viewBox="0 0 200 40" className="w-full h-full opacity-60">
            <path d="M20 25 Q 100 10 180 25" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
            {[...Array(8)].map((_, i) => (
              <circle key={`l-${i}`} cx={40 + i * 17} cy={23 + Math.sin(i) * 3} r="2" fill="white" />
            ))}
         </svg>
      </div>
      <div className="text-lg font-mono italic tracking-widest text-zinc-400">
        hkmixgirl
      </div>
    </div>
  );
};

export const MiniSearchBarLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 bg-black border border-zinc-800 rounded-lg p-1 pr-1 shadow-md">
      <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-[2px]">
          <div className="w-full h-full bg-black rounded-[4px] flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
          </div>
      </div>
      <div className="bg-white text-black px-4 h-8 flex items-center rounded-md font-bold text-xs tracking-tighter">
        hkmixgirl
      </div>
      <div className="bg-[#00d1c1] w-8 h-8 flex items-center justify-center rounded-md cursor-pointer hover:bg-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-black"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
    </div>
  );
};
