"use client";

import { useEffect, useState } from "react";
import {
  Download, Zap, CheckCircle2, BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/i18n/language-provider";
import type { ProductType } from "@/lib/demo/data";
import { fetchOrders, computeStats, type Order } from "@/lib/supabase/data";
import { formatMoney, formatNumber, formatRelative, cn } from "@/lib/utils";

const typeIcon: Record<ProductType, typeof BookOpen> = {
  ebook: BookOpen, template: LayoutTemplate, preset: SlidersHorizontal, course: GraduationCap,
};
const typeLabel: Record<ProductType, { tr: string; en: string }> = {
  ebook: { tr: "E-kitap", en: "Ebook" }, template: { tr: "Şablon", en: "Template" },
  preset: { tr: "Preset", en: "Preset" }, course: { tr: "Kurs", en: "Course" },
};

export default function SalesPage() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<ProductType | "all">("all");
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const m = {
    tr: { title: "Satışlar", sub: "Her sipariş, ödeme ve teslimat tek akışta.", export: "Dışa aktar", all: "Tümü",
      monthRev: "Bu ay gelir", monthSales: "Bu ay satış", avg: "Ortalama sepet",
      buyer: "Alıcı", product: "Ürün", amount: "Tutar", when: "Zaman", status: "Durum", delivered: "Teslim edildi",
      empty: "Henüz satış yok", emptySub: "İlk satışın burada görünecek." },
    en: { title: "Sales", sub: "Every order, payment and delivery in one feed.", export: "Export", all: "All",
      monthRev: "Revenue this month", monthSales: "Sales this month", avg: "Avg order",
      buyer: "Buyer", product: "Product", amount: "Amount", when: "When", status: "Status", delivered: "Delivered",
      empty: "No sales yet", emptySub: "Your first sale will appear here." },
  }[lang];

  const list = orders ?? [];
  const filters: (ProductType | "all")[] = ["all", "ebook", "template", "preset", "course"];
  const shown = filter === "all" ? list : list.filter((s) => s.type === filter);

  const stats = computeStats([], list);
  const totals = [
    { label: m.monthRev, value: formatMoney(stats.revenueMonth), delta: "" },
    { label: m.monthSales, value: formatNumber(stats.salesMonth), delta: "" },
    { label: m.avg, value: stats.avgOrder ? formatMoney(stats.avgOrder) : "—", delta: "" },
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
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{orders === null ? "—" : tot.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted")}>
            {f !== "all" && (() => { const I = typeIcon[f]; return <I className="h-3 w-3" />; })()}
            {f === "all" ? m.all : t(typeLabel[f])}
          </button>
        ))}
      </div>

      {orders === null ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <span className="text-4xl">🛍️</span>
          <p className="mt-4 font-display text-lg font-semibold">{m.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{m.emptySub}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">{m.buyer}</th>
                <th className="px-5 py-3 font-medium">{m.product}</th>
                <th className="hidden px-5 py-3 text-right font-medium sm:table-cell">{m.when}</th>
                <th className="px-5 py-3 text-right font-medium">{m.amount}</th>
                <th className="hidden px-5 py-3 text-center font-medium md:table-cell">{m.status}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((s) => {
                const Icon = typeIcon[s.type];
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">{s.buyer.split(" ").map((p) => p[0]).join("")}</span>
                        <span className="font-medium">{s.buyer}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Icon className="h-3.5 w-3.5 text-primary" /> {s.product}</span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-right text-xs text-muted-foreground sm:table-cell"><span className="inline-flex items-center gap-1"><Zap className="h-3 w-3 text-success" />{formatRelative(s.at)}</span></td>
                    <td className="px-5 py-3.5 text-right font-display font-semibold tabular-nums text-primary">{formatMoney(s.amount)}</td>
                    <td className="hidden px-5 py-3.5 text-center md:table-cell">
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-0.5 text-xs font-medium text-success"><CheckCircle2 className="h-3 w-3" /> {m.delivered}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
