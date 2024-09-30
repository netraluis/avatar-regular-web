-- This is an empty migration.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO "User" (id, email, "createdAt", "updatedAt", status)
  VALUES (NEW.id, NEW.email, NOW(), NOW(), 'ACTIVE');  
  RETURN NEW;
END;
$$;