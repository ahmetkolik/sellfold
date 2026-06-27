"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut, Download, Package, Crown, Zap, ChevronRight,
  BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap,
  User, Mail, Shield, ArrowRight, Check, ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";

type Plan = "starter" | "creator" | "studio";

interface UserProfile {
  email: string;
  name: string;
  plan: Plan;
  stripeCustomerId: string | null;
}

interface PurchasedProduct {
  orderId: string;
  productId: string;
  productTitle: string;
  productType: string;
  productEmoji: string;
  productHue: string;
  fileUrl: string | null;
  fileUrlEn: string | null;
  amount: number;
  createdAt: string;
  delivered: boolean;
}

const typeIcon: Record<string, React.ElementType> = {
  ebook: BookOpen,
  template: LayoutTemplate,
  preset: SlidersHorizontal,
  course: GraduationCap,
};

const PLAN_QUOTA: Record<Plan, number | null> = {
  starter: 1,
  creator: 5,
  studio: null,
};

const PLAN_LABEL: Record<Plan, { tr: string; en: string }> = {
  starter: { tr: "Starter", en: "Starter" },
  creator: { tr: "Creator", en: "Creator" },
  studio: { tr: "Studio", en: "Studio" },
};

const PLAN_COLOR: Record<Plan, string> = {
  starter: "oklch(66% 0.14 152)",
  creator: "oklch(66% 0.18 32)",
  studio: "oklch(52% 0.22 280)",
};

