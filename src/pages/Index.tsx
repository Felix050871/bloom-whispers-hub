import React, { useState, useEffect } from 'react';
import { Onboarding, OnboardingData } from '@/components/Onboarding';
import { AppLayout } from '@/components/AppLayout';
import { BloomDaily } from '@/components/BloomDaily';
import { BloomSessions } from '@/components/BloomSessions';
import { SocialBloom } from '@/components/SocialBloom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, Users, TrendingUp, BookOpen, UserCheck } from 'lucide-react';
import { WalletCard } from '@/components/WalletCard';
import { AppointmentsCalendar } from '@/components/AppointmentsCalendar';
import { BookingInterface } from '@/components/BookingInterface';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>('home');

  // Check if user has completed onboarding by looking at their profile
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      // Reset states when user logs out
      setIsOnboarded(false);
      setUserData(null);
      setUserProfile(null);
      setActiveSection('home');
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
        console.log('Profile loaded:', profile);
        // Check if user has completed onboarding
        if (profile.onboarding_completed === true) {
          setIsOnboarded(true);
          setUserData({
            name: profile.name,
            birthYear: profile.birth_year,
            interests: profile.interests || [],
            goals: profile.goals || []
          });
        } else {
          // Keep current state to avoid flicker if just completed onboarding
          // Do not force setIsOnboarded(false) here
        }
      } else {
        console.log('No profile found, showing onboarding');
        // Do not flip state here to avoid flicker after completion
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Keep current state on error to avoid flicker
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          birth_year: data.birthYear,
          interests: data.interests,
          goals: data.goals,
          onboarding_completed: true
        })
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('Onboarding completed successfully');
      setIsOnboarded(true);
      setUserData(data);
      // Refresh profile to ensure consistency
      await fetchUserProfile();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleSectionChange = (section: string) => {
    console.log('Changing section to:', section);
    setActiveSection(section);
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    if (activeSection === 'profile') {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Il Tuo Profilo</h1>
          <Card>
            <CardContent className="p-6">
              <p>Sezione profilo in costruzione...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'wallet') {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Wallet</h1>
          <WalletCard />
        </div>
      );
    }

    if (activeSection === 'settings') {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Impostazioni</h1>
          <Card>
            <CardContent className="p-6">
              <p>Sezione impostazioni in costruzione...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'daily') {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Daily Bloom
          </h1>
          <Card>
            <CardContent className="p-6">
              <BloomDaily userName={userProfile?.name || 'Bella'} />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'appointments') {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            I Tuoi Appuntamenti
          </h1>
          <AppointmentsCalendar />
        </div>
      );
    }

    if (activeSection === 'booking') {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Prenota un Appuntamento
          </h1>
          <BookingInterface />
        </div>
      );
    }

    if (activeSection === 'community') {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Community
          </h1>
          <Card>
            <CardContent className="p-6">
              <SocialBloom />
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default home content
    const quickActions = [
      {
        title: "Mood di oggi",
        description: "Come ti senti?",
        icon: Heart,
        color: "from-pink-500 to-rose-500",
        action: () => console.log("Track mood")
      },
      {
        title: "Scrivi nel diario",
        description: "Rifletti sulla giornata",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-500",
        action: () => console.log("Write journal")
      },
      {
        title: "Prenota appuntamento",
        description: "Connettiti con un mentore",
        icon: UserCheck,
        color: "from-purple-500 to-indigo-500",
        action: () => handleSectionChange('booking')
      },
    ];

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Ciao {userProfile?.name || 'Bella'}! 
          </h1>
          <p className="text-muted-foreground">
            Come ti senti oggi?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {quickActions.map((action, index) => (
            <Card key={index} className="group hover:shadow-md transition-all duration-300 cursor-pointer" onClick={action.action}>
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs group-hover:text-primary transition-colors leading-tight">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Content */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <Calendar className="w-5 h-5 text-primary" />
                Contenuti di oggi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BloomDaily userName={userProfile?.name || 'Bella'} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <AppLayout 
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      {renderContent()}
    </AppLayout>
  );
};

export default Index;