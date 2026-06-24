/**
 * app.config.ts — single source of truth (bilingual { tr, en }).
 * Run `/setup` (or "bu projeyi kur") to rebrand + wire your keys.
 */
import type { L } from "@/lib/i18n/config";

export type IconName = string;
export interface NavItem { label: L; href: string; icon: IconName; }
export interface Feature { icon: IconName; title: L; body: L; }
export interface Stat { value: L; label: L; }
export interface PricingTier { name: string; price: string; period?: string; tagline: L; features: L[]; cta: L; featured?: boolean; }
export interface FaqItem { q: L; a: L; }
export interface Integration { key: string; name: string; envVars: string[]; required: boolean; docsUrl: string; purpose: string; }
export interface AppConfig {
  name: string; tagline: L; description: L; domain: string; logoText: string; accentName: string;
  marketing: { badge: L; heroTitle: L; heroAccent: L; heroSubtitle: L; heroCtaPrimary: L; heroCtaSecondary: L; features: Feature[]; stats: Stat[]; pricing: PricingTier[]; faq: FaqItem[]; };
  nav: NavItem[]; integrations: Integration[];
}

export const appConfig: AppConfig = {
  name: "Dropcart",
  tagline: { tr: "Dijital ürününü sat, anında teslim et.", en: "Sell your digital product, deliver instantly." },
  description: {
    tr: "Dropcart, içerik üreticileri için dijital ürün dükkânı: e-kitap, şablon, preset ve kursunu yükle, ödeme al, dosyayı saniyeler içinde otomatik teslim et.",
    en: "Dropcart is a digital storefront for creators: upload your ebooks, templates, presets and courses, take payment, and auto-deliver the files in seconds.",
  },
  domain: "dropcart.digital",
  logoText: "DC",
  accentName: "coral",

  marketing: {
    badge: { tr: "Yaratıcılar için dijital dükkân", en: "A digital store for creators" },
    heroTitle: { tr: "Bilgini ürüne çevir.", en: "Turn your know-how into a product." },
    heroAccent: { tr: "Uyurken bile satsın.", en: "Let it sell while you sleep." },
    heroSubtitle: {
      tr: "Dropcart, e-kitabını, şablonunu, presetini ve kursunu satışa açar. Güzel bir ürün sayfası, kart ödemesi ve anında otomatik teslimat — tek panelde. Komisyon avı yok, stok yok.",
      en: "Dropcart puts your ebook, template, preset and course on sale. A beautiful product page, card payment and instant auto-delivery — in one panel. No commission hunting, no inventory.",
    },
    heroCtaPrimary: { tr: "Dükkânı aç", en: "Open your store" },
    heroCtaSecondary: { tr: "Nasıl göründüğüne bak", en: "See what it looks like" },
    features: [
      { icon: "store", title: { tr: "Ürün sayfaları", en: "Product pages" }, body: { tr: "Her ürüne kapak, açıklama, fiyat ve önizleme. Saniyeler içinde yayında, mobilde kusursuz.", en: "A cover, description, price and preview for every product. Live in seconds, flawless on mobile." } },
      { icon: "zap", title: { tr: "Anında teslimat", en: "Instant delivery" }, body: { tr: "Ödeme onaylandığı an dosya/link alıcının mailine düşer. Sen uyurken bile teslim olur.", en: "The file or link hits the buyer's inbox the moment payment clears — even while you sleep." } },
      { icon: "credit-card", title: { tr: "Kart ile ödeme", en: "Card checkout" }, body: { tr: "Stripe ile güvenli ödeme; tek seferlik ya da abonelik. Para doğrudan senin hesabına.", en: "Secure Stripe checkout; one-time or subscription. Money lands straight in your account." } },
      { icon: "mail", title: { tr: "E-posta teslimi", en: "Email fulfilment" }, body: { tr: "Markalı teslimat e-postaları Resend ile gider — indirme linki, kupon ve teşekkür notu dahil.", en: "Branded delivery emails go out via Resend — download link, coupon and thank-you note included." } },
      { icon: "users", title: { tr: "Müşteri defteri", en: "Customer ledger" }, body: { tr: "Kim ne aldı, kaç kez döndü, ne kadar harcadı — hepsi tek listede, dışa aktarılabilir.", en: "Who bought what, how often they returned, how much they spent — one exportable list." } },
      { icon: "ticket-percent", title: { tr: "Kupon & paket", en: "Coupons & bundles" }, body: { tr: "İndirim kodu üret, ürünleri paketle, lansman fiyatı koy. Satışı sen yönlendir.", en: "Spin up discount codes, bundle products, set launch pricing. You steer the sales." } },
    ],
    stats: [
      { value: { tr: "%0", en: "0%" }, label: { tr: "satış komisyonu", en: "sales commission" } },
      { value: { tr: "12 sn", en: "12s" }, label: { tr: "ortalama teslim süresi", en: "average delivery time" } },
      { value: { tr: "4 tür", en: "4 types" }, label: { tr: "e-kitap · şablon · preset · kurs", en: "ebook · template · preset · course" } },
      { value: { tr: "0", en: "0" }, label: { tr: "anahtarla dene", en: "keys to try it" } },
    ],
    pricing: [
      { name: "Starter", price: "$0", period: "/mo", tagline: { tr: "İlk ürününü satmaya başla.", en: "Start selling your first product." }, features: [{ tr: "3 ürün", en: "3 products" }, { tr: "Anında teslimat", en: "Instant delivery" }, { tr: "%5 işlem payı", en: "5% per-sale fee" }, { tr: "Müşteri defteri", en: "Customer ledger" }], cta: { tr: "Ücretsiz başla", en: "Start free" } },
      { name: "Creator", price: "$12", period: "/mo", tagline: { tr: "Düzenli satan içerik üreticisi için.", en: "For the creator selling regularly." }, features: [{ tr: "Sınırsız ürün", en: "Unlimited products" }, { tr: "İşlem payı yok", en: "No per-sale fee" }, { tr: "Kupon & paket", en: "Coupons & bundles" }, { tr: "Markalı teslim e-postası", en: "Branded delivery email" }, { tr: "Özel alan adı", en: "Custom domain" }], cta: { tr: "30 gün ücretsiz dene", en: "Try free for 30 days" }, featured: true },
      { name: "Studio", price: "$29", period: "/mo", tagline: { tr: "Ekip ve marka için tam dükkân.", en: "The full store for a team & brand." }, features: [{ tr: "Creator'daki her şey", en: "Everything in Creator" }, { tr: "Ekip & roller", en: "Team & roles" }, { tr: "Abonelik ürünleri", en: "Subscription products" }, { tr: "API & webhook", en: "API & webhooks" }], cta: { tr: "Ekip kur", en: "Set up a team" } },
    ],
    faq: [
      { q: { tr: "Denemek için anahtar gerekli mi?", en: "Do I need API keys to try it?" }, a: { tr: "Hayır. Dropcart örnek ürünler, satışlar ve müşterilerle demo modda açılır — hemen tıklayabilirsin. Canlı satış için Stripe ve Resend anahtarını /setup ile bağlarsın.", en: "No. Dropcart boots in demo mode with sample products, sales and customers — click around immediately. Wire your Stripe and Resend keys via /setup to sell live." } },
      { q: { tr: "Hangi ürünleri satabilirim?", en: "What can I sell?" }, a: { tr: "Dijital her şey: e-kitap, Notion/figma şablonu, Lightroom preset'i, video kursu, ses paketi — tek dosya ya da link.", en: "Anything digital: ebooks, Notion/Figma templates, Lightroom presets, video courses, audio packs — a single file or a link." } },
      { q: { tr: "Teslimat nasıl çalışıyor?", en: "How does delivery work?" }, a: { tr: "Ödeme onaylanır onaylanmaz alıcıya markalı bir e-posta gider; indirme linki güvenli ve süreli olabilir. Hiçbir şeyi elle göndermen gerekmez.", en: "The moment payment clears, the buyer gets a branded email with a secure, optionally time-limited download link. You never send anything by hand." } },
      { q: { tr: "Para bana nasıl ulaşıyor?", en: "How do I get paid?" }, a: { tr: "Ödemeler Stripe hesabına doğrudan geçer; Sellfold araya girmez. Ödeme planları ve banka aktarımı Stripe panelinden yönetilir.", en: "Payments go straight to your Stripe account; Sellfold never holds your money. Payouts and bank transfers are managed from your Stripe dashboard." } },
    ],
  },

  nav: [
    { label: { tr: "Genel", en: "Overview" }, href: "/dashboard", icon: "layout-dashboard" },
    { label: { tr: "Ürünler", en: "Products" }, href: "/products", icon: "package" },
    { label: { tr: "Satışlar", en: "Sales" }, href: "/sales", icon: "receipt" },
    { label: { tr: "Müşteriler", en: "Customers" }, href: "/customers", icon: "users" },
    { label: { tr: "Ayarlar", en: "Settings" }, href: "/settings", icon: "settings" },
  ],

  integrations: [
    { key: "stripe", name: "Stripe", envVars: ["STRIPE_SECRET_KEY"], required: false, docsUrl: "https://dashboard.stripe.com/apikeys", purpose: "Card checkout for one-time and subscription product sales." },
    { key: "resend", name: "Resend", envVars: ["RESEND_API_KEY"], required: false, docsUrl: "https://resend.com/api-keys", purpose: "Branded instant-delivery and receipt emails to buyers." },
    { key: "supabase", name: "Supabase", envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"], required: false, docsUrl: "https://supabase.com/dashboard/project/_/settings/api", purpose: "Stores products, sales and customers. Without it, runs in demo mode." },
  ],
};

export default appConfig;
