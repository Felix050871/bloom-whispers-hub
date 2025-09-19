-- Update the function to handle user metadata properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    name, 
    email, 
    onboarding_completed
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Now create the profile for the existing user
INSERT INTO public.profiles (user_id, name, email, onboarding_completed)
VALUES (
  'd03df71f-45dc-4b64-9193-62f91d9a71cf', 
  'Alba', 
  'segreteria@shebloom.it', 
  false
)
ON CONFLICT (user_id) DO NOTHING;