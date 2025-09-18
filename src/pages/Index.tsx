import React, { useState, useEffect } from 'react';
import { Onboarding, OnboardingData } from '@/components/Onboarding';
import { AppLayout } from '@/components/AppLayout';
import { BloomDaily } from '@/components/BloomDaily';
import { BloomSessions } from '@/components/BloomSessions';
import { SocialBloom } from '@/components/SocialBloom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, Users, TrendingUp, BookOpen } from 'lucide-react';
import { WalletCard } from '@/components/WalletCard';
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
              <BloomDaily userName={userData?.name || 'Utente'} />
            </CardContent>
          </Card>
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
        description: "Come ti senti oggi?",
        icon: Heart,
        color: "from-pink-500 to-rose-500",
        action: () => console.log("Track mood")
      },
      {
        title: "Prenota sessione",
        description: "Connettiti con un mentore",
        icon: Calendar,
        color: "from-purple-500 to-indigo-500",
        action: () => console.log("Book session")
      },
      {
        title: "Scrivi nel diario",
        description: "Rifletti sulla tua giornata",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-500",
        action: () => console.log("Write journal")
      },
      {
        title: "Esplora community",
        description: "Trova supporto e ispirazione",
        icon: Users,
        color: "from-green-500 to-emerald-500",
        action: () => console.log("Explore community")
      },
    ];

    const insights = [

      {
        title: "Streak attuale",
        value: "7 giorni",
        description: "Mood tracking consecutivo",
        trend: "+2 rispetto alla settimana scorsa"
      },
      {
        title: "Benessere medio",
        value: "8.2/10",
        description: "Ultimo mese",
        trend: "Stabile rispetto al mese scorso"
      },
      {
        title: "Sessioni completate",
        value: "12",
        description: "Questo mese",
        trend: "+4 rispetto al mese scorso"
      },
    ];

    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Benvenuta nel tuo spazio di benessere
            </h1>
            <p className="text-muted-foreground mt-2">
              Oggi è un nuovo giorno per prenderti cura di te. Come ti senti?
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Daily Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Contenuti di oggi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BloomDaily userName={userData?.name || 'Utente'} />
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  I tuoi progressi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {insights.map((insight, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        {insight.value}
                      </div>
                      <div className="font-medium">
                        {insight.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {insight.description}
                      </div>
                      <div className="text-xs text-green-600">
                        {insight.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Wallet */}
            <WalletCard />

            {/* Community Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SocialBloom />
              </CardContent>
            </Card>

            {/* Quick Session Booking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Prossime sessioni
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BloomSessions />
              </CardContent>
            </Card>
          </div>
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