import { createClient } from "./client";

const supabase = createClient();

export const startConnection = async (userId: string) => {
  // Crear o conectar al canal "mensajes"
  const channel = supabase.channel("avatar-channel");

  // Enviar un mensaje a través del canal
  channel.send({
    type: "broadcast",
    event: "start-session",
    payload: { userId },
  });

  console.log("Señal enviada startConnection");
};

export const endSession = async (userId: string) => {
  // Crear o conectar al canal "mensajes"
  const channel = supabase.channel("avatar-channel");

  // Enviar un mensaje a través del canal
  channel.send({
    type: "broadcast",
    event: "end-session",
    payload: { userId },
  });

  console.log("Señal enviada endSession");
};

export const newConversation = async (userId: string) => {
  // Crear o conectar al canal "mensajes"
  const channel = supabase.channel("avatar-channel");

  // Enviar un mensaje a través del canal
  channel.send({
    type: "broadcast",
    event: "new-conversation",
    payload: { userId },
  });

  console.log("Señal enviada newConversation");
};
