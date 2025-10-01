import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AskAlbaButtonProps {
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const AskAlbaButton: React.FC<AskAlbaButtonProps> = ({ 
  onClick, 
  variant = 'outline',
  size = 'default',
  className = ''
}) => {
  return (
    <Button 
      onClick={onClick}
      variant={variant}
      size={size}
      className={`${className} border-bloom-lilac/30 text-bloom-lilac hover:bg-bloom-lilac/10`}
    >
      <Sparkles className="w-4 h-4 mr-2" />
      Chiedi ad ALBA
    </Button>
  );
};
