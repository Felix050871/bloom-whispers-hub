import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MessageCircle, Share } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // Mock data - in produzione verrebbe da Supabase
  const post = {
    id: Number(id),
    author: 'Sofia',
    authorType: 'community',
    category: 'Relazioni & Emozioni',
    content: 'Oggi ho iniziato la mia routine di gratitudine mattutina. Tre cose per cui sono grata ogni giorno. Che pace! 🌸',
    reactions: { inspire: 12, help: 8, smile: 15 },
    comments: 5,
    time: '2h fa',
    isExpert: false
  };

  const comments = [
    { id: 1, author: 'Emma', content: 'Bellissima idea! Anche io vorrei iniziare', time: '1h fa' },
    { id: 2, author: 'Giulia', content: 'La gratitudine cambia tutto! 💕', time: '1h fa' },
    { id: 3, author: 'Laura', content: 'Che consiglio meraviglioso, grazie per la condivisione', time: '30min fa' }
  ];

  const reactions = [
    { id: 'inspire', emoji: '✨', label: 'Mi ispira' },
    { id: 'help', emoji: '🤝', label: 'Mi aiuta' },
    { id: 'smile', emoji: '😊', label: 'Sorriso' }
  ];

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In produzione, salvare su Supabase
      console.log('Nuovo commento:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna al feed
          </Button>
        </div>

        {/* Post Card */}
        <Card className="card-bloom p-6 mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-bloom-lilac to-bloom-lilac/60 rounded-full flex items-center justify-center text-white font-medium text-lg">
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

          <p className="text-foreground mb-6 leading-relaxed text-lg">{post.content}</p>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              {reactions.map((reaction) => (
                <button
                  key={reaction.id}
                  onClick={() => setSelectedReaction(reaction.id)}
                  className={`flex items-center space-x-1 text-sm transition-colors ${
                    selectedReaction === reaction.id 
                      ? 'text-bloom-lilac font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-base">{reaction.emoji}</span>
                  <span>{post.reactions[reaction.id as keyof typeof post.reactions]}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <button className="flex items-center space-x-1 hover:text-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-foreground">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">
            Commenti ({comments.length})
          </h2>

          {/* Add Comment */}
          <Card className="card-bloom p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-bloom-lilac to-bloom-lilac/60 rounded-full flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Scrivi un commento..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <div className="flex justify-end">
                  <Button 
                    variant="bloom" 
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Commenta
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Comments List */}
          {comments.map((comment) => (
            <Card key={comment.id} className="card-bloom p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-bloom-lilac to-bloom-lilac/60 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {comment.author[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
