import React from 'react';

const PerfumeBottle = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bottle outline - transparent with border */}
    <g className="stroke-purple-600" fill="none" strokeWidth="1.5">
      {/* Bottle neck */}
      <rect x="10" y="2" width="4" height="3" />
      {/* Bottle cap */}
      <rect x="9" y="1" width="6" height="1.5" rx="0.5" />
      {/* Bottle body */}
      <path d="M6 9C6 7 8 5 12 5C16 5 18 7 18 9V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V9Z" />
    </g>
    
    {/* Filling liquid */}
    <g>
      <rect
        x="6"
        y="22"
        width="12"
        height="17"
        className="fill-purple-600/80 animate-rise"
      />
    </g>
  </svg>
);

const LoadingAnimation = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Main animation container */}
      <div className="relative w-32 h-32">
        {/* Outer spinning ring */}
        <div className="absolute w-full h-full border-4 border-purple-300/30 rounded-full" />
        <div className="absolute w-full h-full border-4 border-purple-600 rounded-full border-t-transparent animate-spin" />

        {/* Inner spinning ring */}
        <div className="absolute inset-4">
          <div className="w-full h-full border-4 border-purple-300/30 rounded-full" />
          <div 
            className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin" 
            style={{ animationDirection: 'reverse', animationDuration: '3s' }}
          />
        </div>

        {/* Center perfume bottle */}
        <div className="absolute inset-8 flex items-center justify-center">
          <PerfumeBottle className="w-10 h-10" />
        </div>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      {/* Loading text */}
      <div className="text-white text-lg animate-pulse">
        {text}
      </div>
    </div>
  );
};

// Add this to your tailwind.config.js
/*
module.exports = {
  theme: {
    extend: {
      keyframes: {
        rise: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-17px)' }
        }
      },
      animation: {
        rise: 'rise 2s infinite alternate'
      }
    }
  }
}
*/

export default LoadingAnimation;