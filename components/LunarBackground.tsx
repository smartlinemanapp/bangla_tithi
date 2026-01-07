
import React from 'react';

interface LunarBackgroundProps {
  type: string;
}

export const LunarBackground: React.FC<LunarBackgroundProps> = ({ type }) => {
  const getMoonPath = () => {
    // Simplified SVG paths/circles for moon phases
    switch (type) {
      case 'Purnima':
        return (
          <g className="animate-pulse-slow">
            <circle cx="50" cy="50" r="40" fill="url(#purnimaGradient)" filter="url(#glow)" />
          </g>
        );
      case 'Amavasya':
        return (
          <g>
            <circle cx="50" cy="50" r="40" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="40" fill="url(#amavasyaTexture)" opacity="0.4" />
            {/* Faint rim light */}
            <circle cx="50" cy="50" r="40.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </g>
        );
      case 'Ekadashi':
        return (
          <g className="animate-float">
             <circle cx="50" cy="50" r="40" fill="#eee" opacity="0.1" />
             <path d="M 50 10 A 40 40 0 1 1 50 90 A 25 40 0 1 0 50 10" fill="url(#ekadashiGradient)" filter="url(#glow-sm)" />
          </g>
        );
      case 'Pratipada':
        return (
          <g className="animate-float-slow">
             <circle cx="50" cy="50" r="40" fill="#eee" opacity="0.1" />
             <path d="M 50 10 A 40 40 0 0 1 50 90 A 35 40 0 0 0 50 10" fill="url(#pratipadaGradient)" filter="url(#glow-sm)" />
          </g>
        );
      default:
        return <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.05)" />;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 group-hover:opacity-30 transition-opacity duration-700">
      <svg viewBox="0 0 100 100" className="w-full h-full scale-150 translate-x-1/4 translate-y-1/4 rotate-12">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-sm" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <radialGradient id="purnimaGradient" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff9e6" />
            <stop offset="70%" stopColor="#ffd966" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>

          <radialGradient id="ekadashiGradient" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </radialGradient>

          <linearGradient id="pratipadaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d1d5db" />
          </linearGradient>

          <pattern id="amavasyaTexture" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
             <circle cx="2" cy="2" r="0.5" fill="white" opacity="0.2" />
             <circle cx="8" cy="7" r="0.3" fill="white" opacity="0.1" />
          </pattern>
        </defs>
        
        {getMoonPath()}
      </svg>
      
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-2px, -3px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(1px, 2px) rotate(1deg); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
