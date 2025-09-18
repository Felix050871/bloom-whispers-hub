import React, { useState } from 'react';
import { Onboarding, OnboardingData } from '@/components/Onboarding';
import { TopBar } from '@/components/TopBar';
import { BottomNav } from '@/components/BottomNav';
import { BloomDaily } from '@/components/BloomDaily';
import { BloomSessions } from '@/components/BloomSessions';
import { SocialBloom } from '@/components/SocialBloom';

const Index = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'sessions' | 'social'>('daily');

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserData(data);
    setIsOnboarded(true);
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'daily':
        return <BloomDaily userName={userData?.name || 'Bella'} />;
      case 'sessions':
        return <BloomSessions />;
      case 'social':
        return <SocialBloom />;
      default:
        return <BloomDaily userName={userData?.name || 'Bella'} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar userName={userData?.name || 'Bella'} />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {renderActiveTab()}
      </main>
      
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Index;
