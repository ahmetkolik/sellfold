"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, Zap, CreditCard, Mail, Check, Plus, Minus, Sparkles,
  BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap,
  ShoppingCart, Download, Star, Loader2, Store, Users, TicketPercent,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatMoney } from "@/lib/utils";
import appConfig from "@/app.config";
import { createClient } from "@/lib/supabase/client";

type ProductType = "ebook" | "template" | "preset" | "course";
interface StoreProduct {
  id: string; title: string; type: ProductType; price: number; hue: string; emoji: string;
}

const typeIcon: Record<ProductType, typeof BookOpen> = {
  ebook: BookOpen, template: LayoutTemplate, preset: SlidersHorizontal, course: GraduationCap,
};
const typeLabel: Record<ProductType, { tr: string; en: string }> = {
  ebook: { tr: "E-kitap", en: "Ebook" },
  template: { tr: "Şablon", en: "Template" },
  preset: { tr: "Preset", en: "Preset" },
  course: { tr: "Kurs", en: "Course" },
};

const featureIcons: Record<string, typeof Zap> = {
  store: Store, zap: Zap, "credit-card": CreditCard,
  mail: Mail, users: Users, "ticket-percent": TicketPercent,
};
const featureHues = ["32", "70", "152", "250", "350", "300"];

