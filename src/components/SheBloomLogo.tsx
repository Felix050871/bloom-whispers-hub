import React from 'react';
import shebloomIcon from '@/assets/shebloom-icon.png';
import shebloomLogo from '@/assets/shebloom-logo.png';

interface SheBloomLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const SheBloomLogo: React.FC<SheBloomLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeMap = {
    sm: { height: 24, logoHeight: 20 },
    md: { height: 32, logoHeight: 28 },
    lg: { height: 48, logoHeight: 40 }
  };

  const { height, logoHeight } = sizeMap[size];

  return (
    <div className={`flex items-center ${className}`}>
      {showText ? (
        <img 
          src={shebloomLogo} 
          alt="SheBloom" 
          style={{ height: logoHeight }}
          className="object-contain"
        />
      ) : (
        <img 
          src={shebloomIcon} 
          alt="SheBloom" 
          style={{ height: height }}
          className="object-contain"
        />
      )}
    </div>
  );
};