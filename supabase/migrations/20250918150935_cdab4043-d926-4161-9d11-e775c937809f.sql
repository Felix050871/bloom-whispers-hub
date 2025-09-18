-- Add detailed personal information fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN birth_date date,
ADD COLUMN weight_kg numeric(5,2),
ADD COLUMN height_cm integer,
ADD COLUMN hair_color text,
ADD COLUMN hair_type text,
ADD COLUMN skin_type text,
ADD COLUMN eye_color text,
ADD COLUMN lifestyle text,
ADD COLUMN allergies text[],
ADD COLUMN health_goals text[],
ADD COLUMN fitness_level text,
ADD COLUMN preferred_workout_time text,
ADD COLUMN dietary_preferences text[],
ADD COLUMN skin_concerns text[],
ADD COLUMN beauty_goals text[];

-- Add check constraints for reasonable values
ALTER TABLE public.profiles 
ADD CONSTRAINT check_weight_range CHECK (weight_kg IS NULL OR (weight_kg >= 30 AND weight_kg <= 300)),
ADD CONSTRAINT check_height_range CHECK (height_cm IS NULL OR (height_cm >= 100 AND height_cm <= 250)),
ADD CONSTRAINT check_birth_date CHECK (birth_date IS NULL OR birth_date <= CURRENT_DATE);