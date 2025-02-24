-- This is an empty migration.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO "User" (id, email, "createdAt", "updatedAt", name, surname, phone, "language")
  VALUES (NEW.id, NEW.email, NOW(), NOW(), NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'surname', NEW.raw_user_meta_data ->> 'phone', (NEW.raw_user_meta_data ->> 'language')::"LanguageType");  
  RETURN NEW;
END;
$$;