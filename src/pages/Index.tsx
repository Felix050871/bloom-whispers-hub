import React, { useState, useEffect } from 'react';
import { Onboarding, OnboardingData } from '@/components/Onboarding';
import { TopBar } from '@/components/TopBar';
import { BottomNav } from '@/components/BottomNav';
import { BloomDaily } from '@/components/BloomDaily';
import { BloomSessions } from '@/components/BloomSessions';
import { SocialBloom } from '@/components/SocialBloom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'sessions' | 'social'>('daily');
  const [userProfile, setUserProfile] = useState<any>(null);

  // Check if user has completed onboarding by looking at their profile
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profile) {
      setUserProfile(profile);
      // Check if user has completed onboarding
      if (profile.onboarding_completed) {
        setIsOnboarded(true);
        setUserData({
          name: profile.name,
          birthYear: profile.birth_year,
          interests: profile.interests || [],
          goals: profile.goals || []
        });
      }
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) return;

    // Update user profile with onboarding data and mark as completed
    await supabase
      .from('profiles')
      .update({
        name: data.name,
        birth_year: data.birthYear,
        interests: data.interests,
        goals: data.goals,
        onboarding_completed: true
      })
      .eq('user_id', user.id);

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
      <TopBar 
        userName={userData?.name || 'Bella'} 
        userProfile={userProfile}
        onProfileUpdate={fetchUserProfile}
      />
      
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