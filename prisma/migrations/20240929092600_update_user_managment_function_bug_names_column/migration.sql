-- This is an empty migration.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO "User" (id, email, "createdAt", "updatedAt")
  VALUES (NEW.id, NEW.email, NOW(), NOW());  -- Establecer createdAt y updatedAt con la fecha actual
  RETURN NEW;
END;
$$;