import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_BY_PRICE: Record<string, string> = {
  [process.env.STRIPE_PRICE_CREATOR ?? ""]: "creator",
  [process.env.STRIPE_PRICE_STUDIO ?? ""]: "studio",
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

  const supabase = getSupabase();

  // ── Checkout completed ────────────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan;

    // Subscription checkout (plan upgrade)
    if (userId && plan && session.subscription) {
      await supabase.from("profiles").update({
        plan,
        stripe_subscription_id: session.subscription as string,
        stripe_customer_id: session.customer as string,
      }).eq("id", userId);
      return NextResponse.json({ ok: true });
    }

    // One-time product purchase
    const productId = session.metadata?.product_id;
    if (!productId) return NextResponse.json({ ok: true });

    const { data: product } = await supabase
      .from("products")
      .select("user_id, name, file_url")
      .eq("id", productId)
      .single();

    if (product) {
      const details = session.customer_details;
      const buyerName = details?.name ?? "Customer";
      const buyerEmail = details?.email ?? "";
      const amount = (session.amount_total ?? 0) / 100;

      await supabase.from("orders").insert({
        product_id: productId,
        user_id: product.user_id,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        amount,
        delivered: true,
      });

      if (buyerEmail && process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Dropcart <noreply@dropcart.digital>",
          to: buyerEmail,
          subject: `Satın alımın hazır: ${product.name}`,
          html: buildPurchaseEmail({ buyerName, productName: product.name, fileUrl: product.file_url, amount }),
        });
      }
    }
  }

  // ── Subscription updated (plan change, renewal, past_due…) ───────────────
  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const priceId = sub.items.data[0]?.price.id ?? "";
    const plan = PLAN_BY_PRICE[priceId] ?? "starter";
    const active = sub.status === "active" || sub.status === "trialing";

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", sub.customer as string)
      .single();

    if (profile) {
      await supabase.from("profiles").update({
        plan: active ? plan : "starter",
      }).eq("id", profile.id);
    }
  }

  // ── Subscription cancelled ────────────────────────────────────────────────
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", sub.customer as string)
      .single();

    if (profile) {
      await supabase.from("profiles").update({
        plan: "starter",
        stripe_subscription_id: null,
      }).eq("id", profile.id);
    }
  }

  return NextResponse.json({ ok: true });
}

function buildPurchaseEmail({ buyerName, productName, fileUrl, amount }: {
  buyerName: string;
  productName: string;
  fileUrl: string | null;
  amount: number;
}) {
  const downloadSection = fileUrl
    ? `<p style="text-align:center;margin:32px 0">
        <a href="${fileUrl}" style="background:#18181b;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">
          Ürünü İndir
        </a>
       </p>`
    : `<p style="color:#6b7280;font-size:14px">Ürün dosyası en kısa sürede e-posta ile iletilecektir.</p>`;

  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)">
        <!-- Header -->
        <tr><td style="background:#18181b;padding:28px 40px">
          <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px">Dropcart</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px">
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#18181b">Teşekkürler, ${buyerName}! 🎉</h1>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px">Satın alımın başarıyla tamamlandı.</p>

          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px 24px;margin-bottom:24px">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;font-weight:600">ÜRÜN</p>
            <p style="margin:0;font-size:17px;font-weight:600;color:#18181b">${productName}</p>
            <p style="margin:6px 0 0;font-size:14px;color:#6b7280">₺${amount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</p>
          </div>

          ${downloadSection}

          <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center">
            Herhangi bir sorun için <a href="mailto:info@dropcart.digital" style="color:#18181b">info@dropcart.digital</a> adresine yazabilirsin.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">
            © Dropcart · dropcart.digital
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
