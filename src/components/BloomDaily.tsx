import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, BookOpen, Play, Save, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-bloom.jpg';

interface BloomDailyProps {
  userName: string;
}

export const BloomDaily: React.FC<BloomDailyProps> = ({ userName }) => {
  const { user } = useAuth();
  const [mood, setMood] = useState<number>(3);
  const [journalEntry, setJournalEntry] = useState('');
  const [moodNote, setMoodNote] = useState('');
  const [moodSaved, setMoodSaved] = useState(false);

  const moodEmojis = ['😔', '😐', '🙂', '😊', '😄'];
  const moodLabels = ['Giù', 'Così così', 'Bene', 'Molto bene', 'Fantastica'];

  const handleSaveMood = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('moods')
        .insert({
          user_id: user.id,
          mood_level: mood,
          note: moodNote || null
        });

      if (error) throw error;

      toast({
        title: "Mood salvato",
        description: "Il tuo mood è stato registrato con successo!"
      });

      setMoodSaved(true);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Non è stato possibile salvare il mood",
        variant: "destructive"
      });
    }
  };

  const handleSaveJournal = async () => {
    if (!user || !journalEntry.trim()) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: journalEntry,
          type: 'text'
        });

      if (error) throw error;

      toast({
        title: "Diario salvato",
        description: "La tua voce del diario è stata salvata!"
      });

      setJournalEntry('');
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Non è stato possibile salvare la voce del diario",
        variant: "destructive"
      });
    }
  };

  const todayContent = [
    {
      id: 1,
      type: 'video',
      title: 'Respirazione del mattino',
      category: 'Relazioni & Emozioni',
      duration: '3 min',
      thumbnail: heroImage,
      description: 'Inizia la giornata con serenità'
    },
    {
      id: 2,
      type: 'audio',
      title: 'Nutrizione intuitiva',
      category: 'Sport & Nutrimento',
      duration: '5 min',
      description: 'Ascolta il tuo corpo'
    },
    {
      id: 3,
      type: 'tip',
      title: 'Skincare routine serale',
      category: 'Beauty & Make up',
      duration: '2 min',
      description: 'Coccole per la tua pelle'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Contenuti di oggi */}
      <div>
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <span className="text-bloom-lilac mr-2">✨</span>
          Oggi per te
        </h2>
        
        <div className="space-y-4">
          {todayContent.map((content) => (
            <Card key={content.id} className="card-bloom overflow-hidden">
              <div className="flex">
                {content.thumbnail && (
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover rounded-l-2xl"
                    />
                  </div>
                )}
                
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-foreground">{content.title}</h3>
                      <p className="text-xs text-bloom-lilac font-medium">{content.category}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{content.duration}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{content.description}</p>
                  
                  <div className="flex space-x-2">
                    <Button variant="bloom" size="sm" className="flex-1">
                      <Play className="w-4 h-4 mr-1" />
                      {content.type === 'video' ? 'Guarda' : content.type === 'audio' ? 'Ascolta' : 'Leggi'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Diario */}
      <Card className="card-bloom p-bloom">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-bloom-lilac" />
          Il tuo Diario
        </h2>
        
        <Textarea
          placeholder="Scrivi un pensiero o racconta della tua giornata..."
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="min-h-[100px] mb-4"
        />
        
        <div className="flex space-x-2">
          <Button variant="bloom" className="flex-1" onClick={handleSaveJournal} disabled={!journalEntry.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi voce
          </Button>
          <Button variant="outline">
            Audio
          </Button>
        </div>
      </Card>
    </div>
  );
};