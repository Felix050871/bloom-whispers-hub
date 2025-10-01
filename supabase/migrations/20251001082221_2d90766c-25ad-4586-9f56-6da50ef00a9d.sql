-- Add source field to moods table to track origin
ALTER TABLE public.moods 
ADD COLUMN source text DEFAULT 'manual' CHECK (source IN ('manual', 'alba_chat', 'journal', 'activity'));

-- Add index for better performance
CREATE INDEX idx_moods_user_created ON public.moods(user_id, created_at DESC);