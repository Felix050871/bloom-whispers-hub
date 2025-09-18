-- Add a column to track onboarding completion
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed boolean DEFAULT false;

-- Update existing profiles to mark onboarding as completed if they have interests or goals
UPDATE public.profiles 
SET onboarding_completed = true 
WHERE (interests IS NOT NULL AND array_length(interests, 1) > 0) 
   OR (goals IS NOT NULL AND array_length(goals, 1) > 0);