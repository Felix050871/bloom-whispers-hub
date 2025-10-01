import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield } from 'lucide-react';
import { AlbaChat } from './AlbaChat';
import { AlbaSOS } from './AlbaSOS';
import { useNavigate } from 'react-router-dom';

interface AlbaFABProps {
  category?: string;
}

export const AlbaFAB: React.FC<AlbaFABProps> = ({ category }) => {
  const [showChat, setShowChat] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const navigate = useNavigate();

  const handleBookExpert = () => {
    setShowChat(false);
    navigate('/', { state: { activeSection: 'booking' } });
  };

  return (
    <>
      {/* FAB Container - Fixed position */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-40">
        {/* ALBA SOS Button */}
        <Button
          onClick={() => setShowSOS(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-vital-red hover:bg-vital-red/90 text-white"
          aria-label="ALBA SOS - Aiuto emergenze"
        >
          <Shield className="w-6 h-6" />
        </Button>

        {/* ALBA Chat Button */}
        <Button
          onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-bloom-lilac to-bloom-lilac/80 hover:from-bloom-lilac/90 hover:to-bloom-lilac/70 text-white"
          aria-label="Chiedi ad ALBA"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </div>

      {/* ALBA Chat Component */}
      {showChat && (
        <AlbaChat 
          category={category} 
          onClose={() => setShowChat(false)}
          onBookExpert={handleBookExpert}
        />
      )}

      {/* ALBA SOS Component */}
      <AlbaSOS 
        isOpen={showSOS}
        onClose={() => setShowSOS(false)}
      />
    </>
  );
};
