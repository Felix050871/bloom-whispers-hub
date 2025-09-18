import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Heart, Target, Lock, Calendar } from 'lucide-react';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: any;
  onProfileUpdate: () => void;
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

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  open,
  onOpenChange,
  userProfile,
  onProfileUpdate
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    birth_year: '',
    interests: [] as string[],
    goals: [] as string[]
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [moods, setMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile && open) {
      setFormData({
        name: userProfile.name || '',
        birth_year: userProfile.birth_year || '',
        interests: userProfile.interests || [],
        goals: userProfile.goals || []
      });
      fetchMoods();
    }
  }, [userProfile, open]);

  const fetchMoods = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    setMoods(data || []);
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
          interests: formData.interests,
          goals: formData.goals
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profilo aggiornato",
        description: "Le tue informazioni sono state salvate con successo."
      });

      onProfileUpdate();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Errore",
        description: "Le password non corrispondono",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Errore",
        description: "La password deve essere di almeno 6 caratteri",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password aggiornata",
        description: "La tua password è stata cambiata con successo."
      });

      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (level: number) => {
    const emojis = ['😔', '😐', '🙂', '😊', '😄'];
    return emojis[level - 1] || '🙂';
  };

  const getMoodLabel = (level: number) => {
    const labels = ['Giù', 'Così così', 'Bene', 'Molto bene', 'Fantastica'];
    return labels[level - 1] || 'Bene';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-bloom-lilac" />
            Gestisci il tuo Profilo
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profilo</TabsTrigger>
            <TabsTrigger value="interests">Interessi</TabsTrigger>
            <TabsTrigger value="moods">Mood</TabsTrigger>
            <TabsTrigger value="security">Sicurezza</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Informazioni Personali
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <Label htmlFor="birth_year">Anno di nascita (opzionale)</Label>
                  <Input
                    id="birth_year"
                    type="number"
                    value={formData.birth_year}
                    onChange={(e) => setFormData(prev => ({ ...prev, birth_year: e.target.value }))}
                    placeholder="1990"
                    min="1900"
                    max="2010"
                  />
                </div>
                <Button onClick={handleUpdateProfile} disabled={loading} className="w-full">
                  Salva Modifiche
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  I tuoi Interessi
                </CardTitle>
                <CardDescription>
                  Scegli ciò che ti ispira di più
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {PETALS.map((petal) => (
                    <button
                      key={petal.id}
                      onClick={() => handleInterestToggle(petal.id)}
                      className={`card-petal p-3 text-center transition-all hover:scale-105 ${
                        formData.interests.includes(petal.id)
                          ? 'ring-2 ring-bloom-lilac bg-bloom-lilac/10'
                          : 'hover:bg-white/80'
                      }`}
                    >
                      <div className="text-xl mb-1">{petal.emoji}</div>
                      <div className="text-xs font-medium">{petal.name}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    I tuoi Obiettivi
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {GOALS.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => handleGoalToggle(goal.id)}
                        className={`card-petal p-3 text-center transition-all hover:scale-105 ${
                          formData.goals.includes(goal.id)
                            ? 'ring-2 ring-bloom-lilac bg-bloom-lilac/10'
                            : 'hover:bg-white/80'
                        }`}
                      >
                        <div className="font-medium text-sm mb-1">{goal.name}</div>
                        <div className="text-xs text-muted-foreground">{goal.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleUpdateProfile} disabled={loading} className="w-full">
                  Salva Modifiche
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moods" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Cronologia Mood
                </CardTitle>
                <CardDescription>
                  I tuoi ultimi 10 mood registrati
                </CardDescription>
              </CardHeader>
              <CardContent>
                {moods.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nessun mood registrato ancora
                  </p>
                ) : (
                  <div className="space-y-3">
                    {moods.map((mood) => (
                      <div key={mood.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getMoodEmoji(mood.mood_level)}</span>
                          <div>
                            <p className="font-medium">{getMoodLabel(mood.mood_level)}</p>
                            {mood.note && (
                              <p className="text-sm text-muted-foreground">{mood.note}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(mood.created_at).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Cambia Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="new-password">Nuova Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Almeno 6 caratteri"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Conferma Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ripeti la nuova password"
                  />
                </div>
                <Button 
                  onClick={handleChangePassword} 
                  disabled={loading || !newPassword || !confirmPassword}
                  className="w-full"
                >
                  Cambia Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};