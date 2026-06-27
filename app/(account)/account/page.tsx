"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LogOut, Download, Package, Crown, Zap, ChevronRight,
  BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap,
  User, Mail, Shield, ArrowRight, Check, ExternalLink,
  Pencil, X, Loader2, Star, CreditCard, Bell, Settings,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";

type Plan = "starter" | "creator" | "studio";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: Plan;
  stripeCustomerId: string | null;
  joinedAt: string;
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

const PLAN_COLOR: Record<Plan, string> = {
  starter: "oklch(66% 0.14 152)",
  creator: "oklch(66% 0.18 32)",
  studio: "oklch(52% 0.22 280)",
};

const PLAN_GRADIENT: Record<Plan, string> = {
  starter: "linear-gradient(135deg, oklch(66% 0.14 152), oklch(56% 0.16 140))",
  creator: "linear-gradient(135deg, oklch(72% 0.18 32), oklch(58% 0.2 28))",
  studio: "linear-gradient(135deg, oklch(60% 0.22 280), oklch(48% 0.22 300))",
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
  const searchParams = useSearchParams();
  const subscriptionSuccess = searchParams.get("subscription") === "success";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile editing
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Active section tab
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "settings">("overview");

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
        id: user.id,
        email: user.email ?? "",
        name: profileData?.full_name || user.email?.split("@")[0] || "Kullanıcı",
        plan: (profileData?.plan as Plan) ?? "starter",
        stripeCustomerId: profileData?.stripe_customer_id ?? null,
        joinedAt: user.created_at,
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

  async function handleSaveName() {
    if (!draftName.trim() || !profile) return;
    setSavingName(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ full_name: draftName.trim() }).eq("id", profile.id);
    setProfile(p => p ? { ...p, name: draftName.trim() } : p);
    setEditingName(false);
    setSavingName(false);
  }

  function startEditName() {
    setDraftName(profile?.name ?? "");
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
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

  const tabs = [
    { id: "overview", label: isTr ? "Genel Bakış" : "Overview", icon: User },
    { id: "products", label: isTr ? "Ürünlerim" : "My Products", icon: Package, badge: purchases.length || undefined },
    { id: "settings", label: isTr ? "Ayarlar" : "Settings", icon: Settings },
  ] as const;

  return (
    <div className="min-h-dvh" style={{ background: "oklch(97.5% 0.008 50)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-md">
        <div className="mx-auto flex h-[62px] max-w-5xl items-center justify-between gap-4 px-4 lg:px-6">
          <Link href="/"><Logo /></Link>
          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:flex" />
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-[9px] px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              {isTr ? "Çıkış" : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-6">

        {/* Success Banner */}
        {subscriptionSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 border"
            style={{ background: "oklch(96% 0.08 152 / .4)", borderColor: "oklch(66% 0.14 152 / .3)" }}>
            <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "oklch(46% 0.14 152)" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "oklch(36% 0.12 152)" }}>
                {isTr ? "Abonelik aktifleştirildi!" : "Subscription activated!"}
              </p>
              <p className="text-xs" style={{ color: "oklch(46% 0.1 152)" }}>
                {isTr ? "Yeni planın hesabında yansıtıldı." : "Your new plan is now active."}
              </p>
            </div>
          </div>
        )}

        {/* Profile Hero Card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm mb-6">
          {/* Gradient bar */}
          <div className="h-1.5" style={{ background: PLAN_GRADIENT[plan] }} />
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div
                className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-2xl text-2xl font-bold text-white shadow-sm"
                style={{ background: PLAN_GRADIENT[plan] }}
              >
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        ref={nameInputRef}
                        value={draftName}
                        onChange={e => setDraftName(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder={isTr ? "Ad Soyad" : "Full name"}
                      />
                      <button onClick={handleSaveName} disabled={savingName}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: PLAN_COLOR[plan] }}>
                        {savingName ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        {isTr ? "Kaydet" : "Save"}
                      </button>
                      <button onClick={() => setEditingName(false)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="font-display text-xl font-semibold tracking-tight truncate">{profile.name}</h1>
                      <button onClick={startEditName}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title={isTr ? "İsim düzenle" : "Edit name"}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                    style={{ background: PLAN_COLOR[plan] }}
                  >
                    {plan === "studio" && <Crown className="h-3 w-3" />}
                    {plan === "creator" && <Zap className="h-3 w-3" />}
                    {plan === "starter" && <Star className="h-3 w-3" />}
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}
                  </span>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {profile.email}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isTr ? "Üye olma tarihi:" : "Member since:"}{" "}
                  {formatDate(profile.joinedAt, lang)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {plan !== "studio" && (
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: PLAN_GRADIENT.creator, boxShadow: "0 4px 14px oklch(66% 0.18 32 / .3)" }}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    {isTr ? "Planı Yükselt" : "Upgrade Plan"}
                  </Link>
                )}
                {profile.stripeCustomerId && (
                  <button
                    onClick={handleManageBilling}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    {isTr ? "Abonelik Yönetimi" : "Manage Subscription"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: isTr ? "Aktif Plan" : "Active Plan",
              value: plan.charAt(0).toUpperCase() + plan.slice(1),
              color: PLAN_COLOR[plan],
            },
            {
              label: isTr ? "Alınan Ürün" : "Products Owned",
              value: `${used}`,
              color: "oklch(52% 0.18 220)",
            },
            {
              label: isTr ? "Kalan Kota" : "Remaining Quota",
              value: quota === null ? (isTr ? "Sınırsız" : "Unlimited") : `${Math.max(0, quota - used)}`,
              color: quotaPct >= 100 ? "oklch(55% 0.18 27)" : "oklch(52% 0.16 170)",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              <p className="mt-1 font-display text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1 mb-6 shadow-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="relative flex-1 min-w-fit flex items-center justify-center gap-1.5 rounded-[9px] px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap"
                style={activeTab === tab.id
                  ? { background: "var(--color-primary)", color: "#fff" }
                  : { color: "var(--color-muted-foreground)" }}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {"badge" in tab && tab.badge ? (
                  <span className="ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                    style={activeTab === tab.id
                      ? { background: "rgba(255,255,255,.2)", color: "#fff" }
                      : { background: "oklch(66% 0.18 32 / .15)", color: "oklch(52% 0.18 32)" }}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Quick plan status */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display text-base font-semibold">{isTr ? "Plan Durumu" : "Plan Status"}</h2>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} {isTr ? "Planı" : "Plan"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {quota === null
                    ? (isTr ? "Sınırsız" : "Unlimited")
                    : `${used} / ${quota} ${isTr ? "kullanıldı" : "used"}`}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: quota === null ? "100%" : `${quotaPct}%`,
                    background: quotaPct >= 100
                      ? "oklch(55% 0.18 27)"
                      : PLAN_GRADIENT[plan],
                  }}
                />
              </div>
              {quota !== null && quotaPct >= 100 && plan !== "studio" && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {isTr ? "Kotanı doldurdun! Daha fazla ürün için yükselt." : "Quota full! Upgrade for more products."}
                  </p>
                  <Link href="/#pricing"
                    className="text-xs font-semibold underline underline-offset-2"
                    style={{ color: PLAN_COLOR.creator }}>
                    {isTr ? "Yükselt" : "Upgrade"}
                  </Link>
                </div>
              )}
            </div>

            {/* Recent purchases */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-display text-base font-semibold">{isTr ? "Son Ürünler" : "Recent Products"}</h2>
                </div>
                {purchases.length > 3 && (
                  <button onClick={() => setActiveTab("products")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    {isTr ? "Tümünü gör" : "See all"} <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {purchases.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-[16px] mb-3"
                    style={{ background: "oklch(66% 0.18 32 / .1)" }}>
                    <Package className="h-5 w-5" style={{ color: "oklch(66% 0.18 32)" }} />
                  </div>
                  <p className="font-medium text-sm mb-1">{isTr ? "Henüz ürün almadın." : "No products yet."}</p>
                  <Link href="/#products"
                    className="mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: PLAN_GRADIENT.creator }}>
                    {isTr ? "Ürünleri keşfet" : "Browse products"} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {purchases.slice(0, 3).map((p) => (
                    <ProductRow key={p.orderId} p={p} lang={lang} isTr={isTr} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ── Products Tab ── */}
        {activeTab === "products" && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display text-base font-semibold">{isTr ? "Tüm Ürünlerim" : "All My Products"}</h2>
                <span className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{ background: "oklch(66% 0.18 32 / .12)", color: "oklch(52% 0.18 32)" }}>
                  {purchases.length}
                </span>
              </div>
              <Link href="/#products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {isTr ? "Ürün keşfet" : "Browse products"} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {purchases.length === 0 ? (
              <div className="flex flex-col items-center py-14 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-[18px] mb-4"
                  style={{ background: "oklch(66% 0.18 32 / .1)" }}>
                  <Package className="h-6 w-6" style={{ color: "oklch(66% 0.18 32)" }} />
                </div>
                <p className="font-semibold text-sm mb-1">{isTr ? "Henüz ürün almadın." : "You haven't purchased any products yet."}</p>
                <p className="text-xs text-muted-foreground mb-5">
                  {isTr ? "Starter planıyla 1 ürün ücretsiz alabilirsin." : "Get 1 product free on the Starter plan."}
                </p>
                <Link href="/#products"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: PLAN_GRADIENT.creator }}>
                  {isTr ? "Ürünleri keşfet" : "Browse products"} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {purchases.map((p) => (
                  <ProductRow key={p.orderId} p={p} lang={lang} isTr={isTr} />
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === "settings" && (
          <div className="space-y-5">
            {/* Profile settings */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <User className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display text-base font-semibold">{isTr ? "Profil Bilgileri" : "Profile"}</h2>
              </div>
              <div className="space-y-3">
                {/* Name field */}
                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{isTr ? "Ad Soyad" : "Full name"}</span>
                    {!editingName && (
                      <button onClick={startEditName}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="h-3 w-3" /> {isTr ? "Düzenle" : "Edit"}
                      </button>
                    )}
                  </div>
                  {editingName ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        ref={nameInputRef}
                        value={draftName}
                        onChange={e => setDraftName(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <button onClick={handleSaveName} disabled={savingName}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                        style={{ background: PLAN_COLOR[plan] }}>
                        {savingName ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        {isTr ? "Kaydet" : "Save"}
                      </button>
                      <button onClick={() => setEditingName(false)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm font-medium">{profile.name}</p>
                  )}
                </div>

                {/* Email field */}
                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-xs text-muted-foreground">{isTr ? "E-posta" : "Email"}</span>
                  <p className="mt-1 text-sm font-medium">{profile.email}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{isTr ? "E-posta değiştirmek için destek ekibiyle iletişime geçin." : "Contact support to change your email."}</p>
                </div>

                {/* Plan field */}
                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{isTr ? "Plan" : "Plan"}</span>
                    {plan !== "studio" && (
                      <Link href="/#pricing"
                        className="text-xs font-medium underline underline-offset-2"
                        style={{ color: PLAN_COLOR.creator }}>
                        {isTr ? "Yükselt" : "Upgrade"}
                      </Link>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                      style={{ background: PLAN_COLOR[plan] }}
                    >
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {quota === null
                        ? (isTr ? "Sınırsız ürün" : "Unlimited products")
                        : `${quota} ${isTr ? "ürün kotası" : "product quota"}`}
                    </span>
                  </div>
                </div>

                {/* Member since */}
                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-xs text-muted-foreground">{isTr ? "Üyelik tarihi" : "Member since"}</span>
                  <p className="mt-1 text-sm font-medium">{formatDate(profile.joinedAt, lang)}</p>
                </div>
              </div>
            </div>

            {/* Notifications placeholder */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display text-base font-semibold">{isTr ? "Bildirimler" : "Notifications"}</h2>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{isTr ? "Yeni ürün bildirimleri" : "New product alerts"}</p>
                  <p className="text-xs text-muted-foreground">{isTr ? "Yeni ürün eklendiğinde e-posta al" : "Get emailed when new products drop"}</p>
                </div>
                <div className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{ background: "oklch(66% 0.14 152 / .15)", color: "oklch(46% 0.12 152)" }}>
                  {isTr ? "Aktif" : "Active"}
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-base font-semibold mb-4 text-destructive">
                {isTr ? "Hesap İşlemleri" : "Account Actions"}
              </h2>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {isTr ? "Oturumu Kapat" : "Sign Out"}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

/* ── Product Row Component ── */
function ProductRow({ p, lang, isTr }: { p: PurchasedProduct; lang: string; isTr: boolean }) {
  const Icon = typeIcon[p.productType] ?? BookOpen;
  const hasBoth = p.fileUrl && p.fileUrlEn;

  return (
    <li className="py-4 first:pt-0 last:pb-0">
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
              {p.delivered ? (isTr ? "Teslim edildi" : "Delivered") : (isTr ? "Bekliyor" : "Pending")}
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
            {p.amount > 0 && <span className="font-medium">${p.amount}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {p.productId && (
            <Link
              href={`/p/${p.productId}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              {isTr ? "Ürün sayfası" : "View"}
            </Link>
          )}
          {hasBoth ? (
            <>
              {p.fileUrlEn && (
                <a href={p.fileUrlEn} target="_blank" rel="noopener noreferrer" download
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "oklch(66% 0.18 32)" }}>
                  <Download className="h-3 w-3" /> EN
                </a>
              )}
              {p.fileUrl && (
                <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" download
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "oklch(52% 0.16 220)" }}>
                  <Download className="h-3 w-3" /> TR
                </a>
              )}
            </>
          ) : (p.fileUrl || p.fileUrlEn) ? (
            <a href={p.fileUrl ?? p.fileUrlEn ?? "#"} target="_blank" rel="noopener noreferrer" download
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "oklch(66% 0.18 32)" }}>
              <Download className="h-3 w-3" />
              {isTr ? "İndir" : "Download"}
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
