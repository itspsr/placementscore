"use client";

import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { getSupabaseBrowser } from './supabaseClient';

export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
    });
    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return session;
}
