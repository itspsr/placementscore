import { createClient } from '@supabase/supabase-js';

import { requireEnv } from './env';

export function getSupabaseBrowser() {
  requireEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env missing');
  return createClient(url, key);
}

export function getSupabaseAdmin() {
  requireEnv();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) throw new Error('Supabase env missing');
  return createClient(url, key, { auth: { persistSession: false } });
}
