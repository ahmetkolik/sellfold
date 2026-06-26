import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

function buildWelcomeEmail({
  name,
  email,
  lang = "en",
}: {
  name: string;
  email: string;
  lang?: string;
}) {
  const isTr = lang === "tr";
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${isTr ? "Dropcart'a Hoş Geldiniz!" : "Welcome to Dropcart!"}</title>
</head>
<body style="margin:0;padding:0;background:#FBF7F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F2;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1B2D3A 0%,#2a4257 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:40px;height:40px;border-radius:10px;background:#1B2D3A;border:2px solid #EC9B78;display:inline-block;"></div>
              <span style="font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px;">Dropcart</span>
            </div>
            <p style="color:#EC9B78;font-size:13px;margin:8px 0 0;letter-spacing:0.1em;text-transform:uppercase;">
              ${isTr ? "Dijital Ürün Platformu" : "Digital Products Platform"}
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:40px;border-left:1px solid #eee;border-right:1px solid #eee;">
            <h1 style="margin:0 0 16px;font-size:26px;font-weight:700;color:#1B2D3A;line-height:1.2;">
              ${isTr ? `🎉 Hoş geldin, ${name || "harika kişi"}!` : `🎉 Welcome, ${name || "there"}!`}
            </h1>
            <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">
              ${isTr
                ? "Dropcart'a katıldığın için çok mutluyuz. Dijital ürünlerini dünyayla paylaşmak için doğru yerdesin."
                : "We're thrilled to have you on Dropcart. You're in the right place to share your digital products with the world."}
            </p>

            <!-- Feature highlights -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
              <tr>
                <td style="background:#FBF7F2;border-radius:12px;padding:20px 24px;">
                  <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#1B2D3A;">
                    ${isTr ? "Mağazanızla neler yapabilirsiniz?" : "What you can do with your store:"}
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    ${[
                      isTr ? ["📦", "E-kitap, şablon, preset ve kurs sat"] : ["📦", "Sell ebooks, templates, presets & courses"],
                      isTr ? ["⚡", "Ödeme anında, teslimat otomatik"] : ["⚡", "Instant payment, automatic delivery"],
                      isTr ? ["🌍", "Dünya genelinde müşteri kazan"] : ["🌍", "Reach customers worldwide"],
                      isTr ? ["📊", "Satışlarını gerçek zamanlı takip et"] : ["📊", "Track your sales in real time"],
                    ].map(([icon, text]) => `
                      <tr>
                        <td style="padding:5px 0;font-size:14px;color:#444;">
                          <span style="margin-right:8px;">${icon}</span>${text}
                        </td>
                      </tr>`).join("")}
                  </table>
                </td>
              </tr>
            </table>

            <!-- Plan info -->
            <div style="border:2px solid #EC9B78;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#D96B4A;text-transform:uppercase;letter-spacing:0.08em;">
                ${isTr ? "Starter Plan — Ücretsiz" : "Starter Plan — Free"}
              </p>
              <p style="margin:0;font-size:14px;color:#444;line-height:1.6;">
                ${isTr
                  ? "Ücretsiz Starter planınla hemen başlayabilirsin. Daha fazla ürün ve gelişmiş özellikler için Creator veya Studio planına geçebilirsin."
                  : "You're on the free Starter plan — jump right in. Upgrade to Creator or Studio for more products and advanced features."}
              </p>
            </div>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="https://dropcart.digital/dashboard"
                    style="display:inline-block;background:linear-gradient(135deg,#D96B4A 0%,#A84330 100%);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:50px;box-shadow:0 4px 20px rgba(217,107,74,0.35);">
                    ${isTr ? "Panele Git →" : "Go to Dashboard →"}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F5ECE3;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
              ${isTr
                ? `Bu mail <strong>${email}</strong> adresine gönderildi çünkü Dropcart'a kaydoldunuz.`
                : `This email was sent to <strong>${email}</strong> because you signed up for Dropcart.`}
              <br/>
              <a href="https://dropcart.digital" style="color:#D96B4A;text-decoration:none;">dropcart.digital</a>
              &nbsp;·&nbsp;
              <a href="https://dropcart.digital/dashboard" style="color:#D96B4A;text-decoration:none;">
                ${isTr ? "Panel" : "Dashboard"}
              </a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const { name, email, lang } = await req.json();

    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: true, skipped: "no_resend_key" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Dropcart <noreply@dropcart.digital>",
      to: email,
      subject: lang === "tr" ? "🎉 Dropcart'a hoş geldiniz!" : "🎉 Welcome to Dropcart!",
      html: buildWelcomeEmail({ name: name ?? "", email, lang }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("welcome-email error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
