import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: Request) {
  const { name, email, password, contact_no, job_role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient(
    { cookies },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE
    }
  );

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const userId = data.user?.id || null;
  if (userId) {
    await supabase.from('users').upsert({ id: userId, plan: 'free' });
    await supabase.from('profiles').upsert({ id: userId, name, email, contact_no: contact_no || null, job_role: job_role || null, plan: 'free' });
  }

  return NextResponse.json({ success: true, user: data.user });
}
