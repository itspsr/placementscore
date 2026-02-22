import { NextResponse } from 'next/server';
import { deleteBlog } from '@/lib/blogEngine';
import { getRouteHandlerSupabase, isAdminEmail } from '@/lib/adminAuth';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = getRouteHandlerSupabase();
  const { data } = await auth.auth.getUser();
  const email = data?.user?.email;

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteBlog(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
