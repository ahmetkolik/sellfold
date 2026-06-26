"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, Loader2, User, Lock, Plug, CreditCard, ArrowUpRight, Sparkles } from "lucide-react";
import appConfig from "@/app.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useLang } from "@/components/i18n/language-provider";
import { createClient } from "@/lib/supabase/client";

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  creator: "Creator",
  studio: "Studio",
};

export function SettingsClient({
  connected,
  plan,
  subscriptionSuccess = false,
}: {
  connected: Record<string, boolean>;
  plan: string;
  subscriptionSuccess?: boolean;
}) {
  const { t, ui, lang } = useLang();

  // Profile state
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  // Billing state
  const [billingLoading, setBillingLoading] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);

  // Password state
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email ?? "");
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setFullName(data?.full_name ?? "");
        });
    });
  }, []);

  async function saveProfile() {
    setProfileLoading(true);
    setProfileError(null);
    setProfileSaved(false);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, full_name: fullName, email }, { onConflict: "id" });

    setProfileLoading(false);
    if (error) { setProfileError(error.message); return; }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  async function changePassword() {
    setPwError(null);
    setPwSaved(false);
    if (!newPassword) { setPwError(lang === "tr" ? "Yeni şifre boş olamaz" : "New password cannot be empty"); return; }
    if (newPassword.length < 6) { setPwError(lang === "tr" ? "Şifre en az 6 karakter olmalı" : "Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setPwError(lang === "tr" ? "Şifreler eşleşmiyor" : "Passwords don't match"); return; }

    setPwLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwLoading(false);

    if (error) { setPwError(error.message); return; }
    setNewPassword("");
    setConfirmPassword("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  }

  async function subscribe(targetPlan: string) {
    setBillingLoading(targetPlan);
    setBillingError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setBillingError(data.error ?? (lang === "tr" ? "Bir hata oluştu" : "Something went wrong"));
        return;
      }
      window.location.href = data.url;
    } catch {
      setBillingError(lang === "tr" ? "Bağlantı hatası" : "Connection error");
    } finally {
      setBillingLoading(null);
    }
  }

  async function openBillingPortal() {
    setBillingLoading("portal");
    setBillingError(null);
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setBillingError(data.error ?? (lang === "tr" ? "Bir hata oluştu" : "Something went wrong"));
        return;
      }
      window.location.href = data.url;
    } catch {
      setBillingError(lang === "tr" ? "Bağlantı hatası" : "Connection error");
    } finally {
      setBillingLoading(null);
    }
  }

  const m = {
    tr: {
      profile: "Profil", profileHint: "Adın ve e-posta adresin.",
      fullName: "Ad Soyad", emailLabel: "E-posta",
      saveProfile: "Profili Kaydet",
      security: "Güvenlik", securityHint: "Hesap şifreni buradan değiştirebilirsin.",
      newPw: "Yeni Şifre", confirmPw: "Şifreyi Onayla",
      changePw: "Şifreyi Değiştir",
      saved: "Kaydedildi ✓",
    },
    en: {
      profile: "Profile", profileHint: "Your name and email address.",
      fullName: "Full Name", emailLabel: "Email",
      saveProfile: "Save Profile",
      security: "Security", securityHint: "Change your account password here.",
      newPw: "New Password", confirmPw: "Confirm Password",
      changePw: "Change Password",
      saved: "Saved ✓",
    },
  }[lang];

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{m.profile}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">{m.profileHint}</p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{m.fullName}</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={lang === "tr" ? "Adın Soyadın" : "Jane Doe"}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{m.emailLabel}</Label>
            <Input
              value={email}
              readOnly
              className="cursor-not-allowed opacity-60"
            />
          </div>
          {profileError && (
            <p className="sm:col-span-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{profileError}</p>
          )}
          <div className="sm:col-span-2 flex justify-end">
            <Button onClick={saveProfile} disabled={profileLoading} className="gap-2 min-w-32">
              {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {profileSaved ? m.saved : m.saveProfile}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{m.security}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">{m.securityHint}</p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{m.newPw}</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{m.confirmPw}</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {pwError && (
            <p className="sm:col-span-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{pwError}</p>
          )}
          <div className="sm:col-span-2 flex justify-end">
            <Button onClick={changePassword} disabled={pwLoading} className="gap-2 min-w-40">
              {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {pwSaved ? m.saved : m.changePw}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan & Billing */}
      <Card id="billing">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{lang === "tr" ? "Plan & Faturalama" : "Plan & Billing"}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {lang === "tr" ? "Mevcut planın ve abonelik ayarların." : "Your current plan and subscription settings."}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {subscriptionSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" />
              {lang === "tr" ? "Abonelik başarıyla aktive edildi!" : "Subscription activated successfully!"}
            </div>
          )}
          {billingError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{billingError}</div>
          )}

          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium">{lang === "tr" ? "Mevcut plan" : "Current plan"}</p>
              <p className="text-sm text-muted-foreground">
                {plan === "starter"
                  ? (lang === "tr" ? "1 ücretsiz ürün indirme" : "1 free product download")
                  : plan === "creator"
                  ? (lang === "tr" ? "5 ürün kotası, işlem payı yok" : "5 product quota, no per-sale fee")
                  : (lang === "tr" ? "Sınırsız ürün + GitHub push + ekip" : "Unlimited products + GitHub push + team")}
              </p>
            </div>
            <Badge tone={plan === "starter" ? "neutral" : "success"}>
              {PLAN_LABELS[plan] ?? plan}
            </Badge>
          </div>

          {plan === "starter" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
                <div>
                  <p className="font-semibold">Creator</p>
                  <p className="text-2xl font-display font-bold mt-0.5">$12<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === "tr" ? "5 ürün kotası · Kupon · Özel domain" : "5 product quota · Coupons · Custom domain"}
                  </p>
                </div>
                <Button className="gap-2 mt-auto" onClick={() => subscribe("creator")} disabled={billingLoading !== null}>
                  {billingLoading === "creator" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
                  {lang === "tr" ? "Creator'a Geç" : "Upgrade to Creator"}
                </Button>
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4">
                <div>
                  <p className="font-semibold">Studio</p>
                  <p className="text-2xl font-display font-bold mt-0.5">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === "tr" ? "Sınırsız ürün · GitHub push · API · Ekip" : "Unlimited products · GitHub push · API · Team"}
                  </p>
                </div>
                <Button variant="outline" className="gap-2 mt-auto" onClick={() => subscribe("studio")} disabled={billingLoading !== null}>
                  {billingLoading === "studio" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
                  {lang === "tr" ? "Studio'ya Geç" : "Upgrade to Studio"}
                </Button>
              </div>
            </div>
          )}

          {plan !== "starter" && (
            <Button variant="outline" className="gap-2" onClick={openBillingPortal} disabled={billingLoading !== null}>
              {billingLoading === "portal" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              {lang === "tr" ? "Aboneliği yönet" : "Manage subscription"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{ui.integrations}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">{ui.integrationsHint}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {appConfig.integrations.map((it) => (
            <div key={it.key} className="flex items-center gap-4 rounded-lg border border-border p-4">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Icon name="plug" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{it.name}</p>
                  {it.required && <Badge tone="warning">{ui.required}</Badge>}
                </div>
                <p className="truncate text-sm text-muted-foreground">{it.purpose}</p>
              </div>
              {connected[it.key] ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                  <CheckCircle2 className="h-4 w-4" /> {ui.connected}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <CircleDashed className="h-4 w-4" /> {ui.demoMode}
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
