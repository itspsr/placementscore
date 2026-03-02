import { NextResponse } from 'next/server';
import { getBlogs } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blogs = await getBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
