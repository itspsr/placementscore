import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const { data, error } = await supabase
    .from("subscriptions")
    .select("status, plan")
    .eq("email", email)
    .eq("status", "active")
    .single();

  if (error || !data) {
    return NextResponse.json({ isExpert: false });
  }

  return NextResponse.json({ isExpert: true, plan: data.plan });
}
