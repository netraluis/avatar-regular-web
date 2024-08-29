// pages/api/protected.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from './server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createClient();

  // Obtener el usuario autenticado
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Consultar la base de datos o realizar otras acciones como usuario autenticado
  const { data: subdomains, error: subdomainError } = await supabase
    .from('subdomains')
    .select('*')
    .eq('user_id', user.id);

  if (subdomainError) {
    return res.status(500).json({ error: subdomainError.message });
  }

  return res.status(200).json({ subdomains });
}
