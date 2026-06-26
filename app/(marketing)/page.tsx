"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu, X, Check, ChevronDown, ArrowRight,
  ShoppingCart, Zap, CreditCard, Mail, Users, TicketPercent,
  BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap,
  Store, LayoutDashboard, Star,
} from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import appConfig from "@/app.config";
import { createClient } from "@/lib/supabase/client";

type ProductType = "ebook" | "template" | "preset" | "course";
interface Product {
  id: string; title: string; type: ProductType;
  price: number; emoji: string; hue: string;
  category_image_url: string | null;
}

const featureIcons: Record<string, React.ElementType> = {
  store: Store, zap: Zap, "credit-card": CreditCard,
  mail: Mail, users: Users, "ticket-percent": TicketPercent,
};
const typeIcon: Record<ProductType, React.ElementType> = {
  ebook: BookOpen, template: LayoutTemplate,
  preset: SlidersHorizontal, course: GraduationCap,
};

/* ── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#products",  tr: "Ürünler",   en: "Products" },
    { href: "#features",  tr: "Nasıl Çalışır?", en: "How it works" },
    { href: "#pricing",   tr: "Fiyatlar",   en: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="shrink-0"><Logo /></Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              {lang === "tr" ? l.tr : l.en}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:flex" />
          {isLoggedIn ? (
            <Link href="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-sidebar px-3 py-1.5 text-sm font-semibold text-sidebar-foreground hover:opacity-90 transition-opacity">
              <LayoutDashboard className="h-4 w-4" />
              {lang === "tr" ? "Yönetim" : "Dashboard"}
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                {lang === "tr" ? "Giriş yap" : "Sign in"}
              </Link>
              <Link href="/signup"
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                {lang === "tr" ? "Kayıt ol" : "Sign up"}
              </Link>
            </div>
          )}
          <button onClick={() => setOpen(!open)} aria-label="Menu"
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
              {lang === "tr" ? l.tr : l.en}
            </a>
          ))}
          <div className="pt-3 border-t border-border mt-2 space-y-2">
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-sidebar px-3 py-2.5 text-sm font-semibold text-sidebar-foreground">
                <LayoutDashboard className="h-4 w-4" />
                {lang === "tr" ? "Yönetim Paneli" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
                  {lang === "tr" ? "Giriş yap" : "Sign in"}
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                  {lang === "tr" ? "Ücretsiz kayıt ol" : "Sign up free"}
                </Link>
              </>
            )}
            <div className="flex justify-center pt-1"><LanguageToggle /></div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
const HERO_3D_IMAGE = "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_2de16b33-f1b7-418e-9092-201248e24ebb.png";

function Hero() {
  const { t, lang } = useLang();
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FBF7F2 0%, #F5ECE3 55%, #F0E4D8 100%)" }}>
      {/* Warm decorative blobs */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-80 w-80 rounded-full bg-[#D96B4A]/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-60 w-60 rounded-full bg-[#D96B4A]/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 lg:py-24 lg:px-8">
        <div className="grid lg:grid-cols-2 lg:items-center gap-12 lg:gap-8">
          {/* Left: text + CTAs */}
          <div>
            <span className="inline-block rounded-full border border-[#D96B4A]/30 bg-[#D96B4A]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D96B4A] mb-6">
              {t(appConfig.marketing.badge)}
            </span>
            <h1 className="font-display text-[clamp(34px,5vw,62px)] font-semibold leading-[1.08] tracking-tight text-foreground">
              {t(appConfig.marketing.heroTitle)}{" "}
              <span className="display-accent">{t(appConfig.marketing.heroAccent)}</span>
            </h1>
            <p className="mt-6 max-w-xl text-[clamp(15px,2vw,17px)] leading-relaxed text-muted-foreground">
              {t(appConfig.marketing.heroSubtitle)}
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-start gap-3">
              <a href="#products"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #D96B4A 0%, #A84330 100%)", boxShadow: "0 4px 24px #D96B4A44" }}>
                <ShoppingCart className="h-5 w-5" />
                {t(appConfig.marketing.heroCtaPrimary)}
              </a>
              <a href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-7 py-3.5 text-base font-semibold text-foreground hover:bg-white transition-colors">
                {t(appConfig.marketing.heroCtaSecondary)}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right: 3D visual */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px]">
              <div className="absolute inset-0 rounded-3xl bg-[#D96B4A]/15 blur-2xl scale-95 translate-y-4" />
              <img
                src={HERO_3D_IMAGE}
                alt="Dropcart digital store"
                className="relative w-full rounded-3xl shadow-2xl object-cover aspect-[4/3]"
                style={{ boxShadow: "0 20px 60px #D96B4A22, 0 4px 20px rgba(0,0,0,0.15)" }}
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-4 py-3 shadow-xl border border-border">
                <p className="text-xs font-semibold text-foreground">🎉 {lang === "tr" ? "Anında teslimat" : "Instant delivery"}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{lang === "tr" ? "Ödeme → indirme linki" : "Payment → download link"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats ───────────────────────────────────────────────────────────────── */
function Stats() {
  const { t } = useLang();
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
          {appConfig.marketing.stats.map((s) => (
            <div key={t(s.label)} className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <p className="font-display text-3xl font-bold text-primary tabular-nums">{t(s.value)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t(s.label)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ────────────────────────────────────────────────────────────── */
function Features() {
  const { t, lang } = useLang();
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="label-mono text-muted-foreground mb-3">{lang === "tr" ? "Nasıl Çalışır?" : "How it works"}</p>
          <h2 className="font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-tight">
            {lang === "tr" ? "Her şey tek panelde" : "Everything in one place"}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {appConfig.marketing.features.map((f) => {
            const Icon = featureIcons[f.icon] ?? ShoppingCart;
            return (
              <div key={t(f.title)} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-pop transition-shadow">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="font-semibold text-base mb-2">{t(f.title)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(f.body)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Products ────────────────────────────────────────────────────────────── */
function Products({ products, lang }: { products: Product[]; lang: "tr" | "en" }) {
  if (products.length === 0) return null;
  return (
    <section id="products" className="py-20 lg:py-28 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="label-mono text-muted-foreground mb-3">{lang === "tr" ? "Dijital Ürünler" : "Digital Products"}</p>
          <h2 className="font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-tight">
            {lang === "tr" ? "Ürünleri Keşfet" : "Explore Products"}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            {lang === "tr" ? "Ücretsiz Starter planıyla 1 ürün al, daha fazlası için yükselt." : "Grab 1 product free on Starter, upgrade for more."}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const Icon = typeIcon[p.type] ?? BookOpen;
            return (
              <Link key={p.id} href={`/p/${p.id}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:-translate-y-0.5 hover:shadow-pop transition-all">
                <div
                  className="aspect-[16/9] overflow-hidden"
                  style={!p.category_image_url ? { backgroundImage: `linear-gradient(140deg, oklch(94% 0.06 ${p.hue}) 0%, oklch(86% 0.13 ${p.hue}) 100%)` } : undefined}
                >
                  {p.category_image_url
                    ? <img src={p.category_image_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <span className="flex h-full w-full items-center justify-center text-5xl drop-shadow-sm">{p.emoji}</span>
                  }
                </div>
                <div className="p-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground mb-1">
                    <Icon className="h-3 w-3" /> {p.type}
                  </span>
                  <p className="font-semibold text-sm truncate">{p.title}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">
                      {lang === "tr" ? "Starter ile ücretsiz" : "Free on Starter"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {lang === "tr" ? "Görüntüle" : "View"}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <a href="#pricing"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            {lang === "tr" ? "Tüm planları gör" : "See all plans"}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────────────────────── */
function Pricing() {
  const { t, lang } = useLang();
  const planLinks: Record<string, string> = {
    Starter: "/signup",
    Creator: "/signup?plan=creator",
    Studio: "/signup?plan=studio",
  };
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="label-mono text-muted-foreground mb-3">{lang === "tr" ? "Fiyatlandırma" : "Pricing"}</p>
          <h2 className="font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-tight">
            {lang === "tr" ? "Senin için doğru plan" : "The right plan for you"}
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {appConfig.marketing.pricing.map((tier) => (
            <div key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-7 shadow-soft ${tier.featured ? "border-primary bg-primary/5 shadow-pop" : "border-border bg-card"}`}>
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  {lang === "tr" ? "En Popüler" : "Most Popular"}
                </span>
              )}
              <div className="mb-6">
                <p className="font-semibold text-lg">{tier.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t(tier.tagline)}</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((f) => (
                  <li key={t(f)} className="flex items-start gap-2.5 text-sm">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    {t(f)}
                  </li>
                ))}
              </ul>
              <Link href={planLinks[tier.name] ?? "/signup"}
                className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${tier.featured ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-sidebar text-sidebar-foreground"}`}>
                {t(tier.cta)}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
function FAQ() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 lg:py-28 bg-muted/30 border-t border-border">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-[clamp(26px,4vw,40px)] font-semibold tracking-tight">
            {lang === "tr" ? "Sık Sorulan Sorular" : "Frequently Asked Questions"}
          </h2>
        </div>
        <div className="space-y-3">
          {appConfig.marketing.faq.map((item, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold hover:bg-muted/50 transition-colors"
              >
                {t(item.q)}
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {t(item.a)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function Footer() {
  const { lang } = useLang();
  return (
    <footer className="border-t border-border py-12" style={{ background: "var(--color-sidebar)" }}>
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/"><Logo onDark /></Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" style={{ color: "var(--color-sidebar-muted)" }}>
            <a href="#products" className="hover:text-white transition-colors">{lang === "tr" ? "Ürünler" : "Products"}</a>
            <a href="#features" className="hover:text-white transition-colors">{lang === "tr" ? "Nasıl Çalışır?" : "How it works"}</a>
            <a href="#pricing" className="hover:text-white transition-colors">{lang === "tr" ? "Fiyatlar" : "Pricing"}</a>
            <Link href="/login" className="hover:text-white transition-colors">{lang === "tr" ? "Giriş yap" : "Sign in"}</Link>
            <Link href="/signup" className="hover:text-white transition-colors">{lang === "tr" ? "Kayıt ol" : "Sign up"}</Link>
          </nav>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs" style={{ borderColor: "var(--color-sidebar-border)", color: "var(--color-sidebar-muted)" }}>
          © 2026 {appConfig.name} · {appConfig.domain} · {lang === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function MarketingPage() {
  const { lang } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("products").select("id,title,type,price,emoji,hue,category_image_url").eq("live", true).limit(6)
      .then(({ data }) => setProducts((data ?? []) as Product[]));
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user));
  }, []);

  return (
    <div className="min-h-dvh">
      <Navbar isLoggedIn={isLoggedIn} />
      <Hero />
      <Stats />
      <Features />
      <Products products={products} lang={lang} />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
