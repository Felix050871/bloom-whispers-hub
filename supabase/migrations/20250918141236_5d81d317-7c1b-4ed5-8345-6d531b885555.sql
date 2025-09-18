-- Enable RLS on all tables and create policies

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for moods
CREATE POLICY "Users can view their own moods" ON public.moods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own moods" ON public.moods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own moods" ON public.moods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own moods" ON public.moods FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for journal entries
CREATE POLICY "Users can view their own journal entries" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own journal entries" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journal entries" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journal entries" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for mentors
CREATE POLICY "Everyone can view mentors" ON public.mentors FOR SELECT USING (true);

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookings" ON public.bookings FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily content
CREATE POLICY "Everyone can view active daily content" ON public.daily_content FOR SELECT USING (active = true);

-- Create RLS policies for posts
CREATE POLICY "Everyone can view posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for post reactions
CREATE POLICY "Everyone can view post reactions" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Users can create their own reactions" ON public.post_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reactions" ON public.post_reactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions" ON public.post_reactions FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for comments
CREATE POLICY "Everyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create their own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for questions
CREATE POLICY "Everyone can view questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Users can create their own questions" ON public.questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own questions" ON public.questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own questions" ON public.questions FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for answers
CREATE POLICY "Everyone can view answers" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Users can create their own answers" ON public.answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own answers" ON public.answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own answers" ON public.answers FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON public.mentors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON public.answers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.mentors (name, specialty, category, bio, rating, reviews_count, price_per_session, verified, avatar_emoji) VALUES
('Dr.ssa Maria Rossi', 'Psicologa e Coach', 'Relazioni & Emozioni', 'Specialista in benessere emotivo e relazioni interpersonali', 4.9, 127, 30.00, true, '👩‍⚕️'),
('Giulia Bianchi', 'Nutrizionista', 'Sport & Nutrimento', 'Nutrizione intuitiva e stile di vita sano', 4.8, 89, 30.00, true, '🥗'),
('Sofia Verde', 'Beauty Expert', 'Beauty & Make up', 'Consulente per skincare e makeup personalizzato', 4.7, 156, 30.00, true, '✨')
ON CONFLICT DO NOTHING;

INSERT INTO public.daily_content (title, description, category, content_type, duration, thumbnail_url, active) VALUES
('Respirazione del mattino', 'Inizia la giornata con serenità', 'Relazioni & Emozioni', 'video', '3 min', NULL, true),
('Nutrizione intuitiva', 'Ascolta il tuo corpo', 'Sport & Nutrimento', 'audio', '5 min', NULL, true),
('Skincare routine serale', 'Coccole per la tua pelle', 'Beauty & Make up', 'tip', '2 min', NULL, true)
ON CONFLICT DO NOTHING;