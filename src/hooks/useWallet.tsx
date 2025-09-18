import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface WalletBalance {
  id: string;
  user_id: string;
  balance_cents: number;
  created_at: string;
  updated_at: string;
}

interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'top_up' | 'session_payment' | 'micro_service' | 'refund' | 'subscription';
  amount_cents: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method?: string;
  stripe_payment_intent_id?: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

interface WalletPreferences {
  id: string;
  user_id: string;
  auto_use_wallet: boolean;
  auto_topup_enabled: boolean;
  auto_topup_threshold_cents: number;
  auto_topup_amount_cents: number;
  preferred_payment_method?: string;
  refund_to_wallet: boolean;
  created_at: string;
  updated_at: string;
}

interface WalletContextType {
  balance: number; // in euros
  balanceCents: number;
  transactions: WalletTransaction[];
  preferences: WalletPreferences | null;
  loading: boolean;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  topUpWallet: (amountCents: number, paymentMethod: string) => Promise<boolean>;
  payFromWallet: (amountCents: number, description: string, type: WalletTransaction['type']) => Promise<boolean>;
  hasEnoughBalance: (amountCents: number) => boolean;
  updatePreferences: (prefs: Partial<WalletPreferences>) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balanceCents, setBalanceCents] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [preferences, setPreferences] = useState<WalletPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const balance = balanceCents / 100; // Convert cents to euros

  const initializeWallet = async () => {
    if (!user) return;

    try {
      // Initialize wallet balance if it doesn't exist
      const { data: existingBalance } = await supabase
        .from('wallet_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existingBalance) {
        await supabase
          .from('wallet_balances')
          .insert({ user_id: user.id, balance_cents: 0 });
      }

      // Initialize preferences if they don't exist
      const { data: existingPrefs } = await supabase
        .from('wallet_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existingPrefs) {
        await supabase
          .from('wallet_preferences')
          .insert({ user_id: user.id });
      }

      await refreshBalance();
      await refreshTransactions();
      await refreshPreferences();
    } catch (error) {
      console.error('Error initializing wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet_balances')
        .select('balance_cents')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) setBalanceCents(data.balance_cents);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const refreshTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      if (data) setTransactions(data as WalletTransaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const refreshPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  // Simulate Stripe payment processing
  const simulateStripePayment = async (amountCents: number, paymentMethod: string): Promise<boolean> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (!success) {
      throw new Error('Payment failed - Please try again');
    }
    
    return true;
  };

  const topUpWallet = async (amountCents: number, paymentMethod: string): Promise<boolean> => {
    if (!user) return false;

    try {
      toast({
        title: "Processing payment...",
        description: "Please wait while we process your top-up.",
      });

      // Create pending transaction
      const { data: transaction, error: txError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'top_up',
          amount_cents: amountCents,
          description: `Top-up wallet (${paymentMethod})`,
          status: 'pending',
          payment_method: paymentMethod,
          stripe_payment_intent_id: `sim_pi_${Date.now()}`,
        })
        .select()
        .single();

      if (txError) throw txError;

      // Simulate Stripe payment
      await simulateStripePayment(amountCents, paymentMethod);

      // Update transaction to completed
      await supabase
        .from('wallet_transactions')
        .update({ 
          status: 'completed',
          receipt_url: `https://example.com/receipts/${transaction.id}`
        })
        .eq('id', transaction.id);

      // Update wallet balance
      await supabase
        .from('wallet_balances')
        .update({ 
          balance_cents: balanceCents + amountCents 
        })
        .eq('user_id', user.id);

      await refreshBalance();
      await refreshTransactions();

      toast({
        title: "Top-up successful!",
        description: `€${(amountCents / 100).toFixed(2)} added to your wallet.`,
      });

      return true;
    } catch (error) {
      console.error('Top-up failed:', error);
      
      toast({
        title: "Top-up failed",
        description: error instanceof Error ? error.message : "An error occurred during top-up.",
        variant: "destructive",
      });

      return false;
    }
  };

  const payFromWallet = async (amountCents: number, description: string, type: WalletTransaction['type']): Promise<boolean> => {
    if (!user || balanceCents < amountCents) return false;

    try {
      // Create transaction
      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type,
          amount_cents: -amountCents, // Negative for payments
          description,
          status: 'completed',
        });

      // Update wallet balance
      await supabase
        .from('wallet_balances')
        .update({ 
          balance_cents: balanceCents - amountCents 
        })
        .eq('user_id', user.id);

      await refreshBalance();
      await refreshTransactions();

      toast({
        title: "Payment successful!",
        description: `€${(amountCents / 100).toFixed(2)} paid from wallet.`,
      });

      return true;
    } catch (error) {
      console.error('Payment failed:', error);
      
      toast({
        title: "Payment failed",
        description: "An error occurred during payment.",
        variant: "destructive",
      });

      return false;
    }
  };

  const hasEnoughBalance = (amountCents: number): boolean => {
    return balanceCents >= amountCents;
  };

  const updatePreferences = async (prefs: Partial<WalletPreferences>): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wallet_preferences')
        .update(prefs)
        .eq('user_id', user.id);

      if (error) throw error;
      await refreshPreferences();

      toast({
        title: "Preferences updated",
        description: "Your wallet preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Update failed",
        description: "Failed to update wallet preferences.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      initializeWallet();
    } else {
      setBalanceCents(0);
      setTransactions([]);
      setPreferences(null);
      setLoading(false);
    }
  }, [user]);

  const value = {
    balance,
    balanceCents,
    transactions,
    preferences,
    loading,
    refreshBalance,
    refreshTransactions,
    topUpWallet,
    payFromWallet,
    hasEnoughBalance,
    updatePreferences,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};