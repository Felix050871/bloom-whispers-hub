import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, X, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  needsExpert?: boolean;
}

interface AlbaChatProps {
  category?: string;
  onClose: () => void;
  onBookExpert?: () => void;
}

export const AlbaChat: React.FC<AlbaChatProps> = ({ 
  category = 'default', 
  onClose,
  onBookExpert 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Ciao! Sono ALBA, la tua assistente AI di SheBloom. Come posso aiutarti oggi? 🌸' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(({ role, content }) => ({ role, content }));

      const { data, error } = await supabase.functions.invoke('alba-chat', {
        body: { 
          message: userMessage,
          category,
          conversationHistory
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Errore",
          description: data.error,
          variant: "destructive",
        });
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response || "Mi dispiace, c'è stato un errore. Riprova." 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          needsExpert: data.needsExpert
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Errore di connessione",
        description: "Impossibile inviare il messaggio. Riprova.",
        variant: "destructive",
      });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Mi dispiace, c'è stato un problema di connessione. Riprova tra poco." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="fixed bottom-24 right-4 w-96 h-[500px] shadow-xl border-bloom-lilac/30 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-bloom-lilac/10 to-bloom-lilac/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-bloom-lilac to-bloom-lilac/60 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">ALBA</h3>
            <p className="text-xs text-muted-foreground">Il tuo AI Concierge</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] space-y-2`}>
                <div className={`rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-bloom-lilac text-white ml-auto' 
                    : 'bg-muted text-foreground'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                
                {msg.needsExpert && msg.role === 'assistant' && onBookExpert && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onBookExpert}
                    className="w-full"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Prenota consulto con esperta (30€)
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-bloom-lilac rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-bloom-lilac rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-bloom-lilac rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Scrivi la tua domanda..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            variant="bloom"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          ALBA non sostituisce professionisti. Per emergenze: 112
        </p>
      </div>
    </Card>
  );
};
