import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle, ThumbsUp } from 'lucide-react';

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newAnswer, setNewAnswer] = useState('');
  const [answers, setAnswers] = useState([
    {
      id: 1,
      author: 'Dr.ssa Maria Rossi',
      isExpert: true,
      content: 'L\'ansia pre-mestruale è molto comune. Ti consiglio di provare tecniche di respirazione profonda e magnesio. Anche l\'esercizio fisico regolare può aiutare molto. Se i sintomi persistono, consulta il tuo ginecologo.',
      likes: 15,
      time: '45min fa',
      isAccepted: true
    },
    {
      id: 2,
      author: 'Chiara',
      isExpert: false,
      content: 'Io ho trovato molto utile lo yoga e la camomilla prima di dormire. Anche ridurre la caffeina mi ha aiutato tantissimo!',
      likes: 8,
      time: '30min fa',
      isAccepted: false
    },
    {
      id: 3,
      author: 'Elena',
      isExpert: false,
      content: 'Concordo con il magnesio! A me ha cambiato la vita. Anche tenere un diario del ciclo mi aiuta a prepararmi meglio.',
      likes: 5,
      time: '15min fa',
      isAccepted: false
    }
  ]);

  // Mock data - in produzione verrebbe da Supabase
  const question = {
    id: Number(id),
    question: 'Come gestire l\'ansia pre-mestruale?',
    category: 'PinkCare - Salute femminile',
    author: 'Anna',
    time: '1h fa',
    answers: 3
  };


  const handleAddAnswer = () => {
    if (newAnswer.trim()) {
      const newAnswerObj = {
        id: answers.length + 1,
        author: 'Tu',
        isExpert: false,
        content: newAnswer,
        likes: 0,
        time: 'Adesso',
        isAccepted: false
      };
      setAnswers([...answers, newAnswerObj]);
      setNewAnswer('');
      console.log('Risposta aggiunta:', newAnswerObj);
    }
  };

  const handleBackToQuestions = () => {
    navigate('/', { state: { activeSection: 'community', activeTab: 'qa' } });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToQuestions}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alle domande
          </Button>
        </div>

        {/* Question Card */}
        <Card className="card-bloom p-6 mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-bloom-lilac to-bloom-lilac/60 rounded-full flex items-center justify-center text-white font-medium text-lg">
              {question.author[0]}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-foreground">{question.author}</h3>
                <span className="text-xs text-muted-foreground">{question.time}</span>
              </div>
              <Badge variant="outline" className="text-xs border-bloom-lilac/30 text-bloom-lilac">
                {question.category}
              </Badge>
            </div>
          </div>

          <h1 className="text-xl font-medium text-foreground mb-2">
            {question.question}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-4 border-t border-border">
            <span>{answers.length} risposte</span>
            {answers.some(a => a.isExpert) && (
              <Badge variant="secondary" className="bg-vital-red/20 text-vital-red text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Risposta esperta
              </Badge>
            )}
          </div>
        </Card>

        {/* Answers Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">
            {answers.length} Risposte
          </h2>

          {/* Add Answer */}
          <Card className="card-bloom p-4">
            <h3 className="font-medium text-sm text-foreground mb-3">
              La tua risposta
            </h3>
            <Textarea
              placeholder="Condividi la tua esperienza o consiglio..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="mb-3 min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                variant="bloom" 
                size="sm"
                onClick={handleAddAnswer}
                disabled={!newAnswer.trim()}
              >
                Pubblica risposta
              </Button>
            </div>
          </Card>

          {/* Answers List */}
          {answers.map((answer) => (
            <Card 
              key={answer.id} 
              className={`p-4 ${
                answer.isAccepted 
                  ? 'border-2 border-vital-red/30 card-petal' 
                  : 'card-bloom'
              }`}
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-bloom-lilac to-bloom-lilac/60 rounded-full flex items-center justify-center text-white font-medium">
                  {answer.author[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-foreground">
                      {answer.author}
                    </span>
                    {answer.isExpert && (
                      <Badge variant="secondary" className="bg-vital-red/20 text-vital-red text-xs">
                        Esperta
                      </Badge>
                    )}
                    {answer.isAccepted && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-600 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Risposta migliore
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{answer.time}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-3">
                {answer.content}
              </p>

              <div className="flex items-center space-x-4 pt-3 border-t border-border">
                <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-bloom-lilac">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{answer.likes}</span>
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  Rispondi
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
