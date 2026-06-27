"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu, X, Check, ChevronDown, ArrowRight,
  ShoppingCart, Zap, CreditCard, Mail, Users, TicketPercent,
  BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap,
  Store, LayoutDashboard, Package, Globe,
} from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import appConfig from "@/app.config";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAILS = ["kolikahmet@gmail.com", "info@kolikshop.com"];

type ProductType = "ebook" | "template" | "preset" | "course";
interface Product {
  id: string; title: string; type: ProductType;
  price: number; emoji: string; hue: string;
  category_image_url: string | null;
  description: string | null;
  description_en: string | null;
}




const featureIcons: Record<string, React.ElementType> = {
  store: Store, zap: Zap, "credit-card": CreditCard,
  mail: Mail, users: Users, "ticket-percent": TicketPercent,
};
const typeIcon: Record<ProductType, React.ElementType> = {
  ebook: BookOpen, template: LayoutTemplate,
  preset: SlidersHorizontal, course: GraduationCap,
};

const STATIC_HERO_SLIDES = [
  { id: "h1", emoji: "🗂️", hue: "32",  type: { tr: "Şablon",  en: "Template" }, title: { tr: "Notion ile Hayat Sistemi",     en: "Notion Life OS"                }, price: null, badge: { tr: "En çok satan", en: "Best seller" }, image: null },
  { id: "h2", emoji: "🎞️", hue: "350", type: { tr: "Preset",   en: "Preset"   }, title: { tr: "Sinematik Lightroom Paketi",   en: "Cinematic Lightroom Pack"      }, price: null, badge: { tr: "Trend",        en: "Trending"   }, image: null },
  { id: "h3", emoji: "📘", hue: "70",  type: { tr: "E-kitap",  en: "Ebook"    }, title: { tr: "Freelancer'ın El Kitabı",      en: "The Freelancer's Handbook"     }, price: null, badge: { tr: "Çok satılan",  en: "Top rated"  }, image: null },
  { id: "h4", emoji: "🎓", hue: "152", type: { tr: "Kurs",     en: "Course"   }, title: { tr: "30 Günde Topluluk Kur",        en: "Build a Community in 30 Days"  }, price: null, badge: { tr: "Yeni",         en: "New"        }, image: null },
  { id: "h5", emoji: "🎠", hue: "300", type: { tr: "Şablon",   en: "Template" }, title: { tr: "Instagram Carousel Şablonları", en: "Instagram Carousel Templates" }, price: null, badge: { tr: "Popüler",      en: "Popular"    }, image: null },
];

const TYPE_LABELS: Record<ProductType, { tr: string; en: string }> = {
  ebook:    { tr: "E-kitap",  en: "Ebook"    },
  template: { tr: "Şablon",   en: "Template" },
  preset:   { tr: "Preset",   en: "Preset"   },
  course:   { tr: "Kurs",     en: "Course"   },
};

const BADGES = [
  { tr: "Trend",        en: "Trending"    },
  { tr: "Popüler",      en: "Popular"     },
  { tr: "Yeni",         en: "New"         },
  { tr: "Çok satılan",  en: "Top rated"   },
  { tr: "En çok satan", en: "Best seller" },
];

type HeroSlide = {
  id: string; emoji: string; hue: string;
  type: { tr: string; en: string };
  title: { tr: string; en: string };
  price: number | null;
  badge: { tr: string; en: string };
  image: string | null;
};

function buildHeroSlides(products: Product[]): HeroSlide[] {
  if (products.length === 0) return STATIC_HERO_SLIDES;
  return products.slice(0, 5).map((p, i) => ({
    id: p.id,
    emoji: p.emoji,
    hue: p.hue,
    type: TYPE_LABELS[p.type] ?? { tr: p.type, en: p.type },
    title: { tr: p.title, en: p.title },
    price: p.price,
    badge: BADGES[i % BADGES.length],
    image: p.category_image_url,
  }));
}

/* ── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar({ isLoggedIn, isAdmin }: { isLoggedIn: boolean; isAdmin: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#products", tr: "Ürünler",        en: "Products"    },
    { href: "#features", tr: "Nasıl Çalışır?",  en: "How it works" },
    { href: "#pricing",  tr: "Fiyatlar",        en: "Pricing"     },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="shrink-0"><Logo /></Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="rounded-[9px] px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              {lang === "tr" ? l.tr : l.en}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:flex" />
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-[9px] px-3.5 py-2 text-sm font-semibold text-sidebar-foreground transition-opacity hover:opacity-90"
                  style={{ background: "var(--color-sidebar)" }}>
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {lang === "tr" ? "Panel" : "Dashboard"}
                </Link>
              )}
              <Link href="/account"
                className="rounded-[9px] px-3.5 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                {lang === "tr" ? "Hesabım" : "My Account"}
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login"
                className="rounded-[9px] px-3.5 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                {lang === "tr" ? "Giriş yap" : "Sign in"}
              </Link>
              <Link href="/signup"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))", boxShadow: "0 4px 18px oklch(66% 0.18 32 / .3)" }}>
                {lang === "tr" ? "Ücretsiz başla" : "Get started free"}
              </Link>
            </div>
          )}
          <button onClick={() => setOpen(!open)} aria-label="Menu"
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

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
              <>
                {isAdmin && (
                  <Link href="/dashboard" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-sidebar-foreground"
                    style={{ background: "var(--color-sidebar)" }}>
                    <LayoutDashboard className="h-4 w-4" />
                    {lang === "tr" ? "Panel" : "Dashboard"}
                  </Link>
                )}
                <Link href="/account" onClick={() => setOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
                  {lang === "tr" ? "Hesabım" : "My Account"}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
                  {lang === "tr" ? "Giriş yap" : "Sign in"}
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))" }}>
                  {lang === "tr" ? "Ücretsiz başla" : "Get started free"}
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
function Hero({ slides }: { slides: HeroSlide[] }) {
  const { t, lang } = useLang();
  const isTr = lang === "tr";
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % slides.length), 3200);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, oklch(98% 0.02 50) 0%, oklch(95% 0.06 38) 50%, oklch(94% 0.07 350) 100%)" }}>
      <div className="pointer-events-none absolute -top-16 -right-16 h-[360px] w-[360px] rounded-full blur-[70px] drift"
        style={{ background: "oklch(66% 0.18 32 / .12)" }} />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[280px] w-[280px] rounded-full blur-[60px]"
        style={{ background: "oklch(66% 0.18 32 / .08)", animation: "drift 17s ease-in-out infinite reverse" }} />

      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-14" style={{ minHeight: "clamp(520px,68vh,700px)" }}>

          {/* Left: text + CTAs */}
          <div>
            <span className="rise inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[.13em] mb-5"
              style={{ borderColor: "oklch(66% 0.18 32 / .3)", background: "oklch(66% 0.18 32 / .1)", color: "oklch(58% 0.2 28)" }}>
              <span className="h-1.5 w-1.5 rounded-full pulse-dot" style={{ background: "oklch(66% 0.18 32)" }} />
              {isTr ? "1.000+ memnun müşteri" : "1,000+ happy customers"}
            </span>

            <h1 className="rise font-display font-semibold leading-[1.06] tracking-tight"
              style={{ fontSize: "clamp(38px,5vw,62px)", animationDelay: "60ms" }}>
              {t(appConfig.marketing.heroTitle)}{" "}
              <span className="italic" style={{ color: "oklch(52% 0.16 350)" }}>{t(appConfig.marketing.heroAccent)}</span>
            </h1>

            <p className="rise mt-5 leading-[1.72] text-muted-foreground"
              style={{ fontSize: "clamp(15px,1.7vw,17.5px)", maxWidth: 500, animationDelay: "120ms" }}>
              {t(appConfig.marketing.heroSubtitle)}
            </p>

            {/* Benefit chips */}
            <div className="rise flex flex-wrap gap-2.5 mt-5" style={{ animationDelay: "155ms" }}>
              {[
                { icon: <Zap className="h-3 w-3" />,   label: isTr ? "Anında indirme"       : "Instant download"  },
                { icon: <Check className="h-3 w-3" />,  label: isTr ? "İlk ürün ücretsiz"    : "First product free" },
                { icon: <Globe className="h-3 w-3" />,  label: isTr ? "30 gün iade garantisi" : "30-day refund"     },
              ].map(c => (
                <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{ background: "oklch(66% 0.14 152 / .1)", border: "1px solid oklch(66% 0.14 152 / .25)", color: "oklch(46% 0.12 152)" }}>
                  {c.icon}{c.label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="rise flex flex-wrap gap-3 mt-6" style={{ animationDelay: "190ms" }}>
              <a href="#products"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))", boxShadow: "0 8px 26px oklch(66% 0.18 32 / .36)" }}>
                <ShoppingCart className="h-4 w-4" />
                {isTr ? "Ücretsiz keşfet" : "Explore for free"}
              </a>
              <a href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-muted"
                style={{ background: "oklch(99.5% 0.005 50 / .8)" }}>
                {isTr ? "Nasıl çalışır?" : "How it works"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="rise flex items-center gap-1.5 mt-4 text-xs text-muted-foreground" style={{ animationDelay: "260ms" }}>
              <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "oklch(66% 0.14 152)" }} />
              {isTr ? "Starter planıyla ilk ürün bedava · kredi kartı gerekmez" : "First product free on Starter · no credit card needed"}
            </p>
          </div>

          {/* Right: product carousel */}
          <div className="rise relative flex justify-end" style={{ animationDelay: "150ms" }}>
            <div className="relative w-full max-w-[440px]">
              {/* Card shell */}
              <div className="relative overflow-hidden rounded-3xl border border-border"
                style={{ aspectRatio: "4/3", background: "oklch(99.5% 0.005 50)", boxShadow: "0 24px 60px oklch(66% 0.18 32 / .18), 0 4px 18px rgba(0,0,0,.1)" }}>
                {slides.map((sl, i) => {
                  const isProduct = !sl.id.startsWith("h");
                  const Wrapper = isProduct ? Link : "div";
                  const wrapperProps = isProduct ? { href: `/p/${sl.id}` } : {};
                  return (
                  <Wrapper key={sl.id} {...(wrapperProps as any)}
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 py-7${isProduct ? " cursor-pointer" : ""}`}
                    style={{
                      background: sl.image ? undefined : `linear-gradient(145deg, oklch(95% 0.07 ${sl.hue}) 0%, oklch(82% 0.18 ${sl.hue}) 100%)`,
                      opacity: i === slide ? 1 : 0,
                      transform: i === slide ? "scale(1) translateY(0)" : "scale(.97) translateY(8px)",
                      transition: "opacity .7s ease, transform .7s ease",
                      pointerEvents: i === slide ? "auto" : "none",
                    }}>
                    {sl.image ? (
                      <>
                        <img src={sl.image} alt={sl.title[lang]} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,.1) 55%, transparent 100%)" }} />
                        <div className="relative flex flex-col items-center gap-2 mt-auto w-full px-2 pb-2">
                          <span className="rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[.06em]"
                            style={{ background: "rgba(255,255,255,.82)", backdropFilter: "blur(8px)", color: "oklch(35% 0.04 35)" }}>
                            {sl.type[lang]}
                          </span>
                          <p className="font-display font-semibold text-center leading-[1.25] text-white drop-shadow"
                            style={{ fontSize: 18, margin: 0 }}>
                            {sl.title[lang]}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-7xl" style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,.12))" }}>{sl.emoji}</span>
                        <span className="rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[.06em]"
                          style={{ background: "rgba(255,255,255,.82)", backdropFilter: "blur(8px)", color: "oklch(35% 0.04 35)" }}>
                          {sl.type[lang]}
                        </span>
                        <p className="font-display font-semibold text-center leading-[1.25]"
                          style={{ fontSize: 20, color: "oklch(20% 0.04 35)", margin: 0 }}>
                          {sl.title[lang]}
                        </p>
                      </>
                    )}

                    {/* Badge */}
                    <div className="absolute top-3.5 right-3.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                      style={{ background: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))" }}>
                      {sl.badge[lang]}
                    </div>

                    {/* Free chip */}
                    {!sl.image && (
                      <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5"
                        style={{ background: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)" }}>
                        <Check className="h-3 w-3" style={{ color: "oklch(66% 0.14 152)" }} />
                        <span className="text-[11.5px] font-bold" style={{ color: "oklch(30% 0.04 35)" }}>
                          {isTr ? "Starter ile ücretsiz" : "Free on Starter"}
                        </span>
                      </div>
                    )}
                  </Wrapper>
                );
                })}
              </div>

              {/* Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-3.5">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)}
                    className="border-none cursor-pointer rounded-full transition-all duration-300"
                    style={{
                      background: i === slide ? "oklch(66% 0.18 32)" : "oklch(88% 0.01 35)",
                      width: i === slide ? 22 : 8,
                      height: 8,
                      padding: 0,
                    }} />
                ))}
              </div>

              {/* Floating delivery badge */}
              <div className="floaty absolute -left-5 top-4 rounded-[14px] border border-border bg-card px-3.5 py-2.5"
                style={{ boxShadow: "0 12px 26px rgba(0,0,0,.13)" }}>
                <p className="text-xs font-bold text-foreground">🎉 {isTr ? "Anında teslimat" : "Instant delivery"}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{isTr ? "Ödeme → indirme linki" : "Payment → download link"}</p>
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
            <div key={t(s.label)} className="flex flex-col items-center justify-center py-9 px-4 text-center">
              <p className="font-display font-bold tabular-nums" style={{ fontSize: "clamp(28px,3vw,38px)", color: "oklch(66% 0.18 32)", letterSpacing: "-.02em" }}>{t(s.value)}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{t(s.label)}</p>
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
        <div className="text-center mb-14 max-w-xl mx-auto">
          <p className="label-mono text-muted-foreground mb-3">{lang === "tr" ? "Nasıl Çalışır?" : "How it works"}</p>
          <h2 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
            {lang === "tr" ? "Her şey tek panelde" : "Everything in one place"}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {appConfig.marketing.features.map((f) => {
            const Icon = featureIcons[f.icon] ?? ShoppingCart;
            return (
              <div key={t(f.title)} className="rounded-[20px] border border-border bg-card p-6 shadow-soft hover:shadow-pop transition-shadow">
                <span className="grid h-11 w-11 place-items-center rounded-[13px] mb-4.5" style={{ background: "oklch(66% 0.18 32 / .1)" }}>
                  <Icon className="h-5 w-5" style={{ color: "oklch(66% 0.18 32)" }} />
                </span>
                <h3 className="font-bold text-base mb-2">{t(f.title)}</h3>
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
  const isTr = lang === "tr";

  return (
    <section id="products" className="py-20 lg:py-28" style={{ background: "oklch(96.6% 0.012 50 / .5)" }}>
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-4">
          <p className="label-mono text-muted-foreground mb-3">{isTr ? "Dijital Ürünler" : "Digital Products"}</p>
          <h2 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
            {isTr ? "Ürünleri Keşfet" : "Explore Products"}
          </h2>
          <p className="mt-2.5 text-sm text-muted-foreground">
            {isTr ? "Starter planıyla 1 ürün ücretsiz. Daha fazlası için yükselt." : "Grab 1 product free on Starter. Upgrade for more."}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-[22px] border-2 border-dashed border-border p-16 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-[18px] mx-auto mb-5" style={{ background: "oklch(66% 0.18 32 / .1)" }}>
              <Package className="h-7 w-7" style={{ color: "oklch(66% 0.18 32)" }} />
            </div>
            <p className="font-display font-semibold text-xl mb-2.5">{isTr ? "Ürünler yakında" : "Products coming soon"}</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
              {isTr
                ? "Mağazaya ürün eklendikçe burada görünecek. Kayıt ol ve ilk ürün eklendiğinde bildirim al."
                : "Products will appear here as they're added to the store. Sign up to get notified when the first one drops."}
            </p>
            <Link href="/signup"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))" }}>
              {isTr ? "Bildiri için kayıt ol" : "Notify me"}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-10">
              {products.map((p) => {
                const Icon = typeIcon[p.type] ?? BookOpen;
                return (
                  <Link key={p.id} href={`/p/${p.id}`}
                    className="group overflow-hidden rounded-[20px] border border-border bg-card shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all">
                    <div
                      className="aspect-[16/9] overflow-hidden grid place-items-center"
                      style={!p.category_image_url ? { backgroundImage: `linear-gradient(145deg, oklch(95% 0.05 ${p.hue}) 0%, oklch(86% 0.13 ${p.hue}) 100%)` } : undefined}>
                      {p.category_image_url
                        ? <img src={p.category_image_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <span className="text-[52px]">{p.emoji}</span>
                      }
                    </div>
                    <div className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground mb-1">
                        <Icon className="h-3 w-3" /><span>{p.type}</span>
                      </span>
                      <p className="font-bold text-sm text-foreground">{p.title}</p>
                      {(lang === "tr" ? p.description : p.description_en) && (
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[38px]">
                          {lang === "tr" ? p.description : p.description_en}
                        </p>
                      )}
                      <div className="mt-3.5 flex items-center justify-between border-t border-border pt-3">
                        <span className="text-xs text-muted-foreground">{isTr ? "Starter ile ücretsiz" : "Free on Starter"}</span>
                        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ background: "oklch(66% 0.18 32 / .1)", color: "oklch(58% 0.2 28)" }}>
                          <ArrowRight className="h-2.5 w-2.5" />
                          {isTr ? "Görüntüle" : "View"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-9">
              <a href="#pricing"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                {isTr ? "Tüm planları gör" : "See all plans"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────────────────────── */
function Pricing() {
  const { t, lang } = useLang();
  const isTr = lang === "tr";
  const planLinks: Record<string, string> = {
    Starter: "/signup", Creator: "/signup?plan=creator", Studio: "/signup?plan=studio",
  };
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="label-mono text-muted-foreground mb-3">{isTr ? "Fiyatlandırma" : "Pricing"}</p>
          <h2 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
            {isTr ? "Senin için doğru plan" : "The right plan for you"}
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {appConfig.marketing.pricing.map((tier) => (
            <div key={tier.name}
              className="relative flex flex-col rounded-[22px] border bg-card p-7"
              style={{
                borderColor: tier.featured ? "oklch(66% 0.18 32)" : "var(--color-border)",
                borderWidth: tier.featured ? "1.5px" : "1px",
                boxShadow: tier.featured ? "var(--shadow-pop)" : "var(--shadow-soft)",
                transform: tier.featured ? "translateY(-6px)" : undefined,
              }}>
              {tier.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[11.5px] font-bold text-white whitespace-nowrap"
                  style={{ background: "oklch(66% 0.18 32)" }}>
                  {isTr ? "En Popüler" : "Most Popular"}
                </span>
              )}
              <p className="font-bold text-lg">{tier.name}</p>
              <div className="flex items-baseline gap-1 mt-2.5">
                <span className="font-display text-[40px] font-bold tracking-tight">{tier.price}</span>
                {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground min-h-[38px]">{t(tier.tagline)}</p>
              <div className="h-px bg-border my-5" />
              <ul className="space-y-3 flex-1">
                {tier.features.map((f) => (
                  <li key={t(f)} className="flex items-start gap-2.5 text-[13.5px] text-foreground">
                    <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full mt-px"
                      style={{ background: "oklch(66% 0.18 32 / .15)" }}>
                      <Check className="h-2.5 w-2.5" style={{ color: "oklch(66% 0.18 32)" }} />
                    </span>
                    {t(f)}
                  </li>
                ))}
              </ul>
              <Link href={planLinks[tier.name] ?? "/signup"}
                className="mt-5 flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={tier.featured
                  ? { background: "oklch(66% 0.18 32)", boxShadow: "0 6px 18px oklch(66% 0.18 32 / .28)" }
                  : { background: "var(--color-sidebar)" }}>
                {t(tier.cta)}
                <ArrowRight className="h-3.5 w-3.5" />
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
    <section className="py-20 lg:py-28 border-t border-border" style={{ background: "oklch(96.6% 0.012 50 / .4)" }}>
      <div className="mx-auto max-w-[740px] px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(26px,3.6vw,40px)" }}>
            {lang === "tr" ? "Sık Sorulan Sorular" : "Frequently Asked Questions"}
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {appConfig.marketing.faq.map((item, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-3.5 text-left px-5 py-[18px] text-[15px] font-semibold text-foreground hover:bg-muted/50 transition-colors bg-transparent border-none cursor-pointer"
                style={{ fontFamily: "inherit" }}>
                {t(item.q)}
                <span style={{ display: "inline-flex", transition: "transform .2s ease", transform: open === i ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
                  <ChevronDown className="h-[18px] w-[18px] text-muted-foreground" />
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-[18px] pt-4 text-sm text-muted-foreground leading-[1.68] border-t border-border">
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

/* ── CTA Band ────────────────────────────────────────────────────────────── */
function CTABand() {
  const { lang } = useLang();
  const isTr = lang === "tr";

  return (
    <section className="px-5 pt-6 pb-20">
      <div className="relative overflow-hidden max-w-5xl mx-auto rounded-[28px] px-10 py-[72px] text-center"
        style={{ background: "oklch(21% 0.055 222)", isolation: "isolate" }}>

        {/* Animated orbs */}
        <div className="cta-orb-1 pointer-events-none absolute -top-16 -right-10 h-[340px] w-[340px] rounded-full"
          style={{ background: "oklch(66% 0.18 32 / .28)", filter: "blur(80px)" }} />
        <div className="cta-orb-2 pointer-events-none absolute -bottom-20 -left-16 h-[280px] w-[280px] rounded-full"
          style={{ background: "oklch(52% 0.16 350 / .22)", filter: "blur(70px)" }} />
        <div className="cta-orb-3 pointer-events-none absolute top-[40%] left-[40%] h-[180px] w-[180px] rounded-full"
          style={{ background: "oklch(80% 0.15 75 / .14)", filter: "blur(50px)" }} />

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 40%, transparent 100%)",
          }} />

        {/* Floating product-type chips */}
        <div className="cta-float-1 hidden lg:flex absolute top-8 left-9 items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ background: "rgba(255,255,255,.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.14)" }}>
          <span className="text-[18px]">📘</span>
          <div><p className="m-0 text-[11px] font-bold text-white leading-tight">{isTr ? "E-kitap" : "Ebook"}</p><p className="m-0 text-[10px] leading-tight" style={{ color: "rgba(255,255,255,.5)" }}>Ebook</p></div>
        </div>
        <div className="cta-float-2 hidden lg:flex absolute top-7 right-10 items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ background: "rgba(255,255,255,.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.14)" }}>
          <span className="text-[18px]">🗂️</span>
          <div><p className="m-0 text-[11px] font-bold text-white leading-tight">{isTr ? "Şablon" : "Template"}</p><p className="m-0 text-[10px] leading-tight" style={{ color: "rgba(255,255,255,.5)" }}>Template</p></div>
        </div>
        <div className="cta-float-3 hidden lg:flex absolute bottom-9 left-12 items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ background: "rgba(255,255,255,.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.14)" }}>
          <span className="text-[18px]">🎞️</span>
          <div><p className="m-0 text-[11px] font-bold text-white leading-tight">Preset</p><p className="m-0 text-[10px] leading-tight" style={{ color: "rgba(255,255,255,.5)" }}>Preset</p></div>
        </div>
        <div className="cta-float-4 hidden lg:flex absolute bottom-8 right-10 items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ background: "rgba(255,255,255,.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.14)" }}>
          <span className="text-[18px]">🎓</span>
          <div><p className="m-0 text-[11px] font-bold text-white leading-tight">{isTr ? "Kurs" : "Course"}</p><p className="m-0 text-[10px] leading-tight" style={{ color: "rgba(255,255,255,.5)" }}>Course</p></div>
        </div>

        {/* Content */}
        <div className="relative">
          <div className="animate-float-up inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[.06em] mb-5"
            style={{ border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)" }}>
            <span className="h-1.5 w-1.5 rounded-full pulse-dot" style={{ background: "oklch(66% 0.18 32)" }} />
            {isTr ? "Hemen başla" : "Get started now"}
          </div>

          <h2 className="font-display font-semibold text-white leading-[1.08] tracking-tight" style={{ fontSize: "clamp(30px,4.5vw,52px)" }}>
            {isTr ? "Bugün başla, " : "Start today, "}
            <span className="italic"
              style={{ background: "linear-gradient(90deg, oklch(80% 0.18 32), oklch(72% 0.2 350))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {isTr ? "ücretsiz." : "for free."}
            </span>
          </h2>

          <p className="mt-4 max-w-lg mx-auto leading-[1.65]" style={{ color: "oklch(62% 0.03 215)", fontSize: "16.5px" }}>
            {isTr
              ? "Starter planıyla kayıt ol, ilk ürününü hemen al."
              : "Sign up on Starter and claim your first product right away."}
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link href="/signup"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white border-none transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))", boxShadow: "0 8px 28px oklch(66% 0.18 32 / .45)" }}>
              {isTr ? "Ücretsiz kayıt ol" : "Sign up free"}
            </Link>
            <a href="#products"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/20"
              style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(6px)" }}>
              {isTr ? "Ürünleri gör" : "Browse products"}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-5 flex-wrap mt-7">
            {[
              isTr ? "Güvenli ödeme" : "Secure checkout",
              isTr ? "Anında teslimat" : "Instant delivery",
              isTr ? "30 gün iade" : "30-day refund",
            ].map((item, i) => (
              <span key={item} className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,.55)" }}>
                {i > 0 && <span className="inline-block w-px h-3.5 mx-1" style={{ background: "rgba(255,255,255,.15)" }} />}
                <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "oklch(66% 0.14 152)" }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function Footer() {
  const { lang } = useLang();
  return (
    <footer style={{ background: "var(--color-sidebar)", padding: "44px 20px 28px" }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-5 items-center justify-between pb-6 border-b"
          style={{ borderColor: "var(--color-sidebar-border)" }}>
          <Link href="/"><Logo onDark /></Link>
          <nav className="flex flex-wrap items-center gap-5">
            {[
              { href: "#products", tr: "Ürünler",        en: "Products"    },
              { href: "#features", tr: "Nasıl Çalışır?",  en: "How it works" },
              { href: "#pricing",  tr: "Fiyatlar",        en: "Pricing"     },
            ].map(l => (
              <a key={l.href} href={l.href} className="text-sm transition-colors hover:text-white"
                style={{ color: "var(--color-sidebar-muted)" }}>
                {lang === "tr" ? l.tr : l.en}
              </a>
            ))}
            <Link href="/login" className="text-sm transition-colors hover:text-white"
              style={{ color: "var(--color-sidebar-muted)" }}>
              {lang === "tr" ? "Giriş yap" : "Sign in"}
            </Link>
            <Link href="/signup" className="text-sm transition-colors hover:text-white"
              style={{ color: "var(--color-sidebar-muted)" }}>
              {lang === "tr" ? "Kayıt ol" : "Sign up"}
            </Link>
          </nav>
        </div>
        <p className="mt-5 text-center text-xs" style={{ color: "var(--color-sidebar-muted)" }}>
          © 2026 {appConfig.name} · {appConfig.domain} · {lang === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}
        </p>
      </div>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function MarketingPage() {
  const { lang } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(STATIC_HERO_SLIDES);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("products").select("id,title,type,price,emoji,hue,category_image_url,description,description_en").eq("live", true).limit(6)
      .then(({ data }) => {
        const list = (data ?? []) as Product[];
        setProducts(list);
        setHeroSlides(buildHeroSlides(list));
      });
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      setIsAdmin(!!user && ADMIN_EMAILS.includes(user.email ?? ""));
    });

    let sid = sessionStorage.getItem("_dsid");
    if (!sid) { sid = Math.random().toString(36).slice(2); sessionStorage.setItem("_dsid", sid); }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/", referrer: document.referrer, session_id: sid }),
    }).catch(() => null);
  }, []);

  return (
    <div className="min-h-dvh">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      <Hero slides={heroSlides} />
      <Stats />
      <Features />
      <Products products={products} lang={lang} />
      <Pricing />
      <FAQ />
      <CTABand />
      <Footer />
    </div>
  );
}
