import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const PRICE_IDS: Record<string, string | undefined> = {
  creator: process.env.STRIPE_PRICE_CREATOR,
  studio: process.env.STRIPE_PRICE_STUDIO,
};

export async function POST(req: Request) {
  const { plan } = await req.json();
  const priceId = PRICE_IDS[plan as string];
  if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const stripe = getStripe();
  let customerId = profile?.stripe_customer_id as string | undefined;

  if (customerId) {
    try {
      await stripe.customers.retrieve(customerId);
    } catch {
      customerId = undefined;
      await supabase.from("profiles").update({ stripe_customer_id: null }).eq("id", user.id);
    }
  }

  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email });
    customerId = customer.id;
    await supabase.from("profiles").upsert({ id: user.id, stripe_customer_id: customerId });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${baseUrl}/account?subscription=success`,
    cancel_url: `${baseUrl}/account`,
    metadata: { user_id: user.id, plan },
  });

  return NextResponse.json({ url: session.url });
}
