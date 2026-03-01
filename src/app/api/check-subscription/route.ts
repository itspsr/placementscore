import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
    return new Response(
      JSON.stringify({ success: false, reason: "missing-env" }),
      { status: 500 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

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
