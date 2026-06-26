"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ShoppingCart, Shield, Zap, RotateCcw, Check, Star,
  BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap, Loader2,
  Download, FileText, Video, Key, Menu, X, LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";
import appConfig from "@/app.config";
import { formatMoney } from "@/lib/utils";

type ProductType = "ebook" | "template" | "preset" | "course";

interface Product {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  hue: string;
  emoji: string;
  live: boolean;
  category: string | null;
  category_image_url: string | null;
  gallery_images: string[] | null;
}

const typeIcon: Record<ProductType, typeof BookOpen> = {
  ebook: BookOpen, template: LayoutTemplate, preset: SlidersHorizontal, course: GraduationCap,
};

const typeIncludes: Record<ProductType, { tr: string[]; en: string[] }> = {
  ebook: {
    tr: ["PDF dosyası (tam metin)", "EPUB formatı (e-okuyucu uyumlu)", "Yüksek çözünürlüklü görseller", "Yaşam boyu erişim"],
    en: ["PDF file (full text)", "EPUB format (e-reader ready)", "High-resolution images", "Lifetime access"],
  },
  template: {
    tr: ["Hazır şablon dosyası", "Kurulum rehberi PDF", "Demo içerik dahil", "Yaşam boyu erişim & güncellemeler"],
    en: ["Ready-to-use template file", "Setup guide PDF", "Demo content included", "Lifetime access & updates"],
  },
  preset: {
    tr: ["Tüm LUT / preset dosyaları", "DNG kurulum dosyası", "Uygulama kılavuzu PDF", "Yaşam boyu ücretsiz güncellemeler"],
    en: ["All LUT / preset files", "DNG installation file", "Application guide PDF", "Lifetime free updates"],
  },
  course: {
    tr: ["Tüm video dersler (MP4)", "Ders notları PDF", "Alıştırma dosyaları", "Soru-cevap desteği"],
    en: ["All video lessons (MP4)", "Lesson notes PDF", "Exercise files", "Q&A support access"],
  },
};

const typeInclIcon = [Download, FileText, Video, Key];

