
import React from 'react';

interface TithiIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TithiIcon: React.FC<TithiIconProps> = ({ type, size = 'md' }) => {
  const dimensions = size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-12 h-12' : 'w-24 h-24';
  
  const MoonContainer = ({ children, glowColor = "rgba(255,255,255,0.2)" }: { children: React.ReactNode, glowColor?: string }) => (
    <div className={`${dimensions} relative group transition-transform duration-500 hover:scale-110 flex items-center justify-center`}>
      <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: glowColor }}></div>
      {children}
    </div>
  );

  const Craters = () => (
    <g opacity="0.1">
      <circle cx="30" cy="40" r="4" fill="currentColor" />
      <circle cx="65" cy="35" r="6" fill="currentColor" />
      <circle cx="45" cy="65" r="5" fill="currentColor" />
      <circle cx="55" cy="25" r="3" fill="currentColor" />
      <circle cx="35" cy="75" r="3" fill="currentColor" />
    </g>
  );

  const renderIcon = () => {
    switch (type) {
      case 'Purnima':
        return (
          <MoonContainer glowColor="rgba(251, 191, 36, 0.3)">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg text-amber-900/10">
              <defs>
                <radialGradient id="gradPurnima" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#fff9e6" />
                  <stop offset="60%" stopColor="#ffd966" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#gradPurnima)" stroke="#d97706" strokeWidth="1" />
              <Craters />
            </svg>
          </MoonContainer>
        );
      case 'Amavasya':
        return (
          <MoonContainer glowColor="rgba(255, 255, 255, 0.1)">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md text-slate-100/10">
              <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <Craters />
            </svg>
          </MoonContainer>
        );
      case 'Ekadashi':
        return (
          <MoonContainer glowColor="rgba(255, 255, 255, 0.2)">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg text-slate-400/20">
              <defs>
                <linearGradient id="gradEkadashi" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
              </defs>
              {/* Gibbous Phase */}
              <circle cx="50" cy="50" r="45" fill="#1e293b" opacity="0.2" />
              <path d="M 50 5 A 45 45 0 0 1 50 95 A 25 45 0 0 0 50 5" fill="url(#gradEkadashi)" stroke="#64748b" strokeWidth="0.5" />
              <Craters />
            </svg>
          </MoonContainer>
        );
      case 'Pratipada':
        return (
          <MoonContainer glowColor="rgba(255, 255, 255, 0.2)">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg text-slate-400/20">
              <defs>
                <linearGradient id="gradPratipada" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>
              {/* Crescent Phase */}
              <circle cx="50" cy="50" r="45" fill="#1e293b" opacity="0.2" />
              <path d="M 50 5 A 45 45 0 0 1 50 95 A 38 45 0 0 1 50 5" fill="url(#gradPratipada)" stroke="#94a3b8" strokeWidth="0.5" />
            </svg>
          </MoonContainer>
        );
      default:
        return (
          <MoonContainer>
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 text-current">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
              <path d="M 50 30 L 50 70 M 30 50 L 70 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </MoonContainer>
        );
    }
  };

  return renderIcon();
};
