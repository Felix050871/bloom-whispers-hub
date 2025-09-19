import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Wallet, Euro } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

interface TopUpDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_AMOUNTS = [500, 1000, 2000]; // in cents (€5, €10, €20)
const PAYMENT_METHODS = [
  { id: 'card', name: 'Carta di Credito', icon: CreditCard },
  { id: 'apple_pay', name: 'Apple Pay', icon: Smartphone },
  { id: 'google_pay', name: 'Google Pay', icon: Wallet },
];

export const TopUpDrawer = ({ open, onOpenChange }: TopUpDrawerProps) => {
  const { topUpWallet, balance } = useWallet();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [loading, setLoading] = useState(false);

  const getAmountInCents = (): number => {
    if (selectedAmount) return selectedAmount;
    const custom = parseFloat(customAmount.replace(',', '.'));
    return isNaN(custom) ? 0 : Math.round(custom * 100);
  };

  const getAmountInEuros = (cents: number): string => {
    return (cents / 100).toFixed(2);
  };

  const handleTopUp = async () => {
    const amountCents = getAmountInCents();
    if (amountCents < 100) return; // Minimum €1

    setLoading(true);
    try {
      const success = await topUpWallet(amountCents, selectedPaymentMethod);
      if (success) {
        onOpenChange(false);
        setSelectedAmount(null);
        setCustomAmount("");
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedPaymentMethodData = PAYMENT_METHODS.find(pm => pm.id === selectedPaymentMethod);
  
  console.log('TopUpDrawer render - open:', open, 'amountInCents:', getAmountInCents());

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Ricarica Wallet</DrawerTitle>
          <DrawerDescription>
            Aggiungi fondi al tuo wallet per pagare sessioni e servizi
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 space-y-6">
          {/* Current Balance */}
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Saldo Attuale</div>
                <div className="text-2xl font-bold">€{balance.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Amounts */}
          <div>
            <Label className="text-sm font-medium">Importi Rapidi</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {QUICK_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className="h-12"
                >
                  €{getAmountInEuros(amount)}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="custom-amount" className="text-sm font-medium">
              Importo Personalizzato
            </Label>
            <div className="relative mt-2">
              <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="custom-amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="0,00"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-sm font-medium">Metodo di Pagamento</Label>
            <div className="grid gap-2 mt-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <CardContent className="flex items-center gap-3 p-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{method.name}</span>
                      {method.id === 'card' && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Consigliato
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {getAmountInCents() >= 100 && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Importo ricarica:</span>
                    <span>€{getAmountInEuros(getAmountInCents())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commissioni:</span>
                    <span>€0,00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Totale:</span>
                    <span>€{getAmountInEuros(getAmountInCents())}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Nuovo saldo:</span>
                    <span>€{(balance + getAmountInCents() / 100).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Confirm Button */}
          <Button
            onClick={handleTopUp}
            disabled={getAmountInCents() < 100 || loading}
            className="w-full h-12"
            size="lg"
          >
            {loading ? (
              "Elaborazione..."
            ) : getAmountInCents() < 100 ? (
              "Seleziona un importo (min. €1,00)"
            ) : (
              `Conferma Ricarica €${getAmountInEuros(getAmountInCents())}`
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            I pagamenti sono elaborati in modo sicuro tramite Stripe con 3D Secure
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};