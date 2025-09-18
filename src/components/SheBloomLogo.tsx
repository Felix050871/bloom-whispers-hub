import React from 'react';

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
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-3xl' }
  };

  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Pittogramma a fiore */}
      <div className="relative">
        <svg 
          width={icon} 
          height={icon} 
          viewBox="0 0 48 48" 
          className="text-bloom-lilac"
        >
          {/* Petali */}
          <path
            d="M24 12 C19 8, 12 12, 15 20 C8 17, 4 24, 12 27 C8 32, 15 39, 23 36 C20 44, 27 48, 30 40 C38 43, 42 36, 34 33 C41 28, 34 21, 26 24 C29 16, 22 12, 24 12 Z"
            fill="currentColor"
            opacity="0.8"
            className="animate-pulse"
          />
          {/* Centro del fiore */}
          <circle
            cx="24"
            cy="24"
            r="4"
            fill="currentColor"
            className="text-vital-red"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={`font-erstoria font-medium text-foreground ${text}`}>
          SheBloom
        </span>
      )}
    </div>
  );
};