import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share, Plus, HelpCircle, CheckCircle } from 'lucide-react';

export const SocialBloom: React.FC = () => {
  const navigate = useNavigate();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const posts = [
    {
      id: 1,
      author: 'Sofia',
      authorType: 'community',
      category: 'Relazioni & Emozioni',
      content: 'Oggi ho iniziato la mia routine di gratitudine mattutina. Tre cose per cui sono grata ogni giorno. Che pace! 🌸',
      reactions: { inspire: 12, help: 8, smile: 15 },
      comments: 5,
      time: '2h fa'
    },
    {
      id: 2,
      author: 'Dr.ssa Maria Rossi',
      authorType: 'mentor',
      category: 'Sport & Nutrimento',
      content: 'Ricordate: non esistono cibi "cattivi". Ascoltate il vostro corpo e nutritelo con amore.',
      reactions: { inspire: 23, help: 18, smile: 9 },
      comments: 12,
      time: '4h fa',
      isExpert: true
    }
  ];

  const questions = [
    {
      id: 1,
      question: 'Come gestire l\'ansia pre-mestruale?',
      category: 'PinkCare - Salute femminile',
      answers: 3,
      hasExpertAnswer: true,
      time: '1h fa'
    },
    {
      id: 2,
      question: 'Consigli per una skincare routine semplice?',
      category: 'Beauty & Make up',
      answers: 7,
      hasExpertAnswer: false,
      time: '3h fa'
    }
  ];

  const reactions = [
    { id: 'inspire', emoji: '✨', label: 'Mi ispira' },
    { id: 'help', emoji: '🤝', label: 'Mi aiuta' },
    { id: 'smile', emoji: '😊', label: 'Sorriso' }
  ];

  const BloomReaction = ({ post }: { post: any }) => (
    <div className="flex items-center space-x-4">
      {reactions.map((reaction) => (
        <button
          key={reaction.id}
          onClick={() => setSelectedReaction(reaction.id)}
          className={`bloom-reaction flex items-center space-x-1 text-sm ${
            selectedReaction === reaction.id ? 'active' : 'text-muted-foreground'
          }`}
        >
          <span>{reaction.emoji}</span>
          <span>{post.reactions[reaction.id as keyof typeof post.reactions]}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="pb-20">
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="qa">Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-medium text-gradient-bloom mb-2">
              Social Bloom
            </h1>
            <p className="text-muted-foreground">
              Una community gentile dove crescere insieme
            </p>
          </div>

          {/* Filtri */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Badge variant="secondary" className="bg-bloom-lilac/20 text-bloom-lilac whitespace-nowrap">
              In evidenza
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap">Community</Badge>
            <Badge variant="outline" className="whitespace-nowrap">Mentor</Badge>
          </div>

          {/* Compositore post */}
          <Card className="card-bloom p-4">
            <Input
              placeholder="Condividi un pensiero positivo..."
              className="mb-3"
            />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  📸 Foto
                </Button>
                <Button variant="outline" size="sm">
                  🎵 Audio
                </Button>
              </div>
              <Button variant="bloom" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Condividi
              </Button>
            </div>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="card-bloom p-6 cursor-pointer transition-all hover:shadow-md"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-bloom-lilac to-bloom-lilac/60 rounded-full flex items-center justify-center text-white font-medium">
                    {post.author[0]}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-foreground">{post.author}</h3>
                      {post.isExpert && (
                        <Badge variant="secondary" className="bg-vital-red/20 text-vital-red text-xs">
                          Esperta
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                    <p className="text-xs text-bloom-lilac">{post.category}</p>
                  </div>
                </div>

                <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <BloomReaction post={post} />
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <button className="flex items-center space-x-1 hover:text-foreground">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-foreground">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qa" className="space-y-6">
          {/* Header Q&A */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium text-foreground mb-2">
              Domande & Risposte
            </h2>
            <p className="text-muted-foreground">
              Chiedi e rispondi nella community
            </p>
          </div>

          {/* Nuova domanda */}
          <Card className="card-bloom p-4">
            <Input
              placeholder="Fai una domanda alla community..."
              className="mb-3"
            />
            <div className="flex justify-between items-center">
              <select className="text-sm text-muted-foreground border-none bg-transparent">
                <option>Categoria</option>
                <option>Relazioni & Emozioni</option>
                <option>PinkCare - Salute femminile</option>
                <option>Sport & Nutrimento</option>
              </select>
              <Button variant="bloom" size="sm">
                <HelpCircle className="w-4 h-4 mr-1" />
                Chiedi
              </Button>
            </div>
          </Card>

          {/* Premium Q&A */}
          <Card className="card-petal p-4 border border-bloom-lilac/30">
            <div className="text-center">
              <h3 className="font-medium mb-2">Q&A Privato Premium</h3>
              <p className="text-sm text-muted-foreground mb-3">
                La tua domanda resta tra te e la tua Mentor
              </p>
              <Button variant="bloom" size="sm">
                Chiedi in privato
              </Button>
            </div>
          </Card>

          {/* Lista domande */}
          <div className="space-y-4">
            {questions.map((q) => (
              <Card 
                key={q.id} 
                className="card-bloom p-4 cursor-pointer transition-all hover:shadow-md"
                onClick={() => navigate(`/question/${q.id}`)}
              >
                <div className="mb-3">
                  <h3 className="font-medium text-foreground mb-1">{q.question}</h3>
                  <p className="text-xs text-bloom-lilac">{q.category}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <span>{q.answers} risposte</span>
                    <span>{q.time}</span>
                    {q.hasExpertAnswer && (
                      <Badge variant="secondary" className="bg-vital-red/20 text-vital-red text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Risposta esperta
                      </Badge>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Rispondi
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};