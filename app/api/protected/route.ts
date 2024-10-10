import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function GET(request: Request) {
  const authorizationHeader = request.headers.get("authorization");
  if (!authorizationHeader) {
    return new Response(JSON.stringify({ error: "No token provided" }), {
      status: 401,
    });
  }
  const token = authorizationHeader.split(" ")[1];

  // Verifica y decodifica el token para obtener el usuario
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  console.log({ authorizationHeader });

  return new Response(JSON.stringify({ test: "test" }), { status: 200 });
}