function GallerySection({ product }: { product: Product }) {
  const TypeIcon = typeIcon[product.type] ?? BookOpen;
  const allImages: { src: string | null; isEmoji: boolean }[] = [
    { src: product.category_image_url, isEmoji: !product.category_image_url },
    ...(product.gallery_images ?? []).slice(0, 4).map((src) => ({ src, isEmoji: false })),
  ];
  const [active, setActive] = useState(0);
  const current = allImages[active];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="aspect-video w-full overflow-hidden rounded-2xl shadow-pop"
        style={current.isEmoji ? { backgroundImage: `linear-gradient(140deg, oklch(94% 0.07 ${product.hue}) 0%, oklch(82% 0.18 ${product.hue}) 100%)` } : undefined}
      >
        {current.isEmoji
          ? <span className="flex h-full w-full items-center justify-center text-8xl drop-shadow-lg">{product.emoji}</span>
          : <img src={current.src!} alt={product.title} className="h-full w-full object-cover" />
        }
      </div>

      {/* Thumbnails (only if more than 1 image) */}
      {allImages.length > 1 && (
        <div className="flex gap-2">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-video w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${active === i ? "border-primary" : "border-border opacity-60 hover:opacity-100"}`}
              style={img.isEmoji ? { backgroundImage: `linear-gradient(140deg, oklch(94% 0.07 ${product.hue}) 0%, oklch(82% 0.18 ${product.hue}) 100%)` } : undefined}
            >
              {img.isEmoji
                ? <span className="flex h-full w-full items-center justify-center text-base">{product.emoji}</span>
                : <img src={img.src!} alt={`${i + 1}`} className="h-full w-full object-cover" />
              }
              <span className="absolute bottom-0 left-0 right-0 bg-black/40 text-center text-[9px] text-white">{i + 1}</span>
            </button>
          ))}
        </div>
      )}

      {/* Type + category badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
          <TypeIcon className="h-3.5 w-3.5 text-primary" />
          {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
        </span>
        {product.category && (
          <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            {product.category}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLang();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();

    // Check logged-in user plan
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setIsLoggedIn(true);
      supabase.from("profiles").select("plan").eq("id", user.id).single()
        .then(({ data }) => setUserPlan(data?.plan ?? "starter"));
    });

    supabase
      .from("products")
      .select("id, title, type, price, hue, emoji, live, category, category_image_url, gallery_images")
      .eq("id", id)
      .eq("live", true)
      .single()
      .then(({ data }) => {
        if (!data) { setNotFound(true); setLoading(false); return; }
        setProduct(data as Product);
        setLoading(false);
        supabase
          .from("products")
          .select("id, title, type, price, hue, emoji, live, category, category_image_url, gallery_images")
          .eq("live", true)
          .neq("id", id)
          .limit(3)
          .then(({ data: rel }) => setRelated((rel ?? []) as Product[]));
      });
  }, [id]);

  async function buy() {
    if (!product) return;

    // Not logged in → redirect to signup
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = `/signup?redirect=/p/${product.id}`;
      return;
    }

    setBuying(true);

    // Starter plan → free claim
    if (!userPlan || userPlan === "starter") {
      try {
        const res = await fetch("/api/claim-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        const data = await res.json();
        if (data.error === "quota_exceeded") {
          window.location.href = "/settings#billing";
          return;
        }
        if (data.error === "already_claimed") {
          alert(lang === "tr" ? "Bu ürünü zaten aldın." : "You already claimed this product.");
          setBuying(false);
          return;
        }
        if (!res.ok) {
          alert(lang === "tr" ? "Bir hata oluştu." : "An error occurred.");
          setBuying(false);
          return;
        }
        setClaimSuccess(true);
        setBuying(false);
      } catch {
        setBuying(false);
      }
      return;
    }

    // Creator (5 limit) or Studio (unlimited) → Stripe checkout
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const { url, error } = await res.json();
      if (error === "quota_exceeded") {
        window.location.href = "/settings#billing";
        return;
      }
      if (error || !url) { alert(lang === "tr" ? "Bir hata oluştu." : "An error occurred."); setBuying(false); return; }
      window.location.href = url;
    } catch {
      setBuying(false);
    }
  }

  const m = {
    tr: {
      back: "Mağazaya dön",
      buyNow: userPlan === "starter" || !userPlan ? "Ücretsiz Al (Starter)" : "Satın al",
      buying: "İşleniyor…",
      includes: "Neler dahil?", trust1: "Güvenli ödeme", trust2: "Anında teslimat", trust3: "30 gün iade",
      relatedTitle: "Öne çıkan ürünler", buy: "Satın al",
      notFound: "Ürün bulunamadı", notFoundSub: "Bu ürün mevcut değil veya yayından kaldırılmış olabilir.",
      loading: "Yükleniyor…",
      reviewsLabel: "değerlendirme",
      claimed: "Ürün e-postana gönderildi! 🎉",
    },
    en: {
      back: "Back to store",
      buyNow: userPlan === "starter" || !userPlan ? "Get Free (Starter)" : "Buy now",
      buying: "Processing…",
      includes: "What's included", trust1: "Secure checkout", trust2: "Instant delivery", trust3: "30-day refund",
      relatedTitle: "More products", buy: "Buy",
      notFound: "Product not found", notFoundSub: "This product may not exist or has been unpublished.",
      loading: "Loading…",
      reviewsLabel: "reviews",
      claimed: "Product sent to your email! 🎉",
    },
  }[lang];

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">{m.loading}</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 text-center">
        <span className="text-5xl">📦</span>
        <h1 className="font-display text-2xl font-semibold">{m.notFound}</h1>
        <p className="text-sm text-muted-foreground">{m.notFoundSub}</p>
        <Link href="/" className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <ArrowLeft className="h-4 w-4" /> {m.back}
        </Link>
      </div>
    );
  }

  const TypeIcon = typeIcon[product.type] ?? BookOpen;
  const includes = typeIncludes[product.type] ?? typeIncludes.ebook;

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-background)" }}>
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo withWordmark />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              {lang === "tr" ? "Mağaza" : "Store"}
            </Link>
            <Link href="/#pricing" className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              {lang === "tr" ? "Fiyatlar" : "Pricing"}
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:flex" />
            {isLoggedIn ? (
              <Link href="/dashboard" className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-sidebar px-3 py-1.5 text-sm font-medium text-sidebar-foreground hover:opacity-90 transition-opacity">
                <LayoutDashboard className="h-4 w-4" />
                {lang === "tr" ? "Yönetim" : "Dashboard"}
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  {lang === "tr" ? "Giriş yap" : "Sign in"}
                </Link>
                <Link href="/signup" className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  {lang === "tr" ? "Kayıt ol" : "Sign up"}
                </Link>
              </div>
            )}
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
              <ShoppingCart className="h-4 w-4 text-primary" />
              {lang === "tr" ? "Mağaza" : "Store"}
            </Link>
            <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
              <Star className="h-4 w-4 text-primary" />
              {lang === "tr" ? "Fiyatlar" : "Pricing"}
            </Link>
            <div className="pt-2 border-t border-border mt-2 space-y-1">
              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-sidebar px-3 py-2.5 text-sm font-semibold text-sidebar-foreground">
                  <LayoutDashboard className="h-4 w-4" />
                  {lang === "tr" ? "Yönetim Paneli" : "Dashboard"}
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                    {lang === "tr" ? "Giriş yap" : "Sign in"}
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                    {lang === "tr" ? "Ücretsiz kayıt ol" : "Sign up free"}
                  </Link>
                </>
              )}
              <div className="flex justify-center pt-1">
                <LanguageToggle />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">

          {/* Left: gallery */}
          <GallerySection product={product} />


          {/* Right: buy card (sticky) */}
          <div className="lg:sticky lg:top-24 space-y-5">
            <div>
              <h1 className="font-display text-[clamp(24px,3.5vw,36px)] font-bold leading-[1.1] tracking-tight">
                {product.title}
              </h1>

              {/* Stars */}
              <div className="mt-3 flex items-center gap-2">
                <span className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                  ))}
                </span>
                <span className="text-sm font-medium">4.9</span>
                <span className="text-sm text-muted-foreground">· 128 {m.reviewsLabel}</span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-5xl font-bold tabular-nums text-primary">
                  {formatMoney(product.price)}
                </span>
              </div>
            </div>

            {/* Claim success */}
            {claimSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
                <Check className="h-4 w-4 shrink-0" /> {m.claimed}
              </div>
            )}

            {/* Buy button */}
            {!claimSuccess && (
              <button
                onClick={buy}
                disabled={buying}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-4 text-[15px] font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:opacity-90 disabled:opacity-70"
              >
                {buying
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> {m.buying}</>
                  : <><ShoppingCart className="h-4 w-4" /> {m.buyNow}</>
                }
              </button>
            )}

            {/* Trust badges */}
            <div className="flex items-center justify-around rounded-xl border border-border bg-card/60 py-3.5 px-2">
              <span className="flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-success" />
                {m.trust1}
              </span>
              <span className="h-8 w-px bg-border" />
              <span className="flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
                <Zap className="h-4 w-4 text-success" />
                {m.trust2}
              </span>
              <span className="h-8 w-px bg-border" />
              <span className="flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
                <RotateCcw className="h-4 w-4 text-success" />
                {m.trust3}
              </span>
            </div>

            {/* What's included */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold tracking-tight">{m.includes}</h2>
              <ul className="mt-3.5 space-y-2.5">
                {(lang === "tr" ? includes.tr : includes.en).map((item, i) => {
                  const IncIcon = typeInclIcon[i % typeInclIcon.length];
                  return (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-success/10">
                        <Check className="h-3.5 w-3.5 text-success" />
                      </span>
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <h2 className="mb-8 font-display text-2xl font-semibold tracking-tight">{m.relatedTitle}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => {
                const Icon = typeIcon[p.type] ?? BookOpen;
                return (
                  <Link key={p.id} href={`/p/${p.id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
                    <div
                      className="aspect-[16/9] overflow-hidden"
                      style={!p.category_image_url ? { backgroundImage: `linear-gradient(140deg, oklch(94% 0.06 ${p.hue}) 0%, oklch(86% 0.13 ${p.hue}) 100%)` } : undefined}
                    >
                      {p.category_image_url
                        ? <img src={p.category_image_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        : <span className="flex h-full w-full items-center justify-center text-4xl drop-shadow-sm">{p.emoji}</span>
                      }
                    </div>
                    <div className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Icon className="h-3 w-3" /> {p.type}
                      </span>
                      <p className="mt-1 truncate font-semibold">{p.title}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                        <p className="font-display text-lg font-bold text-primary">{formatMoney(p.price)}</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                          <ShoppingCart className="h-3 w-3" /> {m.buy}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center text-sm text-muted-foreground lg:px-8">
          <Link href="/"><Logo /></Link>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="hover:text-foreground transition-colors">{lang === "tr" ? "Mağaza" : "Store"}</Link>
            <span className="h-3 w-px bg-border" />
            <Link href="/login" className="hover:text-foreground transition-colors">{lang === "tr" ? "Giriş yap" : "Sign in"}</Link>
            <span className="h-3 w-px bg-border" />
            <Link href="/signup" className="hover:text-foreground transition-colors">{lang === "tr" ? "Kayıt ol" : "Sign up"}</Link>
          </div>
          <p className="text-[11px] text-muted-foreground/70">{appConfig.name} · {appConfig.domain} · © 2026</p>
        </div>
      </footer>
    </div>
  );
}
