
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const scale = size === 'sm' ? 'scale-50' : size === 'lg' ? 'scale-125' : 'scale-100';
  
  return (
    <div className={`flex flex-col items-center justify-center py-6 text-white ${scale}`}>
      <h1 className="text-2xl font-bold tracking-widest mb-2">
        溝女學(理論)大師
      </h1>
      <div className="relative w-64 h-8 flex items-center justify-center">
         {/* Simple SVG representation of the laurel wreath from the image */}
         <svg viewBox="0 0 200 40" className="w-full h-full opacity-80">
            <path d="M10 25 Q 50 10 100 25 T 190 25" fill="none" stroke="white" strokeWidth="2" />
            {[...Array(12)].map((_, i) => (
              <circle key={`l-${i}`} cx={20 + i * 15} cy={20 + Math.sin(i) * 5} r="3" fill="white" />
            ))}
         </svg>
      </div>
      <div className="text-xl font-mono mt-1 italic">
        hkmixgirl
      </div>
    </div>
  );
};

export const MiniSearchBarLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 bg-[#000] border-2 border-[#00d1c1] rounded p-1 px-2 h-10 w-fit">
      <div className="flex items-center gap-1">
        <div className="w-6 h-6 bg-gradient-to-tr from-purple-500 via-red-500 to-yellow-500 rounded-md flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
        </div>
      </div>
      <div className="bg-white px-4 h-full flex items-center rounded-sm text-black font-semibold text-sm">
        hkmixgirl
      </div>
      <div className="bg-[#00d1c1] h-full flex items-center px-2 rounded-sm cursor-pointer hover:bg-opacity-80 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
    </div>
  );
};
