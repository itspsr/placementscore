import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    // Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(text)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(text);

    // Handle Payment Captured
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const email = payment.email;
      const orderId = payment.order_id;
      
      console.log(`Payment verified for ${email} (Order: ${orderId})`);

      // Update User Subscription in Supabase
      // Assuming a 'users' or 'subscriptions' table exists. 
      // If user doesn't exist, we create/update based on email.
      
      const { data, error } = await supabase
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
