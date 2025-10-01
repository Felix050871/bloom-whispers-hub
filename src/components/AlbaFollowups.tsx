import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, X, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface Followup {
  id: string;
  topic: string;
  context: string;
  followup_date: string;
  status: string;
  response: string | null;
}

export const AlbaFollowups: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [userName, setUserName] = useState('');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (user) {
      fetchFollowups();
      fetchUserName();
    }
  }, [user]);

  const fetchUserName = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('name')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setUserName(data.name.split(' ')[0]); // First name only
    }
  };

  const fetchFollowups = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('alba_followups')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .lte('followup_date', today)
      .order('followup_date', { ascending: false });

    if (error) {
      console.error('Error fetching followups:', error);
    } else {
      setFollowups(data || []);
    }
  };

  const handleRespond = async (followupId: string) => {
    if (!response.trim()) return;

    const { error } = await supabase
      .from('alba_followups')
      .update({ 
        status: 'completed',
        response: response.trim(),
        completed_at: new Date().toISOString()
      })
      .eq('id', followupId);

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile salvare la risposta",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Grazie!",
        description: "La tua risposta è stata registrata 💚",
      });
      setResponse('');
      setRespondingTo(null);
      fetchFollowups();
    }
  };

  const handleDismiss = async (followupId: string) => {
    const { error } = await supabase
      .from('alba_followups')
      .update({ status: 'dismissed' })
      .eq('id', followupId);

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile chiudere il promemoria",
        variant: "destructive",
      });
    } else {
      fetchFollowups();
    }
  };

  if (!followups.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-bloom-lilac" />
        <h3 className="text-lg font-semibold">Messaggi da ALBA</h3>
        <Badge variant="secondary">{followups.length}</Badge>
      </div>

      {followups.map((followup) => (
        <Card key={followup.id} className="p-4 border-bloom-lilac/30 bg-gradient-to-br from-bloom-lilac/5 to-transparent">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(followup.followup_date), 'dd MMMM yyyy', { locale: it })}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  Ciao {userName}! Come è andato/a: {followup.topic}?
                </h4>
                <p className="text-sm text-muted-foreground">
                  {followup.context}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDismiss(followup.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {respondingTo === followup.id ? (
              <div className="space-y-2">
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Racconta come è andata..."
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleRespond(followup.id)}
                    disabled={!response.trim()}
                    variant="bloom"
                    size="sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Invia
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setRespondingTo(null);
                      setResponse('');
                    }}
                  >
                    Annulla
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setRespondingTo(followup.id)}
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Rispondi ad ALBA
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
