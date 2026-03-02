import { createClient } from '@supabase/supabase-js';

import { requireServerEnv } from './serverEnv';

export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('Supabase browser env missing');
    return null;
  }
  return createClient(url, key);
}

export function getSupabaseAdmin() {
  requireServerEnv();
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase admin env missing');
  return createClient(url, key, { auth: { persistSession: false } });
}
