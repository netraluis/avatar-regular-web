import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient(isAdmin = false) {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    isAdmin
      ? process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // Clave de servicio para operaciones admin
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            console.error("Error setting cookies");
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
