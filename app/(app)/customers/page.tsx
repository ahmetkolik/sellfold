"use client";

import { useEffect, useState } from "react";
import { Download, Crown, Mail, ShoppingBag, Wallet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/i18n/language-provider";
import type { Customer } from "@/lib/demo/data";
import { fetchOrders, deriveCustomers } from "@/lib/supabase/data";
import { formatMoney, formatNumber, cn } from "@/lib/utils";

export default function CustomersPage() {
  const { lang } = useLang();
  const [vipOnly, setVipOnly] = useState(false);
  const [customers, setCustomers] = useState<Customer[] | null>(null);

  useEffect(() => {
    fetchOrders().then((orders) => setCustomers(deriveCustomers(orders)));
  }, []);

  const m = {
    tr: { title: "Müşteriler", sub: "Senden satın alan herkes, tek defterde.", export: "Dışa aktar",
      all: "Tümü", vip: "VIP", total: "Toplam müşteri", revenue: "Toplam ciro", repeat: "Tekrar eden",
      orders: "sipariş", spent: "harcama", mail: "E-posta gönder",
      empty: "Henüz müşteri yok", emptySub: "İlk satışın gerçekleşince müşterilerin burada listelenir." },
    en: { title: "Customers", sub: "Everyone who bought from you, in one ledger.", export: "Export",
      all: "All", vip: "VIP", total: "Total customers", revenue: "Total revenue", repeat: "Repeat buyers",
      orders: "orders", spent: "spent", mail: "Send email",
      empty: "No customers yet", emptySub: "Your customers will appear here after your first sale." },
  }[lang];

  const list = customers ?? [];
  const shown = vipOnly ? list.filter((c) => c.vip) : list;
  const totalRevenue = list.reduce((a, c) => a + c.spent, 0);
  const repeat = list.filter((c) => c.orders > 1).length;

  const totals = [
    { label: m.total, value: customers === null ? "—" : formatNumber(list.length) },
    { label: m.revenue, value: customers === null ? "—" : formatMoney(totalRevenue) },
    { label: m.repeat, value: customers === null ? "—" : `${repeat} / ${list.length}` },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{m.title}</h2>
          <p className="text-sm text-muted-foreground">{m.sub}</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> {m.export}</Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {totals.map((tot, i) => (
          <div key={tot.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft" style={{ backgroundImage: `var(--grad-tile-${i + 1})`, backgroundBlendMode: "soft-light" }}>
            <p className="label-mono text-muted-foreground">{tot.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{tot.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[false, true].map((v) => (
          <button key={String(v)} onClick={() => setVipOnly(v)}
            className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              vipOnly === v ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted")}>
            {v && <Crown className="h-3 w-3" />}{v ? m.vip : m.all}
          </button>
        ))}
      </div>

      {customers === null ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <span className="text-4xl">👥</span>
          <p className="mt-4 font-display text-lg font-semibold">{m.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{m.emptySub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">{c.name.split(" ").map((s) => s[0]).join("")}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate font-medium">{c.name}{c.vip && <Crown className="h-3.5 w-3.5 text-primary" />}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                <div>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Wallet className="h-3.5 w-3.5" /> {m.spent}</p>
                  <p className="mt-0.5 font-display text-lg font-semibold tabular-nums text-primary">{formatMoney(c.spent)}</p>
                </div>
                <div>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ShoppingBag className="h-3.5 w-3.5" /> {m.orders}</p>
                  <p className="mt-0.5 font-display text-lg font-semibold tabular-nums">{c.orders}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5"><Mail className="h-3.5 w-3.5" /> {m.mail}</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
