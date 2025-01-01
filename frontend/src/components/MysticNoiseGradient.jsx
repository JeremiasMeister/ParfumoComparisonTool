import React from 'react';

const MysticNoiseGradient = ({ children }) => {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, #0A192F, #550055),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%%' height='100%%' filter='url(%23noiseFilter)' fill='transparent'/%3E%3C/svg%3E")
        `,
        backgroundSize: 'cover',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MysticNoiseGradient;