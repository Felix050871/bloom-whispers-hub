import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Plus, Trash2, Phone, Mail, MapPin, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SOSContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  is_primary: boolean;
}

export function SOSContactsSettings() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<SOSContact[]>([]);
  const [sosMessage, setSosMessage] = useState('Ho bisogno di aiuto. Questa è la mia posizione attuale.');
  const [shareLocation, setShareLocation] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    is_primary: false
  });

  useEffect(() => {
    if (user) {
      fetchContacts();
      fetchSOSSettings();
    }
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sos_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      console.error('Error fetching SOS contacts:', error);
    }
  };

  const fetchSOSSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('sos_message, sos_share_location')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSosMessage(data.sos_message || 'Ho bisogno di aiuto. Questa è la mia posizione attuale.');
        setShareLocation(data.sos_share_location ?? true);
      }
    } catch (error: any) {
      console.error('Error fetching SOS settings:', error);
    }
  };

  const handleAddContact = async () => {
    if (!user || !newContact.name || !newContact.phone) {
      toast({
        title: "Errore",
        description: "Nome e telefono sono obbligatori",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('sos_contacts')
        .insert({
          user_id: user.id,
          name: newContact.name,
          phone: newContact.phone,
          email: newContact.email || null,
          is_primary: newContact.is_primary
        });

      if (error) throw error;

      toast({
        title: "Contatto aggiunto",
        description: "Il contatto di emergenza è stato salvato con successo."
      });

      setDialogOpen(false);
      setNewContact({ name: '', phone: '', email: '', is_primary: false });
      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('sos_contacts')
        .delete()
        .eq('id', contactId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Contatto eliminato",
        description: "Il contatto di emergenza è stato rimosso."
      });

      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          sos_message: sosMessage,
          sos_share_location: shareLocation
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Impostazioni salvate",
        description: "Le tue impostazioni SOS sono state aggiornate."
      });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-500" />
            SOS ALBA
          </CardTitle>
          <CardDescription>
            Configura i contatti di emergenza e il messaggio automatico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alert Info */}
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800 dark:text-red-200">
              <p className="font-medium mb-1">Funzione di emergenza</p>
              <p className="text-xs">
                Quando attivi l'SOS, i tuoi contatti riceveranno immediatamente il messaggio configurato con la tua posizione.
              </p>
            </div>
          </div>

          {/* Contacts List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">Contatti di Emergenza</Label>
              <Button
                onClick={() => setDialogOpen(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Aggiungi Contatto
              </Button>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Nessun contatto di emergenza configurato</p>
                <p className="text-xs mt-1">Aggiungi almeno un contatto fidato</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{contact.name}</p>
                        {contact.is_primary && (
                          <span className="text-xs bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                            Primario
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{contact.phone}</span>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SOS Message */}
          <div className="space-y-2">
            <Label htmlFor="sos-message">Messaggio di Emergenza</Label>
            <Textarea
              id="sos-message"
              value={sosMessage}
              onChange={(e) => setSosMessage(e.target.value)}
              placeholder="Scrivi il messaggio che verrà inviato ai tuoi contatti"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Questo messaggio verrà inviato automaticamente quando attivi l'SOS
            </p>
          </div>

          {/* Location Sharing */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="share-location">Condividi Posizione</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Includi la tua posizione GPS nel messaggio di emergenza
              </p>
            </div>
            <Switch
              id="share-location"
              checked={shareLocation}
              onCheckedChange={setShareLocation}
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="w-full"
          >
            Salva Impostazioni SOS
          </Button>
        </CardContent>
      </Card>

      {/* Add Contact Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Contatto di Emergenza</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli della persona da contattare in caso di emergenza
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Nome *</Label>
              <Input
                id="contact-name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome del contatto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Telefono *</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+39 123 456 7890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Email (opzionale)</Label>
              <Input
                id="contact-email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="primary-contact"
                checked={newContact.is_primary}
                onCheckedChange={(checked) => setNewContact(prev => ({ ...prev, is_primary: checked }))}
              />
              <Label htmlFor="primary-contact" className="cursor-pointer">
                Contatto primario
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleAddContact} disabled={loading}>
              Aggiungi Contatto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
