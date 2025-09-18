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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Heart, Target, Lock, Calendar, Scale, Ruler, Palette, Droplets } from 'lucide-react';

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
    birth_date: '',
    weight_kg: '',
    height_cm: '',
    hair_color: '',
    hair_type: '',
    skin_type: '',
    eye_color: '',
    lifestyle: '',
    fitness_level: '',
    preferred_workout_time: '',
    interests: [] as string[],
    goals: [] as string[],
    allergies: [] as string[],
    health_goals: [] as string[],
    dietary_preferences: [] as string[],
    skin_concerns: [] as string[],
    beauty_goals: [] as string[]
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [moods, setMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile && open) {
      setFormData({
        name: userProfile.name || '',
        birth_date: userProfile.birth_date || '',
        weight_kg: userProfile.weight_kg || '',
        height_cm: userProfile.height_cm || '',
        hair_color: userProfile.hair_color || '',
        hair_type: userProfile.hair_type || '',
        skin_type: userProfile.skin_type || '',
        eye_color: userProfile.eye_color || '',
        lifestyle: userProfile.lifestyle || '',
        fitness_level: userProfile.fitness_level || '',
        preferred_workout_time: userProfile.preferred_workout_time || '',
        interests: userProfile.interests || [],
        goals: userProfile.goals || [],
        allergies: userProfile.allergies || [],
        health_goals: userProfile.health_goals || [],
        dietary_preferences: userProfile.dietary_preferences || [],
        skin_concerns: userProfile.skin_concerns || [],
        beauty_goals: userProfile.beauty_goals || []
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

  const handleArrayToggle = (array: keyof typeof formData, item: string) => {
    setFormData(prev => ({
      ...prev,
      [array]: (prev[array] as string[]).includes(item)
        ? (prev[array] as string[]).filter(i => i !== item)
        : [...(prev[array] as string[]), item]
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
          birth_date: formData.birth_date || null,
          weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
          height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
          hair_color: formData.hair_color || null,
          hair_type: formData.hair_type || null,
          skin_type: formData.skin_type || null,
          eye_color: formData.eye_color || null,
          lifestyle: formData.lifestyle || null,
          fitness_level: formData.fitness_level || null,
          preferred_workout_time: formData.preferred_workout_time || null,
          interests: formData.interests,
          goals: formData.goals,
          allergies: formData.allergies,
          health_goals: formData.health_goals,
          dietary_preferences: formData.dietary_preferences,
          skin_concerns: formData.skin_concerns,
          beauty_goals: formData.beauty_goals
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profilo</TabsTrigger>
            <TabsTrigger value="physical">Fisico</TabsTrigger>
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
                  <Label htmlFor="birth_date">Data di nascita</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                  />
                </div>
                <Button onClick={handleUpdateProfile} disabled={loading} className="w-full">
                  Salva Modifiche
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="physical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="w-4 h-4 mr-2" />
                  Informazioni Fisiche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight_kg}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                      placeholder="65"
                      min="30"
                      max="300"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Altezza (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height_cm}
                      onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                      placeholder="165"
                      min="100"
                      max="250"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hair_color">Colore capelli</Label>
                    <Select value={formData.hair_color} onValueChange={(value) => setFormData(prev => ({ ...prev, hair_color: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona colore" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nero">Nero</SelectItem>
                        <SelectItem value="castano_scuro">Castano scuro</SelectItem>
                        <SelectItem value="castano">Castano</SelectItem>
                        <SelectItem value="castano_chiaro">Castano chiaro</SelectItem>
                        <SelectItem value="biondo_scuro">Biondo scuro</SelectItem>
                        <SelectItem value="biondo">Biondo</SelectItem>
                        <SelectItem value="biondo_platino">Biondo platino</SelectItem>
                        <SelectItem value="rosso">Rosso</SelectItem>
                        <SelectItem value="grigio">Grigio</SelectItem>
                        <SelectItem value="bianco">Bianco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hair_type">Tipo di capelli</Label>
                    <Select value={formData.hair_type} onValueChange={(value) => setFormData(prev => ({ ...prev, hair_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lisci">Lisci</SelectItem>
                        <SelectItem value="mossi">Mossi</SelectItem>
                        <SelectItem value="ricci">Ricci</SelectItem>
                        <SelectItem value="crespi">Crespi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="skin_type">Tipo di pelle</Label>
                    <Select value={formData.skin_type} onValueChange={(value) => setFormData(prev => ({ ...prev, skin_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normale">Normale</SelectItem>
                        <SelectItem value="secca">Secca</SelectItem>
                        <SelectItem value="grassa">Grassa</SelectItem>
                        <SelectItem value="mista">Mista</SelectItem>
                        <SelectItem value="sensibile">Sensibile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="eye_color">Colore occhi</Label>
                    <Select value={formData.eye_color} onValueChange={(value) => setFormData(prev => ({ ...prev, eye_color: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona colore" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marroni">Marroni</SelectItem>
                        <SelectItem value="verdi">Verdi</SelectItem>
                        <SelectItem value="azzurri">Azzurri</SelectItem>
                        <SelectItem value="grigi">Grigi</SelectItem>
                        <SelectItem value="nocciola">Nocciola</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                <div className="grid grid-cols-2 gap-3 mb-6">
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

                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center mb-3">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lifestyle">Stile di vita</Label>
                      <Select value={formData.lifestyle} onValueChange={(value) => setFormData(prev => ({ ...prev, lifestyle: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="molto_attivo">Molto attivo</SelectItem>
                          <SelectItem value="attivo">Attivo</SelectItem>
                          <SelectItem value="moderatamente_attivo">Moderatamente attivo</SelectItem>
                          <SelectItem value="sedentario">Sedentario</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fitness_level">Livello fitness</Label>
                      <Select value={formData.fitness_level} onValueChange={(value) => setFormData(prev => ({ ...prev, fitness_level: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="principiante">Principiante</SelectItem>
                          <SelectItem value="intermedio">Intermedio</SelectItem>
                          <SelectItem value="avanzato">Avanzato</SelectItem>
                          <SelectItem value="esperto">Esperto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="workout_time">Orario preferito per attività fisica</Label>
                    <Select value={formData.preferred_workout_time} onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_workout_time: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona orario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mattina_presto">Mattina presto (6-8)</SelectItem>
                        <SelectItem value="mattina">Mattina (8-12)</SelectItem>
                        <SelectItem value="pomeriggio">Pomeriggio (12-18)</SelectItem>
                        <SelectItem value="sera">Sera (18-22)</SelectItem>
                        <SelectItem value="flessibile">Flessibile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div>
                      <Label>Allergie/Intolleranze</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['Glutine', 'Lattosio', 'Noci', 'Uova', 'Pesce', 'Soia', 'Nichel', 'Pollini'].map((allergy) => (
                          <button
                            key={allergy}
                            type="button"
                            onClick={() => handleArrayToggle('allergies', allergy)}
                            className={`p-2 text-xs rounded-lg border transition-all ${
                              formData.allergies.includes(allergy)
                                ? 'bg-vital-red/10 border-vital-red text-vital-red'
                                : 'bg-muted/30 border-border hover:bg-muted/50'
                            }`}
                          >
                            {allergy}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Preferenze Alimentari</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['Vegetariana', 'Vegana', 'Biologico', 'Senza zucchero', 'Low carb', 'Mediterranea', 'Proteica', 'Raw food'].map((pref) => (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => handleArrayToggle('dietary_preferences', pref)}
                            className={`p-2 text-xs rounded-lg border transition-all ${
                              formData.dietary_preferences.includes(pref)
                                ? 'bg-bloom-lilac/10 border-bloom-lilac text-bloom-lilac'
                                : 'bg-muted/30 border-border hover:bg-muted/50'
                            }`}
                          >
                            {pref}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Problematiche della Pelle</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['Acne', 'Secchezza', 'Sensibilità', 'Macchie', 'Rughe', 'Pori dilatati', 'Rossori', 'Imperfezioni'].map((concern) => (
                          <button
                            key={concern}
                            type="button"
                            onClick={() => handleArrayToggle('skin_concerns', concern)}
                            className={`p-2 text-xs rounded-lg border transition-all ${
                              formData.skin_concerns.includes(concern)
                                ? 'bg-soft-rose/20 border-soft-rose text-soft-rose'
                                : 'bg-muted/30 border-border hover:bg-muted/50'
                            }`}
                          >
                            {concern}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Obiettivi di Bellezza</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['Anti-aging', 'Idratazione', 'Luminosità', 'Purificazione', 'Tonificazione', 'Protezione', 'Uniformità', 'Nutrimento'].map((goal) => (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => handleArrayToggle('beauty_goals', goal)}
                            className={`p-2 text-xs rounded-lg border transition-all ${
                              formData.beauty_goals.includes(goal)
                                ? 'bg-bloom-lilac/10 border-bloom-lilac text-bloom-lilac'
                                : 'bg-muted/30 border-border hover:bg-muted/50'
                            }`}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleUpdateProfile} disabled={loading} className="w-full mt-4">
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