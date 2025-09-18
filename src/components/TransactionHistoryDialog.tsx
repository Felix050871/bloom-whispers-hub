import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Filter } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getTransactionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    top_up: 'Ricarica',
    session_payment: 'Sessione',
    micro_service: 'Micro Servizio',
    refund: 'Rimborso',
    subscription: 'Abbonamento',
  };
  return labels[type] || type;
};

const getTransactionTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    top_up: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    session_payment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    micro_service: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    refund: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    subscription: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  };
  return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'In Elaborazione',
    completed: 'Completata',
    failed: 'Fallita',
    cancelled: 'Annullata',
  };
  return labels[status] || status;
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};

export const TransactionHistoryDialog = ({ open, onOpenChange }: TransactionHistoryDialogProps) => {
  const { transactions } = useWallet();

  const handleDownloadReceipt = (receiptUrl: string) => {
    window.open(receiptUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Storico Movimenti</span>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtri
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <p>Nessuna transazione trovata</p>
                  <p className="text-sm mt-1">
                    Le tue transazioni appariranno qui una volta effettuate
                  </p>
                </CardContent>
              </Card>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="transition-colors hover:bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="secondary" 
                            className={getTransactionTypeColor(transaction.type)}
                          >
                            {getTransactionTypeLabel(transaction.type)}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={getStatusColor(transaction.status)}
                          >
                            {getStatusLabel(transaction.status)}
                          </Badge>
                        </div>
                        
                        <p className="font-medium text-sm mb-1">
                          {transaction.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {format(new Date(transaction.created_at), 'dd MMM yyyy, HH:mm', { locale: it })}
                          </span>
                          {transaction.payment_method && (
                            <span>
                              via {transaction.payment_method}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className={`font-medium ${
                          transaction.amount_cents > 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount_cents > 0 ? '+' : ''}
                          €{Math.abs(transaction.amount_cents / 100).toFixed(2)}
                        </div>
                        
                        {transaction.receipt_url && transaction.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReceipt(transaction.receipt_url!)}
                            className="h-6 px-2 text-xs mt-1"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Ricevuta
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};