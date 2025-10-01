import React, { useState } from 'react';
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
import { Shield, Phone, MessageSquare, ExternalLink, X, AlertTriangle } from 'lucide-react';

interface AlbaSOSProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlbaSOS: React.FC<AlbaSOSProps> = ({ isOpen, onClose }) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
