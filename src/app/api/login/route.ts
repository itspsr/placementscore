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
    if (user) {
      await supabase.auth.admin.updateUserById(user.id, { email_confirm: true });
      const retry = await supabase.auth.signInWithPassword({ email, password });
      data = retry.data;
      error = retry.error;
    }
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, user: data.user });
}
