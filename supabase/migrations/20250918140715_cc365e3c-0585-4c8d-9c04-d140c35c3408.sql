-- Remove the foreign key constraint temporarily for sample data
ALTER TABLE public.mentors DROP CONSTRAINT mentors_user_id_fkey;

-- Insert sample mentors without user_id constraint
INSERT INTO public.mentors (name, specialty, category, bio, rating, reviews_count, price_per_session, verified, avatar_emoji, user_id) VALUES
('Dr.ssa Maria Rossi', 'Psicologa e Coach', 'Relazioni & Emozioni', 'Specialista in benessere emotivo e relazioni interpersonali', 4.9, 127, 30.00, true, '👩‍⚕️', '00000000-0000-0000-0000-000000000001'),
('Giulia Bianchi', 'Nutrizionista', 'Sport & Nutrimento', 'Nutrizione intuitiva e stile di vita sano', 4.8, 89, 30.00, true, '🥗', '00000000-0000-0000-0000-000000000002'),
('Sofia Verde', 'Beauty Expert', 'Beauty & Make up', 'Consulente per skincare e makeup personalizzato', 4.7, 156, 30.00, true, '✨', '00000000-0000-0000-0000-000000000003');

-- Re-add the foreign key constraint but allow existing data
ALTER TABLE public.mentors ADD CONSTRAINT mentors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;

-- Insert sample daily content
INSERT INTO public.daily_content (title, description, category, content_type, duration, thumbnail_url, active) VALUES
('Respirazione del mattino', 'Inizia la giornata con serenità', 'Relazioni & Emozioni', 'video', '3 min', NULL, true),
('Nutrizione intuitiva', 'Ascolta il tuo corpo', 'Sport & Nutrimento', 'audio', '5 min', NULL, true),
('Skincare routine serale', 'Coccole per la tua pelle', 'Beauty & Make up', 'tip', '2 min', NULL, true);