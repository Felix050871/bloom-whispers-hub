import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User, MapPin, Phone, Video } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isSameDay, startOfToday, addDays } from "date-fns";
import { it } from "date-fns/locale";

interface Booking {
  id: string;
  mentor_id: string;
  booking_date: string;
  booking_time: string;
  service_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Mentor {
  id: string;
  name: string;
  specialty: string;
  avatar_emoji: string;
}

export function AppointmentsCalendar() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchMentors();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('id, name, specialty, avatar_emoji');

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMentors([]);
    }
  };

  const getMentorInfo = (mentorId: string) => {
    return mentors.find(mentor => mentor.id === mentorId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confermato';
      case 'pending':
        return 'In Attesa';
      case 'cancelled':
        return 'Annullato';
      default:
        return status;
    }
  };

  const today = startOfToday();
  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = parseISO(booking.booking_date);
    return bookingDate >= today;
  });

  const todayBookings = upcomingBookings.filter(booking => 
    isSameDay(parseISO(booking.booking_date), today)
  );

  const futureBookings = upcomingBookings.filter(booking => 
    !isSameDay(parseISO(booking.booking_date), today)
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (upcomingBookings.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nessun appuntamento programmato
        </h3>
        <p className="text-muted-foreground mb-6">
          Non hai ancora prenotato nessuna sessione. Inizia il tuo percorso di benessere!
        </p>
        <Button variant="default">
          Prenota una sessione
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Appuntamenti di oggi */}
      {todayBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-primary" />
            Oggi
          </h2>
          <div className="space-y-3">
            {todayBookings.map((booking) => {
              const mentor = getMentorInfo(booking.mentor_id);
              return (
                <Card key={booking.id} className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {mentor?.avatar_emoji || '👩‍⚕️'}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {booking.service_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            con {mentor?.name || 'Mentore'}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.booking_time.slice(0, 5)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          Online
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Dettagli
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Prossimi appuntamenti */}
      {futureBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-primary" />
            Prossimi appuntamenti
          </h2>
          <div className="space-y-3">
            {futureBookings.slice(0, 10).map((booking) => {
              const mentor = getMentorInfo(booking.mentor_id);
              const bookingDate = parseISO(booking.booking_date);
              
              return (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {mentor?.avatar_emoji || '👩‍⚕️'}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {booking.service_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            con {mentor?.name || 'Mentore'}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {format(bookingDate, 'dd MMM yyyy', { locale: it })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.booking_time.slice(0, 5)}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Dettagli
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}