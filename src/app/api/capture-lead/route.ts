import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return new Response(JSON.stringify({ success: false, reason: "missing-env" }), { status: 500 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    const { email, source } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

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
