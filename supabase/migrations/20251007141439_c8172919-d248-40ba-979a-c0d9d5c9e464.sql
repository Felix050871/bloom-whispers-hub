-- Create table for emergency contacts
CREATE TABLE public.sos_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sos_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own SOS contacts" 
ON public.sos_contacts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SOS contacts" 
ON public.sos_contacts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SOS contacts" 
ON public.sos_contacts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SOS contacts" 
ON public.sos_contacts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add SOS settings columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS sos_message TEXT DEFAULT 'Ho bisogno di aiuto. Questa è la mia posizione attuale.',
ADD COLUMN IF NOT EXISTS sos_share_location BOOLEAN DEFAULT true;

-- Create trigger for automatic timestamp updates on sos_contacts
CREATE TRIGGER update_sos_contacts_updated_at
BEFORE UPDATE ON public.sos_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();