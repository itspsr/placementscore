import { NextResponse } from 'next/server';
import { deleteBlog } from '@/lib/blogEngine';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.name === 'urboss' || session?.user?.email === 'itspsr@gmail.com' || session?.user?.email === 'admin@placementscore.online';

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteBlog(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
