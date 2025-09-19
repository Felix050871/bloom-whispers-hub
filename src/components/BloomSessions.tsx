import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Clock, CheckCircle } from 'lucide-react';

export const BloomSessions: React.FC = () => {
  const mentors = [
    {
      id: 1,
      name: 'Dr.ssa Maria Rossi',
      specialty: 'Psicologa e Coach',
      category: 'Relazioni & Emozioni',
      rating: 4.9,
      reviews: 127,
      price: 30,
      bio: 'Specialista in benessere emotivo e relazioni interpersonali',
      verified: true,
      avatar: '👩‍⚕️'
    },
    {
      id: 2,
      name: 'Giulia Bianchi',
      specialty: 'Nutrizionista',
      category: 'Sport & Nutrimento',
      rating: 4.8,
      reviews: 89,
      price: 30,
      bio: 'Nutrizione intuitiva e stile di vita sano',
      verified: true,
      avatar: '🥗'
    },
    {
      id: 3,
      name: 'Sofia Verde',
      specialty: 'Beauty Expert',
      category: 'Beauty & Make up',
      rating: 4.7,
      reviews: 156,
      price: 30,
      bio: 'Consulente per skincare e makeup personalizzato',
      verified: true,
      avatar: '✨'
    }
  ];

  const myBookings = [
    {
      id: 1,
      mentor: 'Dr.ssa Maria Rossi',
      date: '2024-01-20',
      time: '14:30',
      status: 'confermato',
      service: 'Sessione di Coaching'
    }
  ];

  const FlowerRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-bloom-lilac' : 'text-muted'}>
          🌸
        </span>
      ))}
      <span className="text-sm text-muted-foreground ml-1">({rating})</span>
    </div>
  );

  return (
    <div className="pb-20 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-medium text-gradient-primary mb-2">
          Bloom Sessions
        </h1>
        <p className="text-muted-foreground">
          Trova la tua guida per un percorso personalizzato
        </p>
      </div>

      {/* I miei incontri */}
      {myBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-bloom-lilac" />
            I miei incontri
          </h2>
          
          <Card className="card-bloom p-4 mb-6">
            {myBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{booking.service}</h3>
                  <p className="text-sm text-muted-foreground">con {booking.mentor}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{booking.date}</span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{booking.time}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-bloom-lilac/20 text-bloom-lilac">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Confermato
                </Badge>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Lista professioniste */}
      <div>
        <h2 className="text-lg font-medium mb-4">
          Professioniste verificate
        </h2>
        
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="card-bloom overflow-hidden">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{mentor.avatar}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-foreground">{mentor.name}</h3>
                      {mentor.verified && (
                        <Badge variant="secondary" className="bg-vital-red/20 text-vital-red text-xs">
                          SheBloom Verified
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-bloom-lilac font-medium mb-1">{mentor.specialty}</p>
                    <p className="text-xs text-muted-foreground mb-2">{mentor.category}</p>
                    <p className="text-sm text-foreground mb-3">{mentor.bio}</p>
                    
                    <div className="flex items-center justify-between">
                      <FlowerRating rating={mentor.rating} />
                      <span className="text-sm text-muted-foreground">
                        {mentor.reviews} recensioni
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="text-lg font-semibold text-foreground">
                    €{mentor.price}
                    <span className="text-sm text-muted-foreground ml-1">/sessione</span>
                  </div>
                  
                  <Button variant="bloom" size="sm">
                    Prenota
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Diventa mentor */}
      <Card className="card-petal p-6 text-center">
        <h3 className="font-medium mb-2">Sei una professionista?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Unisciti alla nostra community di mentor verificate
        </p>
        <Button variant="outline" size="sm">
          Candidati come Mentor
        </Button>
      </Card>
    </div>
  );
};