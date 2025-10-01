import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, startOfDay, subDays } from 'date-fns';
import { it } from 'date-fns/locale';

interface MoodEntry {
  id: string;
  mood_level: number;
  note: string | null;
  created_at: string;
}

export const MoodTracker: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const moods = [
    { level: 1, emoji: '😔', label: 'Giù', color: 'text-blue-500', bg: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20' },
    { level: 2, emoji: '😐', label: 'Così così', color: 'text-gray-500', bg: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/20' },
    { level: 3, emoji: '🙂', label: 'Bene', color: 'text-green-500', bg: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20' },
    { level: 4, emoji: '😊', label: 'Molto bene', color: 'text-bloom-lilac', bg: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20' },
    { level: 5, emoji: '😄', label: 'Fantastica!', color: 'text-vital-red', bg: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20' }
  ];

  useEffect(() => {
    if (user) {
      fetchTodayMood();
      fetchRecentMoods();
    }
  }, [user]);

  const fetchTodayMood = async () => {
    if (!user) return;

    try {
      const today = startOfDay(new Date()).toISOString();
      
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setTodayMood(data);
        setSelectedMood(data.mood_level);
        setMoodNote(data.note || '');
      }
    } catch (error) {
      console.error('Error fetching today mood:', error);
    }
  };

  const fetchRecentMoods = async () => {
    if (!user) return;

    try {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo)
        .order('created_at', { ascending: false })
        .limit(7);

      if (error) throw error;

      setRecentMoods(data || []);
    } catch (error) {
      console.error('Error fetching recent moods:', error);
    }
  };

  const saveMood = async () => {
    if (!user || selectedMood === null) return;

    setIsLoading(true);

    try {
      if (todayMood) {
        // Update existing mood
        const { error } = await supabase
          .from('moods')
          .update({
            mood_level: selectedMood,
            note: moodNote || null
          })
          .eq('id', todayMood.id);

        if (error) throw error;

        toast({
          title: "Mood aggiornato! ✨",
          description: "Il tuo stato d'animo è stato aggiornato.",
        });
      } else {
        // Create new mood
        const { error } = await supabase
          .from('moods')
          .insert({
            user_id: user.id,
            mood_level: selectedMood,
            note: moodNote || null
          });

        if (error) throw error;

        toast({
          title: "Mood salvato! 🌸",
          description: "Grazie per aver condiviso come ti senti oggi.",
        });
      }

      fetchTodayMood();
      fetchRecentMoods();
    } catch (error: any) {
      console.error('Error saving mood:', error);
      toast({
        title: "Errore",
        description: "Non è stato possibile salvare il mood. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodByLevel = (level: number) => moods.find(m => m.level === level) || moods[2];

  const averageMood = recentMoods.length > 0
    ? (recentMoods.reduce((sum, m) => sum + m.mood_level, 0) / recentMoods.length).toFixed(1)
    : '0';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Mood Card */}
      <Card className="card-bloom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-vital-red" />
            Come ti senti oggi?
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Traccia il tuo stato d'animo per capire meglio come stai
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div className="grid grid-cols-5 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.level}
                onClick={() => setSelectedMood(mood.level)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${selectedMood === mood.level 
                    ? 'border-bloom-lilac shadow-lg scale-105' 
                    : 'border-border hover:border-bloom-lilac/50'
                  }
                  ${mood.bg}
                `}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className={`text-xs font-medium ${selectedMood === mood.level ? mood.color : 'text-muted-foreground'}`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>

          {/* Note */}
          {selectedMood !== null && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Vuoi aggiungere una nota? (facoltativo)
              </label>
              <Textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="Scrivi cosa ti ha fatto sentire così oggi..."
                className="min-h-[80px]"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {moodNote.length}/200
              </p>
            </div>
          )}

          {/* Save Button */}
          <Button
            onClick={saveMood}
            disabled={selectedMood === null || isLoading}
            variant="bloom"
            size="lg"
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {todayMood ? 'Aggiorna Mood' : 'Salva Mood'}
          </Button>
        </CardContent>
      </Card>

      {/* Stats & Recent Moods */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Stats */}
        <Card className="card-bloom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-bloom-lilac" />
              Le tue statistiche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Media ultimi 7 giorni</span>
              <Badge variant="secondary" className="text-lg">
                {getMoodByLevel(Math.round(parseFloat(averageMood))).emoji} {averageMood}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Mood tracciati</span>
              <Badge variant="secondary">
                {recentMoods.length} ultimi 7gg
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Moods */}
        <Card className="card-bloom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-bloom-lilac" />
              Ultimi mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[180px]">
              <div className="space-y-3">
                {recentMoods.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nessun mood salvato di recente
                  </p>
                ) : (
                  recentMoods.map((mood) => {
                    const moodData = getMoodByLevel(mood.mood_level);
                    return (
                      <div
                        key={mood.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <span className="text-2xl">{moodData.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {moodData.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(mood.created_at), 'dd MMM', { locale: it })}
                            </span>
                          </div>
                          {mood.note && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {mood.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