function formatDate(iso: string, lang: string) {
  return new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function AccountPage() {
  const { lang } = useLang();
  const isTr = lang === "tr";
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login?next=/account"); return; }

      const [{ data: profileData }, { data: ordersData }] = await Promise.all([
        supabase.from("profiles").select("full_name, plan, stripe_customer_id").eq("id", user.id).single(),
        supabase.from("orders").select(`
          id, amount, created_at, delivered,
          products(id, title, type, emoji, hue, file_url, file_url_en)
        `).eq("buyer_email", user.email ?? "").order("created_at", { ascending: false }),
      ]);

      setProfile({
        email: user.email ?? "",
        name: profileData?.full_name || user.email?.split("@")[0] || "Kullanıcı",
        plan: (profileData?.plan as Plan) ?? "starter",
        stripeCustomerId: profileData?.stripe_customer_id ?? null,
      });

      setPurchases(
        (ordersData ?? []).map((o: any) => ({
          orderId: o.id,
          productId: o.products?.id ?? "",
          productTitle: o.products?.title ?? "—",
          productType: o.products?.type ?? "ebook",
          productEmoji: o.products?.emoji ?? "📦",
          productHue: o.products?.hue ?? "220",
          fileUrl: o.products?.file_url ?? null,
          fileUrlEn: o.products?.file_url_en ?? null,
          amount: Number(o.amount ?? 0),
          createdAt: o.created_at,
          delivered: o.delivered ?? true,
        }))
      );

      setLoading(false);
    }

    load();
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleManageBilling() {
    const res = await fetch("/api/billing-portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const plan = profile.plan;
  const quota = PLAN_QUOTA[plan];
  const used = purchases.length;
  const quotaPct = quota ? Math.min((used / quota) * 100, 100) : 100;
  const initials = profile.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const m = {
    myAccount: isTr ? "Hesabım" : "My Account",
    signOut: isTr ? "Çıkış" : "Sign out",
    plan: isTr ? "Plan" : "Plan",
    upgrade: isTr ? "Yükselt" : "Upgrade",
    products: isTr ? "Ürünlerim" : "My Products",
    billing: isTr ? "Abonelik Yönetimi" : "Manage Subscription",
    noProducts: isTr ? "Henüz ürün almadın." : "You haven't purchased any products yet.",
    browseProducts: isTr ? "Ürünleri keşfet" : "Browse products",
    download: isTr ? "İndir" : "Download",
    downloadTr: isTr ? "Türkçe İndir" : "Download (TR)",
    downloadEn: isTr ? "İngilizce İndir" : "Download (EN)",
    free: isTr ? "Ücretsiz" : "Free",
    used: isTr ? "kullanıldı" : "used",
    of: isTr ? "/" : "/",
    quota: isTr ? "kota" : "quota",
    unlimited: isTr ? "Sınırsız" : "Unlimited",
    profileInfo: isTr ? "Profil Bilgileri" : "Profile",
    memberSince: isTr ? "Üyelik" : "Member since",
    viewProduct: isTr ? "Ürün sayfası" : "View product",
    delivered: isTr ? "Teslim edildi" : "Delivered",
    pending: isTr ? "Bekliyor" : "Pending",
    planInfo: isTr ? "Paket Detayları" : "Plan Details",
    upgradeDesc: isTr
      ? "Daha fazla ürüne erişmek için planını yükselt."
      : "Upgrade your plan to access more products.",
    studioDesc: isTr ? "Sınırsız ürün kotası aktif." : "Unlimited product quota active.",
  };

  return (
    <div className="min-h-dvh" style={{ background: "oklch(97.5% 0.008 50)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-md">
        <div className="mx-auto flex h-[62px] max-w-4xl items-center justify-between gap-4 px-4 lg:px-6">
          <Link href="/"><Logo /></Link>
          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:flex" />
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-[9px] px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              {m.signOut}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 lg:px-6 space-y-6">

        {/* Profile Hero */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${PLAN_COLOR[plan]}, oklch(58% 0.2 28))` }}
            >
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-semibold tracking-tight truncate">{profile.name}</h1>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                  style={{ background: PLAN_COLOR[plan] }}
                >
                  {plan === "studio" && <Crown className="h-3 w-3" />}
                  {plan === "creator" && <Zap className="h-3 w-3" />}
                  {PLAN_LABEL[plan][lang]}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {profile.email}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {plan !== "studio" && (
                <Link
                  href="/#pricing"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))", boxShadow: "0 4px 14px oklch(66% 0.18 32 / .3)" }}
                >
                  <Zap className="h-3.5 w-3.5" />
                  {m.upgrade}
                </Link>
              )}
              {profile.stripeCustomerId && (
                <button
                  onClick={handleManageBilling}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {m.billing}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Plan Details */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-base font-semibold">{m.planInfo}</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{PLAN_LABEL[plan][lang]}</span>
                <span className="text-sm text-muted-foreground">
                  {quota === null
                    ? m.unlimited
                    : `${used} ${m.of} ${quota} ${m.used}`}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: quota === null ? "100%" : `${quotaPct}%`,
                    background: quotaPct >= 100
                      ? "oklch(55% 0.18 27)"
                      : `linear-gradient(90deg, ${PLAN_COLOR[plan]}, oklch(72% 0.18 32))`,
                  }}
                />
              </div>
              {quota !== null && quotaPct >= 100 && (
                <p className="mt-2 text-xs text-muted-foreground">{m.upgradeDesc}</p>
              )}
              {quota === null && (
                <p className="mt-2 text-xs text-muted-foreground">{m.studioDesc}</p>
              )}
            </div>

            {plan === "starter" && (
              <Link
                href="/#pricing"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Creator'a geç <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {/* Plan features summary */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: isTr ? "Ürün kotası" : "Product quota",
                value: quota === null ? (isTr ? "Sınırsız" : "Unlimited") : `${quota} ${isTr ? "ürün" : "products"}`,
              },
              {
                label: isTr ? "Kullanılan" : "Used",
                value: `${used} ${isTr ? "ürün" : "products"}`,
              },
              {
                label: isTr ? "Kalan" : "Remaining",
                value: quota === null
                  ? (isTr ? "Sınırsız" : "Unlimited")
                  : `${Math.max(0, quota - used)} ${isTr ? "ürün" : "products"}`,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-muted/50 px-4 py-3">
                <p className="text-[11px] text-muted-foreground">{item.label}</p>
                <p className="mt-1 font-display text-base font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Purchased Products */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-display text-base font-semibold">{m.products}</h2>
            </div>
            <Link href="/#products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {m.browseProducts} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {purchases.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div
                className="grid h-14 w-14 place-items-center rounded-[16px] mb-4"
                style={{ background: "oklch(66% 0.18 32 / .1)" }}
              >
                <Package className="h-6 w-6" style={{ color: "oklch(66% 0.18 32)" }} />
              </div>
              <p className="font-medium text-sm mb-1">{m.noProducts}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {isTr ? "Starter planıyla 1 ürün ücretsiz alabilirsin." : "Get 1 product free on the Starter plan."}
              </p>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))" }}
              >
                {m.browseProducts} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {purchases.map((p) => {
                const Icon = typeIcon[p.productType] ?? BookOpen;
                const hasBoth = p.fileUrl && p.fileUrlEn;
                return (
                  <li key={p.orderId} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      {/* Emoji cover */}
                      <div
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl"
                        style={{
                          backgroundImage: `linear-gradient(140deg, oklch(94% 0.06 ${p.productHue}) 0%, oklch(86% 0.13 ${p.productHue}) 100%)`,
                        }}
                      >
                        {p.productEmoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-sm truncate">{p.productTitle}</p>
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                            style={{ background: p.delivered ? "oklch(55% 0.14 152)" : "oklch(55% 0.16 60)" }}
                          >
                            {p.delivered ? <Check className="h-2.5 w-2.5" /> : null}
                            {p.delivered ? m.delivered : m.pending}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon className="h-3 w-3" />
                            {p.productType}
                          </span>
                          <span>{formatDate(p.createdAt, lang)}</span>
                          {p.amount === 0 && (
                            <span className="font-medium" style={{ color: "oklch(55% 0.14 152)" }}>
                              {isTr ? "Ücretsiz" : "Free"}
                            </span>
                          )}
                          {p.amount > 0 && (
                            <span className="font-medium">${p.amount}</span>
                          )}
                        </div>
                      </div>

                      {/* Download buttons */}
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {p.productId && (
                          <Link
                            href={`/p/${p.productId}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {m.viewProduct}
                          </Link>
                        )}
                        {hasBoth ? (
                          <>
                            {p.fileUrlEn && (
                              <a
                                href={p.fileUrlEn}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                                style={{ background: "oklch(66% 0.18 32)" }}
                              >
                                <Download className="h-3 w-3" />
                                EN
                              </a>
                            )}
                            {p.fileUrl && (
                              <a
                                href={p.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                                style={{ background: "oklch(52% 0.16 220)" }}
                              >
                                <Download className="h-3 w-3" />
                                TR
                              </a>
                            )}
                          </>
                        ) : (p.fileUrl || p.fileUrlEn) ? (
                          <a
                            href={p.fileUrl ?? p.fileUrlEn ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ background: "oklch(66% 0.18 32)" }}
                          >
                            <Download className="h-3 w-3" />
                            {m.download}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Profile Info */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-base font-semibold">{m.profileInfo}</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">{isTr ? "Ad Soyad" : "Full name"}</span>
              <span className="text-sm font-medium">{profile.name}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">{isTr ? "E-posta" : "Email"}</span>
              <span className="text-sm font-medium">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">{isTr ? "Plan" : "Plan"}</span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                style={{ background: PLAN_COLOR[plan] }}
              >
                {PLAN_LABEL[plan][lang]}
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade CTA (only for starter/creator) */}
        {plan !== "studio" && (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, oklch(21% 0.055 222), oklch(18% 0.04 250))" }}
          >
            <p className="font-display text-lg font-semibold text-white mb-1">
              {isTr ? "Daha fazla ürüne erişin" : "Access more products"}
            </p>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,.6)" }}>
              {plan === "starter"
                ? (isTr ? "Creator planıyla 5 ürüne kadar erişim." : "Up to 5 products with the Creator plan.")
                : (isTr ? "Studio planıyla sınırsız ürün erişimi." : "Unlimited products with the Studio plan.")}
            </p>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))", boxShadow: "0 6px 20px oklch(66% 0.18 32 / .4)" }}
            >
              {isTr ? "Planları gör" : "View plans"} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
