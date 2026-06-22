import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret eksik" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Geçersiz imza" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.product_id;
    if (!productId) return NextResponse.json({ ok: true });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: product } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", productId)
      .single();

    if (product) {
      const details = session.customer_details;
      await supabase.from("orders").insert({
        product_id: productId,
        user_id: product.user_id,
        buyer_name: details?.name ?? "Müşteri",
        buyer_email: details?.email ?? "",
        amount: (session.amount_total ?? 0) / 100,
        delivered: true,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
