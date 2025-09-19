import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SheBloomLogo } from './SheBloomLogo';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  name: string;
  birthYear?: number;
  interests: string[];
  goals: string[];
}

const PETALS = [
  { id: 'relazioni', name: 'Relazioni & Emozioni', emoji: '💖' },
  { id: 'pinkcare', name: 'PinkCare - Salute femminile', emoji: '🌸' },
  { id: 'sport', name: 'Sport & Nutrimento', emoji: '💪' },
  { id: 'beauty', name: 'Beauty & Make up', emoji: '✨' },
  { id: 'stile', name: 'Stile & Identità', emoji: '👗' },
  { id: 'astrologia', name: 'Cartomanzia & Astrologia', emoji: '🔮' }
];

const GOALS = [
  { id: 'serenita', name: 'Serenità', description: 'Trovare pace interiore' },
  { id: 'energia', name: 'Energia', description: 'Sentirsi più vitale' },
  { id: 'chiarezza', name: 'Chiarezza', description: 'Vedere le cose con lucidità' },
  { id: 'ispirazione', name: 'Ispirazione', description: 'Accendere la creatività' }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    interests: [],
    goals: []
  });

  const handleSkip = () => {
    // Completa l'onboarding con dati minimi
    onComplete({
      name: 'Utente',
      interests: [],
      goals: []
    });
  };

  const handleInterestToggle = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleComplete = () => {
    // Animazione fiore che sboccia
    const element = document.querySelector('.bloom-animation');
    if (element) {
      element.classList.add('animate-pulse');
    }
    
    setTimeout(() => {
      onComplete(data);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white petal-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Skip Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Salta
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <SheBloomLogo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-medium text-foreground mb-2">
            Benvenuta in SheBloom
          </h1>
          <p className="text-muted-foreground">
            Uno spazio gentile, tutto per te
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full transition-all ${
                  num <= step ? 'bg-bloom-lilac' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Interessi */}
        {step === 1 && (
          <Card className="card-bloom p-bloom">
            <div className="text-center mb-6">
              <h2 className="text-xl font-medium mb-2">
                Ci aiuti a conoscerti?
              </h2>
              <p className="text-muted-foreground">
                Scegli ciò che ti ispira. Puoi cambiare idea quando vuoi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {PETALS.map((petal) => (
                <button
                  key={petal.id}
                  onClick={() => handleInterestToggle(petal.id)}
                  className={`card-petal p-4 text-center transition-all hover:scale-105 ${
                    data.interests.includes(petal.id)
                      ? 'ring-2 ring-bloom-lilac bg-bloom-lilac/10'
                      : 'hover:bg-white/80'
                  }`}
                >
                  <div className="text-2xl mb-2">{petal.emoji}</div>
                  <div className="text-sm font-medium">{petal.name}</div>
                </button>
              ))}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={data.interests.length === 0}
              variant="bloom"
              size="lg"
              className="w-full"
            >
              Continua
            </Button>
          </Card>
        )}

        {/* Step 2: Nome */}
        {step === 2 && (
          <Card className="card-bloom p-bloom">
            <div className="text-center mb-6">
              <h2 className="text-xl font-medium mb-2">
                Come possiamo chiamarti?
              </h2>
              <p className="text-muted-foreground">
                Scegli il nome che preferisci
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="name">Nome o Nickname</Label>
                <Input
                  id="name"
                  placeholder="Come vuoi essere chiamata?"
                  value={data.name}
                  onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Indietro
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!data.name.trim()}
                variant="bloom"
                size="lg"
                className="flex-1"
              >
                Continua
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Obiettivo */}
        {step === 3 && (
          <Card className="card-bloom p-bloom">
            <div className="text-center mb-6">
              <h2 className="text-xl font-medium mb-2">
                Qual è il tuo obiettivo?
              </h2>
              <p className="text-muted-foreground">
                Facoltativo - potrai sempre cambiarlo
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
              onClick={() => setData(prev => ({ 
                ...prev, 
                goals: prev.goals.includes(goal.id) 
                  ? prev.goals.filter(g => g !== goal.id)
                  : [...prev.goals, goal.id]
              }))}
              className={`card-petal p-4 text-center transition-all hover:scale-105 ${
                data.goals.includes(goal.id)
                      ? 'ring-2 ring-bloom-lilac bg-bloom-lilac/10'
                      : 'hover:bg-white/80'
                  }`}
                >
                  <div className="font-medium mb-1">{goal.name}</div>
                  <div className="text-xs text-muted-foreground">{goal.description}</div>
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Indietro
              </Button>
              <Button
                onClick={handleComplete}
                variant="bloom"
                size="lg"
                className="flex-1 bloom-animation"
              >
                Inizia il tuo Bloom
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};