-- This is an empty migration.

-- Crear la función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO "User" (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Verificar si el esquema 'auth' existe antes de crear el trigger
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;