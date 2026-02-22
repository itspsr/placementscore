import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
};

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) {
    console.warn("Supabase not configured; returning safe-mode subscription false.");
    return NextResponse.json({ isExpert: false, safeMode: true });
  }

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
