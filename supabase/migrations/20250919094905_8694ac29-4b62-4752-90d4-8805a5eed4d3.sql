-- Add test mentors for each category

-- Relazioni & Emozioni
INSERT INTO public.mentors (name, category, specialty, bio, rating, reviews_count, price_per_session, avatar_emoji, verified) VALUES
('Dr.ssa Sofia Martinelli', 'relazioni', 'Psicologa delle relazioni', 'Specializzata in terapia di coppia e crescita personale. 10 anni di esperienza nel supporto emotivo.', 4.8, 127, 65.00, '👩‍⚕️', true),
('Elena Rossi', 'relazioni', 'Coach emotivo', 'Aiuto le donne a sviluppare intelligenza emotiva e autostima. Metodi olistici e pratici.', 4.6, 89, 45.00, '🌺', true),
('Dr. Marco Bianchi', 'relazioni', 'Terapeuta familiare', 'Esperto in dinamiche familiari e comunicazione efficace. Approccio empatico e personalizzato.', 4.9, 156, 70.00, '👨‍⚕️', true);

-- PinkCare - Salute femminile
INSERT INTO public.mentors (name, category, specialty, bio, rating, reviews_count, price_per_session, avatar_emoji, verified) VALUES
('Dr.ssa Giulia Ferrari', 'pinkcare', 'Ginecologa', 'Specialista in salute riproduttiva e benessere femminile. Consulenze personalizzate e supporto.', 4.9, 203, 80.00, '👩‍⚕️', true),
('Maria Conti', 'pinkcare', 'Ostetrica', 'Supporto durante gravidanza e maternità. Esperta in allattamento e cura del neonato.', 4.7, 145, 55.00, '🤱', true),
('Dr.ssa Anna Verde', 'pinkcare', 'Endocrinologa', 'Specializzata in squilibri ormonali femminili e ciclo mestruale. Approccio naturale e scientifico.', 4.8, 98, 75.00, '🌸', true);

-- Sport & Nutrimento
INSERT INTO public.mentors (name, category, specialty, bio, rating, reviews_count, price_per_session, avatar_emoji, verified) VALUES
('Chiara Fitness', 'sport', 'Personal Trainer', 'Allenatrice specializzata in fitness femminile e body positive. Programmi personalizzati.', 4.7, 189, 50.00, '💪', true),
('Dr.ssa Laura Nutri', 'sport', 'Nutrizionista', 'Piani alimentari personalizzati per donne attive. Approccio sostenibile e bilanciato.', 4.8, 167, 60.00, '🥗', true),
('Yoga Sara', 'sport', 'Istruttrice Yoga', 'Yoga terapeutico e mindfulness. Classi per tutti i livelli con focus sul benessere femminile.', 4.6, 134, 40.00, '🧘‍♀️', false);

-- Beauty & Make up
INSERT INTO public.mentors (name, category, specialty, bio, rating, reviews_count, price_per_session, avatar_emoji, verified) VALUES
('Marta MakeUp', 'beauty', 'Make-up Artist', 'Truccatrice professionista specializzata in look naturali e glamour. Corsi di auto-trucco.', 4.9, 245, 55.00, '💄', true),
('Alessia Skin', 'beauty', 'Estetista', 'Trattamenti viso personalizzati e skincare routine. Esperta in pelli sensibili e problematiche.', 4.7, 178, 65.00, '✨', true),
('Francesca Hair', 'beauty', 'Hair Stylist', 'Parrucchiera specializzata in tagli moderni e colorazioni naturali. Consulenza stile personale.', 4.8, 156, 70.00, '💇‍♀️', true);

-- Stile & Identità
INSERT INTO public.mentors (name, category, specialty, bio, rating, reviews_count, price_per_session, avatar_emoji, verified) VALUES
('Valentina Style', 'stile', 'Personal Stylist', 'Consulente di stile personale. Aiuto a trovare il proprio look autentico e valorizzante.', 4.8, 123, 75.00, '👗', true),
('Roberta Image', 'stile', 'Image Consultant', 'Consulenza su armocromia e valorizzazione della figura. Boost di autostima attraverso lo stile.', 4.7, 167, 65.00, '🌈', true),
('Silvia Wardrobe', 'stile', 'Organizzatrice guardaroba', 'Riorganizzazione armadi e creazione di outfit versatili. Stile sostenibile e consapevole.', 4.6, 89, 55.00, '👚', false);

-- Cartomanzia & Astrologia
INSERT INTO public.mentors (name, category, specialty, bio, rating, reviews_count, price_per_session, avatar_emoji, verified) VALUES
('Luna Astrologa', 'astrologia', 'Astrologa', 'Letture astrologiche personalizzate e consulti sul tema natale. 15 anni di esperienza.', 4.9, 289, 60.00, '🌙', true),
('Stella Tarot', 'astrologia', 'Cartomante', 'Letture dei tarocchi intuitive per guidarti nelle decisioni importanti. Approccio empatico.', 4.6, 203, 40.00, '🔮', true),
('Cristina Numerologia', 'astrologia', 'Numerologa', 'Analisi numerologica del nome e data di nascita. Scopri il tuo percorso di vita.', 4.7, 145, 50.00, '🔢', false);