-- Create mentors table (if not exists)
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  category TEXT NOT NULL,
  bio TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  price_per_session DECIMAL(8,2) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  avatar_emoji TEXT DEFAULT '👩‍⚕️',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on mentors if not already enabled
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mentors (drop if exists first)
DROP POLICY IF EXISTS "Everyone can view mentors" ON public.mentors;
CREATE POLICY "Everyone can view mentors" ON public.mentors FOR SELECT USING (true);

-- Insert sample mentors (ignore conflicts)
INSERT INTO public.mentors (name, specialty, category, bio, rating, reviews_count, price_per_session, verified, avatar_emoji) VALUES
('Dr.ssa Maria Rossi', 'Psicologa e Coach', 'Relazioni & Emozioni', 'Specialista in benessere emotivo e relazioni interpersonali', 4.9, 127, 30.00, true, '👩‍⚕️'),
('Giulia Bianchi', 'Nutrizionista', 'Sport & Nutrimento', 'Nutrizione intuitiva e stile di vita sano', 4.8, 89, 30.00, true, '🥗'),
('Sofia Verde', 'Beauty Expert', 'Beauty & Make up', 'Consulente per skincare e makeup personalizzato', 4.7, 156, 30.00, true, '✨')
ON CONFLICT DO NOTHING;

-- Insert sample daily content (ignore conflicts)
INSERT INTO public.daily_content (title, description, category, content_type, duration, thumbnail_url, active) VALUES
('Respirazione del mattino', 'Inizia la giornata con serenità', 'Relazioni & Emozioni', 'video', '3 min', NULL, true),
('Nutrizione intuitiva', 'Ascolta il tuo corpo', 'Sport & Nutrimento', 'audio', '5 min', NULL, true),
('Skincare routine serale', 'Coccole per la tua pelle', 'Beauty & Make up', 'tip', '2 min', NULL, true)
ON CONFLICT DO NOTHING;