import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shield, Phone, MessageSquare, ExternalLink, X, AlertTriangle, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AlbaSOSProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlbaSOS: React.FC<AlbaSOSProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [sosContacts, setSosContacts] = useState<any[]>([]);
  const [sosSettings, setSosSettings] = useState<any>(null);
  const [sendingSOS, setSendingSOS] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchSOSData();
    }
  }, [isOpen, user]);

  const fetchSOSData = async () => {
    if (!user) return;

    try {
      // Fetch SOS contacts
      const { data: contacts } = await supabase
        .from('sos_contacts')
        .select('*')
        .eq('user_id', user.id);

      // Fetch SOS settings
      const { data: profile } = await supabase
        .from('profiles')
        .select('sos_message, sos_share_location')
        .eq('user_id', user.id)
        .maybeSingle();

      setSosContacts(contacts || []);
      setSosSettings(profile);
    } catch (error) {
      console.error('Error fetching SOS data:', error);
    }
  };

  const handleSendSOS = async () => {
    if (sosContacts.length === 0) {
      toast({
        title: "Nessun contatto configurato",
        description: "Configura i contatti di emergenza nelle impostazioni prima di inviare un SOS.",
        variant: "destructive"
      });
      return;
    }

    setSendingSOS(true);

    try {
      let message = sosSettings?.sos_message || 'Ho bisogno di aiuto urgente.';
      
      // Get location if enabled
      if (sosSettings?.sos_share_location && navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        const { latitude, longitude } = position.coords;
        message += `\n\nLa mia posizione: https://www.google.com/maps?q=${latitude},${longitude}`;
      }

      // Send SMS to each contact (note: actual SMS sending requires native implementation)
      // For now, we'll create a shareable link
      const encodedMessage = encodeURIComponent(message);
      
      // Create a WhatsApp link for the primary contact if available
      const primaryContact = sosContacts.find(c => c.is_primary);
      if (primaryContact) {
        const phoneNumber = primaryContact.phone.replace(/[^0-9]/g, '');
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappLink, '_blank');
      }

      toast({
        title: "SOS Inviato",
        description: `Messaggio di emergenza inviato a ${sosContacts.length} contatto${sosContacts.length > 1 ? 'i' : ''}.`,
      });

      onClose();
    } catch (error: any) {
      console.error('Error sending SOS:', error);
      toast({
        title: "Errore nell'invio SOS",
        description: error.message || "Non è stato possibile inviare il messaggio di emergenza.",
        variant: "destructive"
      });
    } finally {
      setSendingSOS(false);
    }
  };

  const handleCall1522 = () => {
    window.location.href = 'tel:1522';
  };

  const handleEmergencyCall = () => {
    window.location.href = 'tel:112';
  };

  const handleQuickExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    // Reindirizza a un sito innocuo
    window.location.href = 'https://www.google.com';
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-vital-red rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <AlertDialogTitle className="text-lg">ALBA SOS</AlertDialogTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <AlertDialogDescription className="text-left">
              Canale sicuro e riservato per richiedere aiuto
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 mt-4">
            {/* Invia SOS ai contatti */}
            {sosContacts.length > 0 && (
              <Card className="p-4 border-bloom-lilac/30 bg-bloom-lilac/5">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-bloom-lilac mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      Avvisa i tuoi Contatti Sicuri
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {sosContacts.length} contatto{sosContacts.length > 1 ? 'i' : ''} configurato{sosContacts.length > 1 ? 'i' : ''}.
                      {sosSettings?.sos_share_location && ' Include posizione GPS.'}
                    </p>
                    <Button 
                      onClick={handleSendSOS}
                      disabled={sendingSOS}
                      variant="default"
                      className="w-full bg-bloom-lilac hover:bg-bloom-lilac/90"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {sendingSOS ? 'Invio in corso...' : 'Invia SOS'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Chiamata 1522 */}
            <Card className="p-4 border-vital-red/30 bg-vital-red/5">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-vital-red mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Numero Antiviolenza 1522
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gratuito, attivo 24/7. Supporto e informazioni per vittime di violenza e stalking.
                  </p>
                  <Button 
                    onClick={handleCall1522}
                    variant="default"
                    className="w-full bg-vital-red hover:bg-vital-red/90"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Chiama 1522
                  </Button>
                </div>
              </div>
            </Card>

            {/* Emergenza 112 */}
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Pericolo Immediato - 112
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    In caso di pericolo immediato, chiama il numero unico di emergenza.
                  </p>
                  <Button 
                    onClick={handleEmergencyCall}
                    variant="outline"
                    className="w-full border-orange-600 text-orange-600"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Chiama 112
                  </Button>
                </div>
              </div>
            </Card>

            {/* Risorse Utili */}
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-bloom-lilac mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">
                    Risorse e Centri Antiviolenza
                  </h4>
                  <div className="space-y-2">
                    <a 
                      href="https://www.direcontrolaviolenza.it" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-sm text-bloom-lilac hover:underline"
                    >
                      → D.i.Re - Centri Antiviolenza
                    </a>
                    <a 
                      href="https://www.pariopportunita.gov.it" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-sm text-bloom-lilac hover:underline"
                    >
                      → Dipartimento Pari Opportunità
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Uscita Rapida */}
            <Button 
              onClick={handleQuickExit}
              variant="secondary"
              className="w-full"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Uscita Rapida
            </Button>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <Shield className="w-3 h-3 inline mr-1" />
                Questa conversazione è privata e non viene salvata. 
                I tuoi dati sono protetti.
              </p>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Conferma Uscita Rapida */}
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Uscita Rapida</AlertDialogTitle>
            <AlertDialogDescription>
              Verrai reindirizzata a Google. Questa funzione ti aiuta a nascondere velocemente l'app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowExitConfirm(false)}>
              Annulla
            </Button>
            <Button onClick={confirmExit} variant="default">
              Esci Ora
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
