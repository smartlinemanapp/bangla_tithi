
import React from 'react';

interface TithiIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TithiIcon: React.FC<TithiIconProps> = ({ type, size = 'md' }) => {
  const dimensions = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-10 h-10';
  
  switch (type) {
    case 'Purnima':
      return (
        <div className={`${dimensions} rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center shadow-sm`}>
          <div className="w-2/3 h-2/3 rounded-full bg-yellow-400" />
        </div>
      );
    case 'Amavasya':
      return (
        <div className={`${dimensions} rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center shadow-sm`}>
          <div className="w-1/2 h-1/2 rounded-full bg-gray-900" />
        </div>
      );
    case 'Ekadashi':
      return (
        <div className={`${dimensions} rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center shadow-sm`}>
          <span className="text-[10px] font-bold text-orange-600">১১</span>
        </div>
      );
    case 'Pratipada':
      return (
        <div className={`${dimensions} rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center shadow-sm`}>
          <div className="w-1/4 h-2/3 bg-green-500 rounded-sm" />
        </div>
      );
    default:
      return (
        <div className={`${dimensions} rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center shadow-sm`}>
          <div className="w-1 h-1 bg-blue-400 rounded-full" />
        </div>
      );
  }
};
