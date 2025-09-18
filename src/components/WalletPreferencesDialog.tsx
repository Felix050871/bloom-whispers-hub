import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useState, useEffect } from "react";

interface WalletPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WalletPreferencesDialog = ({ open, onOpenChange }: WalletPreferencesDialogProps) => {
  const { preferences, updatePreferences } = useWallet();
  const [localPrefs, setLocalPrefs] = useState({
    auto_use_wallet: true,
    auto_topup_enabled: false,
    auto_topup_threshold_cents: 500,
    auto_topup_amount_cents: 1000,
    preferred_payment_method: 'card',
    refund_to_wallet: true,
  });

  useEffect(() => {
    if (preferences) {
      setLocalPrefs({
        auto_use_wallet: preferences.auto_use_wallet,
        auto_topup_enabled: preferences.auto_topup_enabled,
        auto_topup_threshold_cents: preferences.auto_topup_threshold_cents,
        auto_topup_amount_cents: preferences.auto_topup_amount_cents,
        preferred_payment_method: preferences.preferred_payment_method || 'card',
        refund_to_wallet: preferences.refund_to_wallet,
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    await updatePreferences(localPrefs);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preferenze Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* General Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferenze Generali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Usa sempre Wallet quando possibile</Label>
                  <p className="text-sm text-muted-foreground">
                    Paga automaticamente dal wallet se il saldo è sufficiente
                  </p>
                </div>
                <Switch
                  checked={localPrefs.auto_use_wallet}
                  onCheckedChange={(checked) => 
                    setLocalPrefs({ ...localPrefs, auto_use_wallet: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Metodo di pagamento preferito per ricariche</Label>
                <Select
                  value={localPrefs.preferred_payment_method}
                  onValueChange={(value) => 
                    setLocalPrefs({ ...localPrefs, preferred_payment_method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Carta di Credito</SelectItem>
                    <SelectItem value="apple_pay">Apple Pay</SelectItem>
                    <SelectItem value="google_pay">Google Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Auto Top-up */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ricarica Automatica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Suggerisci ricarica automatica</Label>
                  <p className="text-sm text-muted-foreground">
                    Ti avviseremo quando il saldo scende sotto la soglia impostata
                  </p>
                </div>
                <Switch
                  checked={localPrefs.auto_topup_enabled}
                  onCheckedChange={(checked) => 
                    setLocalPrefs({ ...localPrefs, auto_topup_enabled: checked })
                  }
                />
              </div>

              {localPrefs.auto_topup_enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Soglia di avviso (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={(localPrefs.auto_topup_threshold_cents / 100).toFixed(2)}
                      onChange={(e) => {
                        const cents = Math.round(parseFloat(e.target.value || '0') * 100);
                        setLocalPrefs({ ...localPrefs, auto_topup_threshold_cents: cents });
                      }}
                      placeholder="5.00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Avviso quando il saldo scende sotto questo importo
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Importo suggerito per ricarica (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="1"
                      value={(localPrefs.auto_topup_amount_cents / 100).toFixed(2)}
                      onChange={(e) => {
                        const cents = Math.round(parseFloat(e.target.value || '0') * 100);
                        setLocalPrefs({ ...localPrefs, auto_topup_amount_cents: cents });
                      }}
                      placeholder="10.00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Importo che ti suggeriremo di ricaricare
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Refund Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rimborsi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Accredita rimborsi nel Wallet</Label>
                  <p className="text-sm text-muted-foreground">
                    I rimborsi saranno accreditati immediatamente nel wallet. 
                    Altrimenti verranno rimborsati sul metodo di pagamento originario quando possibile.
                  </p>
                </div>
                <Switch
                  checked={localPrefs.refund_to_wallet}
                  onCheckedChange={(checked) => 
                    setLocalPrefs({ ...localPrefs, refund_to_wallet: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button onClick={handleSave}>
              Salva Preferenze
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};