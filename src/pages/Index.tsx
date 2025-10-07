import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Onboarding, OnboardingData } from '@/components/Onboarding';
import { AppLayout } from '@/components/AppLayout';
import { BloomDaily } from '@/components/BloomDaily';
import { BloomSessions } from '@/components/BloomSessions';
import { SocialBloom } from '@/components/SocialBloom';
import { MoodTracker } from '@/components/MoodTracker';
import { AlbaFollowups } from '@/components/AlbaFollowups';
import { UserProfileDialog } from '@/components/UserProfileDialog';
import { SOSContactsSettings } from '@/components/SOSContactsSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Heart, Users, TrendingUp, BookOpen, UserCheck, Bell, Moon, Shield, Globe } from 'lucide-react';
import { WalletCard } from '@/components/WalletCard';
import { AppointmentsCalendar } from '@/components/AppointmentsCalendar';
import { BookingInterface } from '@/components/BookingInterface';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    language: 'it'
  });

  // Update active section from navigation state
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location.state]);

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
        .maybeSingle();

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

  const displayName = (userProfile?.name && userProfile.name.toLowerCase() !== 'utente' ? userProfile.name : user?.user_metadata?.name) || '';
  
  const handleSettingToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    toast({
      title: "Impostazioni aggiornate",
      description: "Le modifiche sono state salvate."
    });
  };

  const renderContent = () => {
    if (activeSection === 'profile') {
      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Il Tuo Profilo
            </h1>
            <Button onClick={() => setProfileDialogOpen(true)}>
              Modifica Profilo
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Personali</CardTitle>
              <CardDescription>I tuoi dati e preferenze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{userProfile?.name || 'Non impostato'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userProfile?.email || user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data di nascita</p>
                  <p className="font-medium">{userProfile?.birth_date ? new Date(userProfile.birth_date).toLocaleDateString('it-IT') : 'Non impostato'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interessi</p>
                  <p className="font-medium">{userProfile?.interests?.length || 0} selezionati</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caratteristiche Fisiche</CardTitle>
              <CardDescription>Per consigli personalizzati</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {userProfile?.height_cm && (
                  <div>
                    <p className="text-sm text-muted-foreground">Altezza</p>
                    <p className="font-medium">{userProfile.height_cm} cm</p>
                  </div>
                )}
                {userProfile?.weight_kg && (
                  <div>
                    <p className="text-sm text-muted-foreground">Peso</p>
                    <p className="font-medium">{userProfile.weight_kg} kg</p>
                  </div>
                )}
                {userProfile?.hair_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Capelli</p>
                    <p className="font-medium">{userProfile.hair_type}</p>
                  </div>
                )}
                {userProfile?.skin_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Pelle</p>
                    <p className="font-medium">{userProfile.skin_type}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'wallet') {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Wallet
          </h1>
          <WalletCard />
        </div>
      );
    }

    if (activeSection === 'settings') {
      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Impostazioni
          </h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifiche
              </CardTitle>
              <CardDescription>Gestisci le tue preferenze di notifica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifiche push</Label>
                  <p className="text-sm text-muted-foreground">
                    Ricevi notifiche per messaggi e aggiornamenti
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={() => handleSettingToggle('notifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notifiche email</Label>
                  <p className="text-sm text-muted-foreground">
                    Ricevi email per contenuti importanti
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleSettingToggle('emailNotifications')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="w-5 h-5 mr-2" />
                Aspetto
              </CardTitle>
              <CardDescription>Personalizza l'aspetto dell'app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Modalità scura</Label>
                  <p className="text-sm text-muted-foreground">
                    Attiva la modalità scura per ridurre l'affaticamento degli occhi
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={() => handleSettingToggle('darkMode')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy e Sicurezza
              </CardTitle>
              <CardDescription>Gestisci le impostazioni di sicurezza</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setProfileDialogOpen(true)}
              >
                Cambia Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
              >
                Gestisci Dati Personali
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Preferenze
              </CardTitle>
              <CardDescription>Impostazioni generali dell'app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">Lingua</Label>
                <p className="text-sm text-muted-foreground mt-1">Italiano</p>
              </div>
            </CardContent>
          </Card>

          {/* SOS ALBA Settings */}
          <SOSContactsSettings />
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
              <BloomDaily userName={displayName} />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'mood') {
      return (
        <div className="max-w-4xl mx-auto">
          <MoodTracker />
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
        action: () => handleSectionChange('mood')
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
        {/* ALBA Follow-ups */}
        <AlbaFollowups />

        {/* Welcome Section */}
        <div className="text-center space-y-2">
          {displayName && (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Ciao {displayName}!
            </h1>
          )}
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
              <BloomDaily userName={displayName} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <>
      <AppLayout 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {renderContent()}
      </AppLayout>

      <UserProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        userProfile={userProfile}
        onProfileUpdate={fetchUserProfile}
      />
    </>
  );
};

export default Index;