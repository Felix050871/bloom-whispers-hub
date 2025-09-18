import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Star, Heart, Brain, Dumbbell, Sparkles, Zap, Clock, Euro, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Mentor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviews_count: number;
  price_per_session: number;
  avatar_emoji: string;
  category: string;
  verified: boolean;
}

const categories = [
  {
    id: 'relazioni',
    name: 'Relazioni & Emozioni',
    emoji: '💖',
    icon: Heart,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'salute',
    name: 'Salute femminile',
    emoji: '🌸',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'fitness',
    name: 'Sport & Nutrimento',
    emoji: '💪',
    icon: Dumbbell,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'beauty',
    name: 'Beauty & Make up',
    emoji: '✨',
    icon: Sparkles,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness & Crescita',
    emoji: '🧘‍♀️',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'astrologia',
    name: 'Cartomanzia & Astrologia',
    emoji: '🔮',
    icon: Zap,
    color: 'from-indigo-500 to-purple-500'
  }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

export function BookingInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { balance, hasEnoughBalance, payFromWallet } = useWallet();
  const [step, setStep] = useState<'category' | 'mentor' | 'datetime' | 'confirm'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      fetchMentorsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchMentorsByCategory = async (category: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('category', category)
        .order('rating', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i mentori",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user || !selectedMentor || !selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const sessionPrice = selectedMentor.price_per_session * 100; // Convert to cents

      // Check if user has enough balance
      if (!hasEnoughBalance(sessionPrice)) {
        toast({
          title: "Saldo insufficiente",
          description: `Hai bisogno di €${selectedMentor.price_per_session.toFixed(2)} per prenotare questa sessione.`,
          variant: "destructive"
        });
        return;
      }

      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          mentor_id: selectedMentor.id,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          booking_time: selectedTime,
          service_name: `Sessione ${selectedMentor.specialty}`,
          status: 'confirmed'
        });

      if (bookingError) throw bookingError;

      // Process payment
      const paymentSuccess = await payFromWallet(
        sessionPrice,
        `Sessione con ${selectedMentor.name}`,
        'session_payment'
      );

      if (paymentSuccess) {
        toast({
          title: "Prenotazione confermata!",
          description: `La tua sessione con ${selectedMentor.name} è stata prenotata per il ${format(selectedDate, 'dd MMMM yyyy', { locale: it })} alle ${selectedTime}.`
        });
        
        // Reset form
        setStep('category');
        setSelectedCategory('');
        setSelectedMentor(null);
        setSelectedDate(undefined);
        setSelectedTime('');
        setNote('');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Errore prenotazione",
        description: "Si è verificato un errore durante la prenotazione",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Scegli una categoria</h2>
        <p className="text-muted-foreground">
          Seleziona l'area in cui vorresti ricevere supporto
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedCategory(category.id);
                setStep('mentor');
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Mentori specializzati disponibili
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderMentorSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setStep('category')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Scegli il tuo mentore</h2>
          <p className="text-muted-foreground">
            {categories.find(c => c.id === selectedCategory)?.name}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <Card 
              key={mentor.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedMentor?.id === mentor.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedMentor(mentor);
                setStep('datetime');
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{mentor.avatar_emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{mentor.name}</h3>
                      {mentor.verified && (
                        <Badge variant="secondary" className="text-xs">Verificato</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {mentor.specialty}
                    </p>
                    <p className="text-sm mb-3">{mentor.bio}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({mentor.reviews_count} recensioni)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <Euro className="w-4 h-4" />
                        {mentor.price_per_session}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setStep('mentor')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Scegli data e ora</h2>
          <p className="text-muted-foreground">
            Sessione con {selectedMentor?.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seleziona una data</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < startOfToday()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Orari disponibili</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="text-sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Seleziona prima una data
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedDate && selectedTime && (
        <div className="flex justify-center">
          <Button onClick={() => setStep('confirm')} size="lg">
            Continua
          </Button>
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setStep('datetime')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Conferma prenotazione</h2>
          <p className="text-muted-foreground">
            Verifica i dettagli prima di confermare
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{selectedMentor?.avatar_emoji}</div>
            <div>
              <h3 className="font-semibold">{selectedMentor?.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedMentor?.specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">
                {selectedDate && format(selectedDate, 'dd MMMM yyyy', { locale: it })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ora</p>
              <p className="font-medium">{selectedTime}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Prezzo sessione</span>
            <span className="font-semibold text-lg">€{selectedMentor?.price_per_session}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Saldo disponibile</span>
            <span>€{balance.toFixed(2)}</span>
          </div>

          <Textarea
            placeholder="Note aggiuntive (opzionale)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-4"
          />

          <Button 
            onClick={handleBooking} 
            disabled={loading || !hasEnoughBalance((selectedMentor?.price_per_session || 0) * 100)}
            className="w-full"
            size="lg"
          >
            {loading ? "Prenotazione in corso..." : "Conferma e Paga"}
          </Button>

          {!hasEnoughBalance((selectedMentor?.price_per_session || 0) * 100) && (
            <p className="text-sm text-red-600 text-center">
              Saldo insufficiente. Ricarica il tuo wallet per procedere.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {step === 'category' && renderCategorySelection()}
      {step === 'mentor' && renderMentorSelection()}
      {step === 'datetime' && renderDateTimeSelection()}
      {step === 'confirm' && renderConfirmation()}
    </div>
  );
}