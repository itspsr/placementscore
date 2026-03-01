import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
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

    const text = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(text)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(text);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const email = payment.email;
      const orderId = payment.order_id;
      
      console.log(`Payment verified for ${email} (Order: ${orderId})`);

      const { error } = await supabase
        .from("subscriptions")
        .upsert({ 
          email: email,
          plan: "expert",
          payment_id: payment.id,
          order_id: orderId,
          amount: payment.amount / 100,
          status: "active",
          updated_at: new Date().toISOString()
        }, { onConflict: "email" });

      if (error) {
        console.error("Failed to update subscription:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Razorpay Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
