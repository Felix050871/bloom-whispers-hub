-- Create profile for existing user
INSERT INTO public.profiles (user_id, onboarding_completed)
VALUES ('d03df71f-45dc-4b64-9193-62f91d9a71cf', false)
ON CONFLICT (user_id) DO NOTHING;