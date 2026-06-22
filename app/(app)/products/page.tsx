"use client";

import { useEffect, useState } from "react";
import {
  Plus, Wallet, BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap, Pencil, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/i18n/language-provider";
import type { Product, ProductType } from "@/lib/demo/data";
import { fetchProducts } from "@/lib/supabase/data";
import { formatMoney, formatNumber, cn } from "@/lib/utils";

const typeIcon: Record<ProductType, typeof BookOpen> = {
  ebook: BookOpen, template: LayoutTemplate, preset: SlidersHorizontal, course: GraduationCap,
};
const typeLabel: Record<ProductType, { tr: string; en: string }> = {
  ebook: { tr: "E-kitap", en: "Ebook" }, template: { tr: "Şablon", en: "Template" },
  preset: { tr: "Preset", en: "Preset" }, course: { tr: "Kurs", en: "Course" },
};

function Cover({ hue, emoji, className = "" }: { hue: string; emoji: string; className?: string }) {
  return (
    <div className={`grid place-items-center ${className}`}
      style={{ backgroundImage: `linear-gradient(140deg, oklch(94% 0.06 ${hue}) 0%, oklch(86% 0.13 ${hue}) 100%)` }}>
      <span className="text-3xl drop-shadow-sm">{emoji}</span>
    </div>
  );
}

export default function ProductsPage() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<ProductType | "all">("all");
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const m = {
    tr: { title: "Ürünler", sub: "Dükkânındaki dijital ürünler ve performansları.", add: "Yeni ürün", all: "Tümü", live: "Yayında", draft: "Taslak", sales: "satış", edit: "Düzenle",
      empty: "Henüz ürün yok", emptySub: "İlk dijital ürününü eklemek için butona tıkla." },
    en: { title: "Products", sub: "The digital products in your store and how they perform.", add: "New product", all: "All", live: "Live", draft: "Draft", sales: "sales", edit: "Edit",
      empty: "No products yet", emptySub: "Click the button above to add your first digital product." },
  }[lang];

  const filters: (ProductType | "all")[] = ["all", "ebook", "template", "preset", "course"];
  const list = products ?? [];
  const shown = filter === "all" ? list : list.filter((p) => p.type === filter);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{m.title}</h2>
          <p className="text-sm text-muted-foreground">{m.sub}</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> {m.add}</Button>
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

      {products === null ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <span className="text-4xl">📦</span>
          <p className="mt-4 font-display text-lg font-semibold">{m.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{m.emptySub}</p>
          <Button className="mt-5 gap-2"><Plus className="h-4 w-4" /> {m.add}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => {
            const Icon = typeIcon[p.type];
            return (
              <div key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
                <div className="relative">
                  <Cover hue={p.hue} emoji={p.emoji} className="aspect-[16/9] w-full" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                    <Icon className="h-3 w-3" /> {t(typeLabel[p.type])}
                  </span>
                  <span className={cn("absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-medium", p.live ? "bg-success/90 text-success-foreground" : "bg-black/45 text-white")}>
                    {p.live ? m.live : m.draft}
                  </span>
                </div>
                <div className="p-4">
                  <p className="truncate font-medium">{p.title}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <p className="font-display text-lg font-semibold tabular-nums text-primary">{formatMoney(p.price)}</p>
                    <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground tabular-nums">{formatNumber(p.sales)}</span> {m.sales}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{formatMoney(p.revenue)}</span>
                    <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-muted-foreground"><Pencil className="h-3 w-3" /> {m.edit}</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