/* ── Interactive buy demo ─────────────────────────────────────────────────── */
type DeliverStage = "idle" | "paying" | "packing" | "done";
function InstantDeliveryDemo({ lang }: { lang: "tr" | "en" }) {
  const [stage, setStage] = useState<DeliverStage>("idle");
  const [sold, setSold] = useState(58);
  const [revenue, setRevenue] = useState(1542);
  const PRICE = 29;

  const c = {
    tr: {
      kicker: "Anında teslim · canlı dene",
      h: ["Satın al'a bas,", "teslimatı izle."],
      body: "Aşağıdaki bir ürün kartı. \"Satın al\"a bas; ödemenin geçişini, dosyanın paketlenişini ve indirme linkinin e-postana düşüşünü saniyeler içinde gör.",
      product: "Sinematik Lightroom Preset Paketi", type: "Preset · 24 LUT",
      buy: "Satın al", processing: "Ödeme alınıyor…", packing: "Dosya paketleniyor…",
      delivered: "Teslim edildi", download: "İndirme linki hazır", reset: "Tekrar dene",
      soldLabel: "bugünkü satış", revLabel: "bugünkü gelir", emailLine: "elif@studio.co adresine gönderildi",
      steps: ["Kart çekildi", "Dosya güvenli linke sarıldı", "Markalı e-posta yollandı"],
    },
    en: {
      kicker: "Instant delivery · try it live",
      h: ["Hit Buy,", "watch it deliver."],
      body: "Below is a product card. Tap \"Buy\" and watch the payment clear, the file get packaged and the download link land in your inbox in seconds.",
      product: "Cinematic Lightroom Preset Pack", type: "Preset · 24 LUTs",
      buy: "Buy", processing: "Taking payment…", packing: "Packaging…",
      delivered: "Delivered", download: "Download link ready", reset: "Run it again",
      soldLabel: "sales today", revLabel: "revenue today", emailLine: "Sent to elif@studio.co",
      steps: ["Card charged", "File wrapped in a secure link", "Branded email sent"],
    },
  }[lang];

  function buy() {
    if (stage === "paying" || stage === "packing") return;
    setStage("paying");
    setTimeout(() => setStage("packing"), 1100);
    setTimeout(() => { setStage("done"); setSold((s) => s + 1); setRevenue((r) => r + PRICE); }, 2300);
  }

  const stepDone = (i: number) =>
    (stage === "paying" && i === 0) || (stage === "packing" && i <= 1) || (stage === "done" && i <= 2);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
      <div className="relative overflow-hidden rounded-3xl bg-card p-6 shadow-pop ring-1 ring-border">
        <div className="overflow-hidden rounded-2xl ring-1 ring-border">
          <div className="grid aspect-[16/10] place-items-center" style={{ backgroundImage: "linear-gradient(140deg, oklch(94% 0.06 350), oklch(86% 0.14 350))" }}>
            <span className="text-5xl drop-shadow-sm">🎞️</span>
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{c.product}</p>
            <p className="text-xs text-muted-foreground">{c.type}</p>
          </div>
          <p className="shrink-0 font-display text-xl font-semibold tabular-nums text-primary">${PRICE}</p>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> 4.9 · 211</span>
          <span><span className="font-semibold tabular-nums text-foreground">{sold}</span> {c.soldLabel}</span>
        </div>
        <button
          onClick={buy}
          disabled={stage === "paying" || stage === "packing"}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[15px] font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
        >
          {stage === "paying" ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" /> {c.processing}</>)
            : stage === "packing" ? (<><Zap className="h-4 w-4" /> {c.packing}</>)
            : stage === "done" ? (<><Check className="h-4 w-4" /> {c.delivered}</>)
            : (<><CreditCard className="h-4 w-4" /> {c.buy} · ${PRICE}</>)}
        </button>
        {stage === "done" && (
          <button onClick={() => setStage("idle")} className="mt-2 inline-flex w-full items-center justify-center text-xs font-medium text-muted-foreground hover:text-foreground">{c.reset}</button>
        )}
      </div>

      <div className="relative flex flex-col overflow-hidden rounded-3xl bg-sidebar p-6 text-sidebar-foreground shadow-pop">
        <span className="blob -right-16 -top-16 h-44 w-44 bg-primary/40 drift" aria-hidden />
        <div className="relative flex items-center justify-between">
          <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" /> {c.kicker}</p>
          <p className="label-mono text-sidebar-muted">{c.revLabel}</p>
        </div>
        <p className="relative mt-2 font-display text-3xl font-semibold tabular-nums">${revenue.toLocaleString("en-US")}</p>
        <ol className="relative mt-5 space-y-2.5">
          {c.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-xl bg-white/[0.05] px-3.5 py-2.5 ring-1 ring-white/10 transition">
              <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs transition", stepDone(i) ? "bg-success text-success-foreground" : "bg-white/10 text-sidebar-muted")}>
                {stepDone(i) ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={cn("text-[13.5px]", stepDone(i) ? "text-sidebar-foreground" : "text-sidebar-muted")}>{s}</span>
              {stepDone(i) && <Zap className="ml-auto h-3.5 w-3.5 text-success" />}
            </li>
          ))}
        </ol>
        <div className={cn("relative mt-4 overflow-hidden rounded-2xl ring-1 transition-all", stage === "done" ? "bg-success/15 ring-success/40" : "bg-white/[0.03] ring-white/10")}>
          {stage === "done" ? (
            <div className="flex items-center gap-3 p-4 animate-float-up">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success/25 text-success"><Mail className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">{c.download}</p>
                <p className="truncate text-[11.5px] text-sidebar-muted">{c.emailLine}</p>
              </div>
            </div>
          ) : (
            <p className="p-4 text-center text-[12.5px] text-sidebar-muted">
              {lang === "tr" ? "Satın al'a bas → teslimat burada belirir" : "Hit Buy → delivery appears here"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Product card with Stripe checkout ───────────────────────────────────── */
function ProductCard({ product, lang, t }: { product: StoreProduct; lang: "tr" | "en"; t: (x: { tr: string; en: string }) => string }) {
  const [loading, setLoading] = useState(false);
  const Icon = typeIcon[product.type] ?? BookOpen;

  async function buy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const { url, error } = await res.json();
      if (error || !url) { alert(lang === "tr" ? "Bir hata oluştu, lütfen tekrar deneyin." : "An error occurred, please try again."); setLoading(false); return; }
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
      <Link href={`/p/${product.id}`} className="block">
        <div className="relative">
          <div
            className="grid aspect-[16/9] place-items-center"
            style={{ backgroundImage: `linear-gradient(140deg, oklch(94% 0.06 ${product.hue}) 0%, oklch(86% 0.13 ${product.hue}) 100%)` }}
          >
            <span className="text-4xl drop-shadow-sm">{product.emoji}</span>
          </div>
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
            <Icon className="h-3 w-3" /> {t(typeLabel[product.type])}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <p className="truncate font-medium">{product.title}</p>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <p className="font-display text-xl font-semibold tabular-nums text-primary">
            {formatMoney(product.price)}
          </p>
          <button
            onClick={buy}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            {loading ? (lang === "tr" ? "Yükleniyor…" : "Loading…") : (lang === "tr" ? "Satın al" : "Buy")}
          </button>
        </div>
        <Link href={`/p/${product.id}`} className="mt-2 block text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors">
          {lang === "tr" ? "Detayları gör →" : "View details →"}
        </Link>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function StorePage() {
  const { lang, t } = useLang();
  const [products, setProducts] = useState<StoreProduct[] | null>(null);
  const [open, setOpen] = useState<number | null>(0);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "cancelled" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") setPaymentStatus("success");
    if (params.get("payment") === "cancelled") setPaymentStatus("cancelled");

    const supabase = createClient();
    supabase
      .from("products")
      .select("id, title, type, price, hue, emoji")
      .eq("live", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setProducts((data ?? []) as StoreProduct[]));
  }, []);

  const c = {
    tr: {
      nav: ["Ürünler", "Nasıl çalışır", "Fiyatlar", "S.S.S."], login: "Giriş yap",
      pricingKicker: "Fiyatlar", pricingH: "Büyüdükçe ölçekle.", pricingSub: "Tüm planlar USD. İşlem ücreti yok — kazandığın sende kalır.", popular: "En popüler",
      heroBadge: "Dijital ürün mağazası",
      h1: "Dijital ürünleri keşfet,", h1b: "anında indir.",
      sub: "Güvenli ödeme, anında teslimat. Satın aldığın dosyayı saniyeler içinde e-postan üzerinden alırsın.",
      cta: "Ürünlere bak",
      productsTitle: "Mağaza", productsEmpty: "Yakında ürünler eklenecek.", productsLoading: "Yükleniyor…",
      demoKicker: "Anında teslim · canlı dene",
      demoH: ["Satın al'a bas,", "teslimatı izle."],
      demoBody: "Bir ürün satın aldığında neler olur? Aşağıdaki demo ile ödeme sürecini ve anında teslimatı canlı olarak gör.",
      typesKicker: "Ne satın alabilirsin",
      typesH: ["Dijital olan her şey,", "bir mağazada."],
      typesBody: "PDF, Notion/Figma şablonu, Lightroom preset'i, video kursu veya ses paketi — hepsi anında teslim edilir.",
      types: [
        { t: "E-kitap", b: "PDF, EPUB rehberler", emoji: "📘", hue: "70" },
        { t: "Şablon", b: "Notion, Figma, Canva", emoji: "🗂️", hue: "32" },
        { t: "Preset", b: "Lightroom, LUT, filtre", emoji: "🎞️", hue: "350" },
        { t: "Kurs", b: "Video dersler, içerik", emoji: "🎓", hue: "152" },
        { t: "Lisans", b: "Yazılım, font, eklenti", emoji: "🔑", hue: "250" },
        { t: "Ses", b: "Sample, beat, podcast", emoji: "🎧", hue: "300" },
      ],
      howKicker: "Nasıl çalışır",
      howH: ["Üç adımda", "dijital ürün al."],
      steps: [
        { n: "01", t: "Ürünü seç", b: "Mağazadan istediğin ürünü seç, fiyatını gör." },
        { n: "02", t: "Güvenli öde", b: "Stripe ile kredi kartınla güvenle öde. Bilgilerin korunur." },
        { n: "03", t: "Anında teslim", b: "Ödeme onaylanır onaylanmaz dosyan e-postanla teslim edilir." },
      ],
      faqKicker: "Sıkça Sorulan Sorular",
      faqH: "Hızlı cevaplar.",
      faq: [
        { q: "Ürünü nasıl alırım?", a: "Satın al butonuna tıkla, kartınla güvenle öde. Ödeme onaylandığında ürün dosyan e-posta adresine otomatik teslim edilir — hiçbir şey yapman gerekmez." },
        { q: "Ödeme güvenli mi?", a: "Evet. Tüm ödemeler Stripe altyapısıyla işlenir; kart bilgilerin hiçbir zaman bizimle paylaşılmaz, doğrudan Stripe'a şifreli gönderilir." },
        { q: "Dosyayı nereden indiririm?", a: "Satın aldıktan sonra e-posta adresine indirme linki gönderilir. Link genellikle 7 gün geçerlidir." },
        { q: "İade politikası nedir?", a: "Dijital ürünler teslim edildikten sonra iade edilemez. Ancak bir sorun yaşarsan bizimle iletişime geç, çözeceğiz." },
        { q: "Ödemeler hangi para birimiyle?", a: "Tüm fiyatlar USD ($) cinsinden. Ödemeler Stripe ile kart üzerinden güvenle işlenir." },
      ],
      finaleH: ["Beğendiğin ürünü", "hemen al."],
      finaleSub: "Güvenli ödeme · USD · Anında e-posta teslimi",
      footTagline: `${appConfig.name} · Dijital ürün mağazası`,
      successMsg: "Teşekkürler! Ürün dosyan e-postana gönderildi.",
      cancelledMsg: "Ödeme iptal edildi. İstediğin zaman tekrar deneyebilirsin.",
    },
    en: {
      nav: ["Products", "How it works", "Pricing", "FAQ"], login: "Sign in",
      pricingKicker: "Pricing", pricingH: "Scale as you grow.", pricingSub: "All plans in USD. No hidden fees — what you earn is yours.", popular: "Most popular",
      heroBadge: "Digital product store",
      h1: "Discover digital products,", h1b: "download instantly.",
      sub: "Secure payment, instant delivery. The file lands in your inbox seconds after you pay.",
      cta: "Browse products",
      productsTitle: "Store", productsEmpty: "Products coming soon.", productsLoading: "Loading…",
      demoKicker: "Instant delivery · try it live",
      demoH: ["Hit Buy,", "watch it deliver."],
      demoBody: "Wondering what happens when you buy? See the payment and instant delivery flow live in the demo below.",
      typesKicker: "What you can buy",
      typesH: ["Anything digital,", "in one store."],
      typesBody: "PDF guides, Notion/Figma templates, Lightroom presets, video courses or audio packs — all delivered instantly.",
      types: [
        { t: "Ebook", b: "PDF, EPUB guides", emoji: "📘", hue: "70" },
        { t: "Template", b: "Notion, Figma, Canva", emoji: "🗂️", hue: "32" },
        { t: "Preset", b: "Lightroom, LUT, filters", emoji: "🎞️", hue: "350" },
        { t: "Course", b: "Video lessons, content", emoji: "🎓", hue: "152" },
        { t: "License", b: "Software, fonts, plugins", emoji: "🔑", hue: "250" },
        { t: "Audio", b: "Samples, beats, podcasts", emoji: "🎧", hue: "300" },
      ],
      howKicker: "How it works",
      howH: ["Three steps to", "your digital product."],
      steps: [
        { n: "01", t: "Choose a product", b: "Browse the store and pick what you want." },
        { n: "02", t: "Pay securely", b: "Check out with your card via Stripe. Your info stays safe." },
        { n: "03", t: "Instant download", b: "The moment payment clears, your file is emailed to you automatically." },
      ],
      faqKicker: "FAQ",
      faqH: "Quick answers.",
      faq: [
        { q: "How do I get my product?", a: "Click Buy, pay securely with your card. Once payment is confirmed, your file is automatically emailed to you — no action needed from your side." },
        { q: "Is payment secure?", a: "Yes. All payments are processed by Stripe; your card details are never shared with us — they go encrypted directly to Stripe." },
        { q: "Where do I download my file?", a: "A download link is emailed to you right after purchase. The link is usually valid for 7 days." },
        { q: "What's the refund policy?", a: "Digital products are non-refundable once delivered. If you have an issue, contact us and we'll make it right." },
        { q: "What currency are prices in?", a: "All prices are in USD ($). Card payments are processed securely through Stripe." },
      ],
      finaleH: ["Find your product,", "buy it now."],
      finaleSub: "Secure checkout · USD · Instant email delivery",
      footTagline: `${appConfig.name} · Digital product store`,
      successMsg: "Thank you! Your file has been sent to your email.",
      cancelledMsg: "Payment cancelled. You can try again any time.",
    },
  }[lang];

  return (
    <div className="min-h-dvh">
      {/* Payment status banner */}
      {paymentStatus && (
        <div className={cn("fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-6 py-3 text-sm font-medium shadow-pop", paymentStatus === "success" ? "bg-success text-success-foreground" : "bg-destructive/10 text-destructive border border-destructive/20")}>
          {paymentStatus === "success" ? c.successMsg : c.cancelledMsg}
        </div>
      )}

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <span className="font-display text-lg font-semibold tracking-tight">{appConfig.name}</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#products" className="hover:text-foreground transition-colors">{c.nav[0]}</a>
            <a href="#how" className="hover:text-foreground transition-colors">{c.nav[1]}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{c.nav[2]}</a>
            <a href="#faq" className="hover:text-foreground transition-colors">{c.nav[3]}</a>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-7">
            <LanguageToggle className="mr-1" />
            <Link href="/login" className="hidden px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">{c.login}</Link>
            <a href="#products" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition hover:opacity-90">{c.cta} <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)", opacity: 0.7 }} />
        <span className="blob -left-24 -top-20 -z-10 h-96 w-96 bg-primary/25 drift" aria-hidden />
        <span className="blob right-1/4 top-32 -z-10 h-72 w-72 drift" aria-hidden style={{ background: "color-mix(in oklch, var(--color-serif) 28%, transparent)", animationDelay: "2s" }} />
        <div className="mx-auto max-w-4xl px-5 py-20 text-center lg:px-8 lg:py-32">
          <p className="rise label-mono inline-flex items-center justify-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.heroBadge}</p>
          <h1 className="rise mt-6 font-display text-[clamp(40px,6.5vw,76px)] font-semibold leading-[0.96] tracking-tight" style={{ animationDelay: "0.08s" }}>
            {c.h1}<br />
            <span className="display-accent font-normal">{c.h1b}</span>
          </h1>
          <p className="rise mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "0.18s" }}>{c.sub}</p>
          <div className="rise mt-8 flex items-center justify-center gap-3" style={{ animationDelay: "0.28s" }}>
            <a href="#products" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground shadow-sm shadow-primary/25 transition hover:opacity-90">
              {c.cta} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rise mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground" style={{ animationDelay: "0.38s" }}>
            <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> {lang === "tr" ? "Güvenli ödeme" : "Secure payment"}</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-success" /> {lang === "tr" ? "Anında teslimat" : "Instant delivery"}</span>
            <span className="inline-flex items-center gap-1.5"><Download className="h-4 w-4 text-success" /> {lang === "tr" ? "7 gün indirme linki" : "7-day download link"}</span>
          </div>

          {/* Social proof */}
          <div className="rise mt-8 flex items-center justify-center gap-3" style={{ animationDelay: "0.48s" }}>
            <div className="flex -space-x-2.5">
              {(["32","350","152","70","250"] as const).map((hue, i) => (
                <span key={i} className="grid h-9 w-9 shrink-0 place-items-center rounded-full ring-2 ring-background text-[11px] font-bold text-white" style={{ backgroundImage: `linear-gradient(140deg, oklch(72% 0.17 ${hue}), oklch(58% 0.22 ${hue}))` }}>
                  {["A","E","M","J","S"][i]}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">3,200+</span>{" "}
              {lang === "tr" ? "içerik üreticisi dükkânını açtı" : "creators already selling"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Products grid ───────────────────────────────────────────── */}
      <section id="products" className="border-t border-border py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-tight">{c.productsTitle}</h2>
          </div>
          {products === null ? (
            <div className="flex h-48 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> {c.productsLoading}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <span className="text-4xl">📦</span>
              <p className="mt-4">{c.productsEmpty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} lang={lang} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="border-t border-border py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary">
              <span className="h-px w-7 bg-primary" />
              {lang === "tr" ? "Özellikler" : "Features"}
            </p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">
              {lang === "tr" ? "Satmak için gereken her şey" : "Everything you need to sell"}{" "}
              <span className="display-accent font-normal">
                {lang === "tr" ? "tek panelde." : "in one place."}
              </span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {appConfig.marketing.features.map((f, i) => {
              const Icon = featureIcons[f.icon] ?? Zap;
              const hue = featureHues[i % featureHues.length];
              return (
                <article key={t(f.title)} className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-pop">
                  <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle, oklch(92% 0.08 ${hue}) 0%, transparent 70%)` }}
                  />
                  <span className="relative grid h-11 w-11 place-items-center rounded-xl"
                    style={{ backgroundImage: `linear-gradient(140deg, oklch(95% 0.06 ${hue}), oklch(88% 0.14 ${hue}))` }}>
                    <Icon className="h-5 w-5 text-foreground/70" />
                  </span>
                  <h3 className="relative mt-4 font-semibold tracking-tight">{t(f.title)}</h3>
                  <p className="relative mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{t(f.body)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="overflow-hidden rounded-3xl" style={{ backgroundImage: "var(--grad-brand)" }}>
            <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
              {appConfig.marketing.stats.map((s) => (
                <div key={t(s.label)} className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center text-white">
                  <p className="font-display text-5xl font-bold tracking-tight tabular-nums">{t(s.value)}</p>
                  <p className="text-sm font-medium text-white/75">{t(s.label)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive buy demo ────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><Zap className="h-3.5 w-3.5" /> {c.demoKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.demoH[0]} <span className="display-accent font-normal">{c.demoH[1]}</span></h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{c.demoBody}</p>
          </div>
          <InstantDeliveryDemo lang={lang} />
        </div>
      </section>

      {/* ── Product types ───────────────────────────────────────────── */}
      <section className="border-t border-border py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.typesKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.typesH[0]} <span className="display-accent font-normal">{c.typesH[1]}</span></h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{c.typesBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {c.types.map((ty) => (
              <article key={ty.t} className="group overflow-hidden rounded-2xl bg-card text-center shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                <div className="grid aspect-square place-items-center" style={{ backgroundImage: `linear-gradient(140deg, oklch(95% 0.05 ${ty.hue}), oklch(87% 0.13 ${ty.hue}))` }}>
                  <span className="text-4xl drop-shadow-sm transition group-hover:scale-110">{ty.emoji}</span>
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-semibold tracking-tight">{ty.t}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">{ty.b}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section id="how" className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.howKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.howH[0]} <span className="display-accent font-normal">{c.howH[1]}</span></h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {c.steps.map((s) => (
              <div key={s.n} className="relative rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border">
                <span className="font-display text-5xl font-semibold leading-none text-primary/25">{s.n}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 ring-1 ring-border"><CreditCard className="h-4 w-4 text-primary" /> Stripe</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 ring-1 ring-border"><Zap className="h-4 w-4 text-primary" /> {lang === "tr" ? "Anında teslim" : "Instant delivery"}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 ring-1 ring-border"><Mail className="h-4 w-4 text-primary" /> {lang === "tr" ? "E-posta ile" : "Via email"}</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section id="faq" className="border-t border-border py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="mb-10 text-center">
            <p className="label-mono text-primary">{c.faqKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,42px)] font-semibold tracking-tight">{c.faqH}</h2>
          </div>
          <ul className="space-y-2.5">
            {c.faq.map((item, i) => (
              <li key={item.q} className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[15px] font-semibold tracking-tight">{item.q}</span>
                  {open === i ? <Minus className="h-4 w-4 shrink-0 text-muted-foreground" /> : <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </button>
                {open === i && <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-muted-foreground">{item.a}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-border py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="label-mono text-primary">{c.pricingKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,42px)] font-semibold tracking-tight">{c.pricingH}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{c.pricingSub}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {appConfig.marketing.pricing.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-3xl p-7 ring-1 transition-shadow",
                  tier.featured
                    ? "bg-sidebar text-sidebar-foreground ring-0 shadow-pop"
                    : "bg-card ring-border shadow-soft",
                )}
              >
                {tier.featured && (
                  <span className="absolute right-5 top-5 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
                    {c.popular}
                  </span>
                )}
                <p className={cn("text-sm font-medium", tier.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{tier.name}</p>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-semibold tracking-tight">{tier.price}</span>
                  {tier.period && <span className={cn("text-sm", tier.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{tier.period}</span>}
                </p>
                <p className={cn("mt-2 text-sm", tier.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{t(tier.tagline)}</p>
                <ul className="my-7 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={t(f)} className="flex items-center gap-2.5 text-[13.5px]">
                      <Check className={cn("h-4 w-4 shrink-0", tier.featured ? "text-primary" : "text-success")} />
                      <span className={tier.featured ? "text-sidebar-foreground" : ""}>{t(f)}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/login"
                  className={cn(
                    "inline-flex w-full items-center justify-center rounded-full py-2.5 text-[14px] font-medium transition",
                    tier.featured
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-foreground hover:bg-muted/80",
                  )}
                >
                  {t(tier.cta)}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Finale CTA ──────────────────────────────────────────────── */}
      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] p-10 text-center text-white lg:p-14" style={{ background: "var(--grad-brand)" }}>
          <span className="blob left-1/4 -top-12 h-64 w-64 bg-white/20 drift" aria-hidden />
          <div className="relative">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-white/70"><Sparkles className="h-3 w-3" /> {appConfig.domain}</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-[clamp(32px,5vw,60px)] font-semibold leading-[1] tracking-tight">{c.finaleH[0]} <span className="italic">{c.finaleH[1]}</span></h2>
            <p className="mt-4 text-[15px] text-white/80">{c.finaleSub}</p>
            <div className="mt-8">
              <a href="#products" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-foreground transition hover:bg-white/90">
                {c.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center text-sm text-muted-foreground lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-7 w-7" />
            <span className="font-display text-base font-semibold tracking-tight text-foreground">{appConfig.name}</span>
          </Link>
          <p className="text-[12.5px]">{c.footTagline} · {appConfig.domain} · © 2026</p>
          <p className="label-mono inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> {lang === "tr" ? "Tüm sistemler çalışıyor" : "All systems operational"}</p>
          <Link href="/login" className="text-xs hover:text-foreground">{c.login}</Link>
        </div>
      </footer>
    </div>
  );
}
