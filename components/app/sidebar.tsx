"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import appConfig from "@/app.config";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { useLang } from "@/components/i18n/language-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, ui } = useLang();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserEmail(user.email ?? "");
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setUserName(data?.full_name || user.email?.split("@")[0] || "");
        });
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <aside className="hidden bg-sidebar text-sidebar-foreground md:flex md:w-64 md:flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Link href="/dashboard">
          <Logo onDark />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="label-mono px-3 pb-2 pt-1 text-sidebar-muted">
          {ui.account === "Hesap" ? "Menü" : "Menu"}
        </p>
        {appConfig.nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-active text-white shadow-sm"
                  : "text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground",
              )}
            >
              <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
              {t(item.label)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-semibold">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userName || "—"}</p>
            <p className="truncate text-xs text-sidebar-muted">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label={ui.logout}
            className="grid h-8 w-8 place-items-center rounded-md text-sidebar-muted transition-colors hover:bg-white/5 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
