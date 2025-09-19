import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, History, Settings } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { TopUpDrawer } from "./TopUpDrawer";
import { TransactionHistoryDialog } from "./TransactionHistoryDialog";
import { WalletPreferencesDialog } from "./WalletPreferencesDialog";

export const WalletCard = () => {
  const { balance, balanceCents, loading } = useWallet();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const bloomCredits = Math.floor(balance);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="wallet-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Il Tuo Wallet</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-2xl font-bold">€{balance.toFixed(2)}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {bloomCredits} Bloom Credits
              </Badge>
              <span className="text-xs text-muted-foreground">
                1 credito = €1
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => {
                console.log('Ricarica button clicked, opening drawer');
                setTopUpOpen(true);
              }}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ricarica
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setHistoryOpen(true)}
            >
              <History className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setPreferencesOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <TopUpDrawer 
        open={topUpOpen} 
        onOpenChange={setTopUpOpen} 
      />
      
      <TransactionHistoryDialog 
        open={historyOpen} 
        onOpenChange={setHistoryOpen} 
      />
      
      <WalletPreferencesDialog 
        open={preferencesOpen} 
        onOpenChange={setPreferencesOpen} 
      />
    </>
  );
};