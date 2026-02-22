
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      console.warn("Supabase not configured; skipping lead capture.");
      return NextResponse.json({ success: true, safeMode: true });
    }

    // Upsert into leads table
    const { error } = await supabase
      .from('leads')
      .upsert({ 
        email, 
        source: source || 'free-template', 
        created_at: new Date().toISOString() 
      }, { onConflict: 'email' });

    if (error) {
      console.error("Supabase Lead Capture Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
