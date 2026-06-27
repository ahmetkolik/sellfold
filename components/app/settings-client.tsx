"use client";

import { useEffect, useState } from "react";
import { CircleDashed, Loader2, User, Lock, Plug, CheckCircle2 } from "lucide-react";
import appConfig from "@/app.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useLang } from "@/components/i18n/language-provider";
import { createClient } from "@/lib/supabase/client";

export function SettingsClient({
  connected,
}: {
  connected: Record<string, boolean>;
}) {
  const { t, ui, lang } = useLang();

  // Profile state
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

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
