-- Create table for ALBA conversations
CREATE TABLE public.alba_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for ALBA messages within conversations
CREATE TABLE public.alba_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.alba_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for follow-ups
CREATE TABLE public.alba_followups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_id UUID NOT NULL REFERENCES public.alba_conversations(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  context TEXT NOT NULL,
  followup_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'dismissed')),
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.alba_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alba_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alba_followups ENABLE ROW LEVEL SECURITY;

-- Policies for alba_conversations
CREATE POLICY "Users can view their own conversations"
  ON public.alba_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON public.alba_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.alba_conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for alba_messages
CREATE POLICY "Users can view their own messages"
  ON public.alba_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alba_conversations
      WHERE alba_conversations.id = alba_messages.conversation_id
      AND alba_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own messages"
  ON public.alba_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.alba_conversations
      WHERE alba_conversations.id = alba_messages.conversation_id
      AND alba_conversations.user_id = auth.uid()
    )
  );

-- Policies for alba_followups
CREATE POLICY "Users can view their own followups"
  ON public.alba_followups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own followups"
  ON public.alba_followups FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX idx_alba_conversations_user ON public.alba_conversations(user_id, created_at DESC);
CREATE INDEX idx_alba_messages_conversation ON public.alba_messages(conversation_id, created_at);
CREATE INDEX idx_alba_followups_user_status ON public.alba_followups(user_id, status, followup_date);

-- Trigger for updated_at
CREATE TRIGGER update_alba_conversations_updated_at
  BEFORE UPDATE ON public.alba_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();