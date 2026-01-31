
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-sky-50">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
          alt="Hero background"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/30 via-transparent to-sky-50" />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none animate-fade-in-up text-slate-900 drop-shadow-sm">
          BLAIR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-slate-900">
            PHOTOGRAPHY
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in font-medium" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          Welcome to the digital atelier of Blair. Where high-end commercial photography meets soulful visual storytelling.
        </p>
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-2xl"
        >
          Explore Work
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  );
};

export default Hero;
