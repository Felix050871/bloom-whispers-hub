-- Create wallet balance table
CREATE TABLE public.wallet_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;

-- Create policies for wallet balances
CREATE POLICY "Users can view their own wallet balance" 
ON public.wallet_balances 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet balance" 
ON public.wallet_balances 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet balance" 
ON public.wallet_balances 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create transactions table
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('top_up', 'session_payment', 'micro_service', 'refund', 'subscription')),
  amount_cents INTEGER NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.wallet_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.wallet_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create wallet preferences table
CREATE TABLE public.wallet_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  auto_use_wallet BOOLEAN NOT NULL DEFAULT true,
  auto_topup_enabled BOOLEAN NOT NULL DEFAULT false,
  auto_topup_threshold_cents INTEGER NOT NULL DEFAULT 500,
  auto_topup_amount_cents INTEGER NOT NULL DEFAULT 1000,
  preferred_payment_method TEXT,
  refund_to_wallet BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for wallet preferences
CREATE POLICY "Users can view their own wallet preferences" 
ON public.wallet_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet preferences" 
ON public.wallet_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet preferences" 
ON public.wallet_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_wallet_balances_updated_at
BEFORE UPDATE ON public.wallet_balances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallet_transactions_updated_at
BEFORE UPDATE ON public.wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallet_preferences_updated_at
BEFORE UPDATE ON public.wallet_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();