import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapman gerekiyor" }, { status: 401 });

  // Check user plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "starter";

  // Count how many products this user has already claimed/purchased (by buyer_email)
  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("buyer_email", user.email ?? "");

  const claimedCount = count ?? 0;

  if (plan === "starter" && claimedCount >= 1) {
    return NextResponse.json({ error: "quota_exceeded", plan }, { status: 403 });
  }
  if (plan === "creator" && claimedCount >= 5) {
    return NextResponse.json({ error: "quota_exceeded", plan }, { status: 403 });
  }

  // Check if user already claimed THIS specific product
  const { count: already } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("buyer_email", user.email ?? "")
    .eq("product_id", productId);

  if ((already ?? 0) > 0) {
    return NextResponse.json({ error: "already_claimed" }, { status: 409 });
  }

  // Fetch product info
  const { data: product } = await supabase
    .from("products")
    .select("user_id, title, file_url, file_url_en")
    .eq("id", productId)
    .eq("live", true)
    .single();

  if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });

  // Create free order
  await supabase.from("orders").insert({
    product_id: productId,
    user_id: product.user_id,
    buyer_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Customer",
    buyer_email: user.email ?? "",
    amount: 0,
    delivered: true,
  });

  // Send download email
  if (user.email && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const buyerName = user.user_metadata?.full_name ?? "Müşteri";
    await resend.emails.send({
      from: "Dropcart <noreply@dropcart.digital>",
      to: user.email,
      subject: `Ürünün hazır: ${product.title}`,
      html: buildClaimEmail({ buyerName, productName: product.title, fileUrlTr: product.file_url, fileUrlEn: product.file_url_en }),
    });
  }

  return NextResponse.json({ ok: true });
}

function buildClaimEmail({ buyerName, productName, fileUrlTr, fileUrlEn }: {
  buyerName: string;
  productName: string;
  fileUrlTr: string | null;
  fileUrlEn: string | null;
}) {
  const hasFiles = fileUrlTr || fileUrlEn;
  const downloadSection = hasFiles
    ? `<div style="margin:32px 0">
        <p style="text-align:center;margin:0 0 8px;font-size:13px;color:#6b7280">
          Choose your preferred language / Dil seçin:
        </p>
        <table cellpadding="0" cellspacing="0" style="margin:0 auto"><tr>
          ${fileUrlEn ? `<td style="padding:0 6px"><a href="${fileUrlEn}" style="display:inline-block;background:#18181b;color:#fff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px">🇬🇧 Download in English</a></td>` : ""}
          ${fileUrlTr ? `<td style="padding:0 6px"><a href="${fileUrlTr}" style="display:inline-block;background:#18181b;color:#fff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px">🇹🇷 Türkçe İndir</a></td>` : ""}
        </tr></table>
      </div>`
    : `<p style="color:#6b7280;font-size:14px;text-align:center">İndirme linkiniz en kısa sürede iletilecektir.</p>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px"><tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)">
      <tr><td style="background:#18181b;padding:28px 40px"><p style="margin:0;color:#fff;font-size:22px;font-weight:700">Dropcart</p></td></tr>
      <tr><td style="padding:40px">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#18181b">Teşekkürler, ${buyerName}! 🎉</h1>
        <p style="margin:0 0 24px;color:#6b7280;font-size:15px">Starter planın kapsamında ürününüz hazır.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px 24px;margin-bottom:24px">
          <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;font-weight:600">ÜRÜN</p>
          <p style="margin:0;font-size:17px;font-weight:600;color:#18181b">${productName}</p>
          <p style="margin:6px 0 0;font-size:14px;color:#6b7280">Ücretsiz (Starter Plan)</p>
        </div>
        ${downloadSection}
        <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center">
          Sorularınız için <a href="mailto:info@dropcart.digital" style="color:#18181b">info@dropcart.digital</a>
        </p>
      </td></tr>
      <tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">© Dropcart · dropcart.digital</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}
