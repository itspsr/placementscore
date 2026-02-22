import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient(
    { cookies },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE
    }
  );

  let { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error && /Email not confirmed/i.test(error.message)) {
    const list: any = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = list?.data?.users?.find((u: any) => u.email === email);
    const userId = user?.id || null;
    if (userId) {
      await supabase.auth.admin.updateUserById(userId, { email_confirm: true });
      const retry = await supabase.auth.signInWithPassword({ email, password });
      data = retry.data;
      error = retry.error;
    }
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const userId = data.user?.id || null;
  if (userId) {
    await supabase.from('users').upsert({ id: userId, plan: 'free' });
    await supabase.from('profiles').upsert({ id: userId, name: data.user?.user_metadata?.name || data.user?.email || 'User', email: data.user?.email, plan: 'free' });
  }
  return NextResponse.json({ success: true, user: data.user });
}
