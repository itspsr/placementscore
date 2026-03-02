import { cookies } from 'next/headers';
import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';

const ADMIN_EMAILS = new Set([
  'admin@placementscore.online',
  'itspsr@gmail.com',
  'urboss'
]);

export function getRouteHandlerSupabase() {
  return createRouteHandlerClient(
    { cookies },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE
    }
  );
}

export function getServerComponentSupabase() {
  return createServerComponentClient(
    { cookies },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE
    }
  );
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.has(email);
}
