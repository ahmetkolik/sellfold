import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["kolikahmet@gmail.com", "info@kolikshop.com"];

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { productId } = await req.json();

  const supabase = await createClient();

  // Check logged-in user's quota (admins bypass quota checks)
  const { data: { user } } = await supabase.auth.getUser();
  if (user && !ADMIN_EMAILS.includes(user.email ?? "")) {
    const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
    const plan = profile?.plan ?? "starter";

    if (plan === "creator") {
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("buyer_email", user.email ?? "");
      if ((count ?? 0) >= 5) {
        return NextResponse.json({ error: "quota_exceeded", plan }, { status: 403 });
      }
    }
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, title, price, emoji, hue")
    .eq("id", productId)
    .eq("live", true)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            description: `${product.emoji} · Digital product · Instant delivery`,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/?payment=cancelled`,
    metadata: { product_id: product.id },
    customer_creation: "always",
    billing_address_collection: "auto",
    phone_number_collection: { enabled: false },
  });

  return NextResponse.json({ url: session.url });
}
