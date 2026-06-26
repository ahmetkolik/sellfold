"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, Plus, TrendingUp, ShoppingBag, Wallet, Percent, Receipt,
  Zap, Crown, BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap,
  Undo2, Banknote, Check, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/i18n/language-provider";
import {
  payouts as demoPayouts, revenue14d as demoRev14d, revenueMonths as demoRevMonths, activity as demoActivity, funnel as demoFunnel, balance as demoBalance,
} from "@/lib/demo/data";
import type { Product, Customer, ProductType } from "@/lib/demo/data";
import { fetchProducts, fetchOrders, deriveCustomers, computeStats, computeRevenue14d, computeRevenueMonths, type Order } from "@/lib/supabase/data";
import { formatMoney, formatNumber, formatRelative } from "@/lib/utils";

const typeIcon: Record<ProductType, typeof BookOpen> = {
  ebook: BookOpen, template: LayoutTemplate, preset: SlidersHorizontal, course: GraduationCap,
};
const typeLabel: Record<ProductType, { tr: string; en: string }> = {
  ebook: { tr: "E-kitap", en: "Ebook" }, template: { tr: "Şablon", en: "Template" },
  preset: { tr: "Preset", en: "Preset" }, course: { tr: "Kurs", en: "Course" },
};
const payoutTone = { paid: "text-success", pending: "text-warning-foreground", scheduled: "text-muted-foreground" } as const;

function Sparkline({ data }: { data: number[] }) {
  const w = 300, h = 70, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 10) - 5]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[70px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.34" />
          <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill="var(--color-primary)" />
    </svg>
  );
}

function Cover({ hue, emoji, className = "" }: { hue: string; emoji: string; className?: string }) {
  return (
    <div
      className={`grid place-items-center ${className}`}
      style={{ backgroundImage: `linear-gradient(140deg, oklch(94% 0.06 ${hue}) 0%, oklch(86% 0.13 ${hue}) 100%)` }}
    >
      <span className="text-3xl drop-shadow-sm">{emoji}</span>
    </div>
  );
}

export default function VitrinDashboard() {
  const { lang, t } = useLang();

  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rev14d, setRev14d] = useState(demoRev14d);
  const [revMonths, setRevMonths] = useState(demoRevMonths);
  const [hasRealData, setHasRealData] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchOrders()]).then(([prods, orders]) => {
      setProducts(prods);
      setSales(orders);
      setCustomers(deriveCustomers(orders));
      if (orders.length > 0) {
        setHasRealData(true);
        setRev14d(computeRevenue14d(orders));
        setRevMonths(computeRevenueMonths(orders));
      }
      setLoaded(true);
    });
  }, []);

  const store = computeStats(products, sales);
  const topProducts = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  const m = {
    tr: {
      eyebrow: "Dükkân · Bugün", hi: "Merhaba.", queueRest: "satış geldi bu ay.",
      newProduct: "Yeni ürün", thisMonth: "Bu ay gelir", liveProducts: "yayında ürün",
      revenue: "Gelir", sales: "Satış", conversion: "Dönüşüm", avgOrder: "Ortalama sepet",
      refund: "İade oranı", nextPayout: "Sonraki ödeme",
      products: "Ürünlerin", all: "Tümü",
      live: "Yayında", draft: "Taslak", salesShort: "satış",
      feed: "Canlı satış akışı",
      top: "En çok kazandıran", topCustomers: "En iyi müşteriler",
      orders: "sipariş", payoutsT: "Ödemeler", paid: "Ödendi", pending: "Bekliyor", scheduled: "Planlandı",
      revByMonth: "Aylık gelir", last6: "son 6 ay", activity: "Son hareketler",
      funnelT: "Dönüşüm hunisi", funnelSub: "bu ay · vitrin → satış",
      balanceT: "Bakiye & ödeme", available: "Transfere hazır", clearing: "Mahsuplaşıyor",
      paidMtd: "Bu ay ödenen", nextTransfer: "Sonraki transfer", transfer: "Transfer et",
      deliveryLog: "Sipariş & teslimat kaydı", buyer: "Alıcı", product: "Ürün", amount: "Tutar",
      status: "Durum", delivered: "Teslim edildi", when: "Zaman", ofVisits: "ziyaretin",
      noSales: "Henüz satış yok", noProducts: "Henüz ürün yok",
    },
    en: {
      eyebrow: "Store · Today", hi: "Hello.", queueRest: "sales this month.",
      newProduct: "New product", thisMonth: "Revenue this month", liveProducts: "products live",
      revenue: "Revenue", sales: "Sales", conversion: "Conversion", avgOrder: "Avg order",
      refund: "Refund rate", nextPayout: "Next payout",
      products: "Your products", all: "All",
      live: "Live", draft: "Draft", salesShort: "sales",
      feed: "Live sales feed",
      top: "Top earners", topCustomers: "Top customers",
      orders: "orders", payoutsT: "Payouts", paid: "Paid", pending: "Pending", scheduled: "Scheduled",
      revByMonth: "Revenue by month", last6: "last 6 months", activity: "Recent activity",
      funnelT: "Conversion funnel", funnelSub: "this month · storefront → sale",
      balanceT: "Balance & payouts", available: "Ready to transfer", clearing: "Clearing",
      paidMtd: "Paid this month", nextTransfer: "Next transfer", transfer: "Transfer",
      deliveryLog: "Order & delivery log", buyer: "Buyer", product: "Product", amount: "Amount",
      status: "Status", delivered: "Delivered", when: "When", ofVisits: "of visits",
      noSales: "No sales yet", noProducts: "No products yet",
    },
  }[lang];

  const maxMonth = Math.max(...revMonths.map((r) => r.v), 1);
  const statusLabel = { paid: m.paid, pending: m.pending, scheduled: m.scheduled };

  const kpis = [
    { icon: Wallet, label: m.revenue, value: formatMoney(store.revenueMonth), delta: store.revenueDelta, up: true },
    { icon: ShoppingBag, label: m.sales, value: formatNumber(store.salesMonth), delta: store.salesDelta, up: true },
    { icon: Percent, label: m.conversion, value: store.conversion, delta: store.conversionDelta, up: true },
    { icon: Receipt, label: m.avgOrder, value: store.avgOrder ? formatMoney(store.avgOrder) : "—", delta: store.avgOrderDelta, up: true },
    { icon: Undo2, label: m.refund, value: store.refundRate, delta: store.refundDelta, up: false },
    { icon: Banknote, label: m.nextPayout, value: formatMoney(demoBalance.available), delta: demoBalance.nextDate, up: true, plain: true },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl ring-1 ring-border shadow-soft" style={{ background: "var(--grad-hero)" }}>
        <span className="blob -left-12 -top-20 h-64 w-64 bg-primary/30 drift" aria-hidden />
        <span className="blob right-1/3 top-8 h-44 w-44 drift" aria-hidden style={{ background: "color-mix(in oklch, var(--color-serif) 35%, transparent)", animationDelay: "2s" }} />
        <div className="relative grid gap-7 p-7 lg:grid-cols-[1.05fr_1fr] lg:p-9">
          <div className="flex flex-col">
            <p className="label-mono flex items-center gap-2 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" /> {m.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-[34px] font-semibold leading-[1.05] tracking-tight lg:text-[44px]">
              {m.hi} <span className="display-accent font-normal">{formatNumber(store.salesMonth)} {m.queueRest}</span>
            </h1>
            <p className="mt-3 inline-flex items-baseline gap-2">
              <span className="font-display text-[40px] font-semibold tabular-nums tracking-tight lg:text-[52px]">{formatMoney(store.revenueMonth)}</span>
              {store.salesMonth > 0 && (
                <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-success"><TrendingUp className="h-4 w-4" />{store.revenueDelta}</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">{m.thisMonth} · {store.liveProducts} {m.liveProducts}</p>
            <div className="mt-5">
              <Link href="/products"><Button size="lg" className="gap-2"><Plus className="h-4 w-4" /> {m.newProduct}</Button></Link>
            </div>
            <div className="mt-auto pt-7"><Sparkline data={rev14d} /></div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-center sm:grid-cols-3 lg:grid-cols-2">
            {kpis.map((k, i) => (
              <div key={k.label} className="rounded-2xl bg-card/75 p-4 ring-1 ring-border backdrop-blur" style={{ backgroundImage: `var(--grad-tile-${(i % 4) + 1})`, backgroundBlendMode: "soft-light" }}>
                <k.icon className="h-4 w-4 text-primary" />
                <p className="mt-3 font-display text-2xl font-semibold tabular-nums">{loaded ? k.value : "—"}</p>
                <div className="mt-0.5 flex items-center justify-between">
                  <p className="text-[11px] leading-tight text-muted-foreground">{k.label}</p>
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${k.plain ? "text-muted-foreground" : k.up ? "text-success" : "text-muted-foreground"}`}>
                    {!k.plain && store.salesMonth > 0 && <TrendingUp className={`h-3 w-3 ${k.up ? "" : "rotate-180"}`} />}{k.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products grid ────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">{m.products}</h2>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">{m.all} <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
        {loaded && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-14 text-center">
            <span className="text-4xl">📦</span>
            <p className="mt-3 font-display text-base font-semibold">{m.noProducts}</p>
            <Link href="/products"><Button size="sm" className="mt-4 gap-2"><Plus className="h-3.5 w-3.5" /> {m.newProduct}</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const Icon = typeIcon[p.type];
              return (
                <div key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
                  <div className="relative">
                    <Cover hue={p.hue} emoji={p.emoji} className="aspect-[16/9] w-full" />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                      <Icon className="h-3 w-3" /> {t(typeLabel[p.type])}
                    </span>
                    <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-medium ${p.live ? "bg-success/90 text-success-foreground" : "bg-black/45 text-white"}`}>
                      {p.live ? m.live : m.draft}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="truncate font-medium">{p.title}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <p className="font-display text-lg font-semibold tabular-nums text-primary">{formatMoney(p.price)}</p>
                      <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground tabular-nums">{formatNumber(p.sales)}</span> {m.salesShort}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{formatMoney(p.revenue)}</span>
                      <span className="text-muted-foreground/70">{lang === "tr" ? "toplam" : "lifetime"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Live sales feed + top earners + payouts ─────────────────── */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.feed}</h2>
            <span className="label-mono inline-flex items-center gap-1.5 text-success"><span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> {lang === "tr" ? "Canlı" : "Live"}</span>
          </div>
          {loaded && sales.length === 0 ? (
            <div className="mt-6 flex flex-col items-center py-8 text-center text-muted-foreground">
              <span className="text-3xl">🛍️</span>
              <p className="mt-3 text-sm">{m.noSales}</p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {sales.slice(0, 8).map((s) => {
                const Icon = typeIcon[s.type];
                return (
                  <li key={s.id} className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.buyer}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm font-semibold tabular-nums text-primary">{formatMoney(s.amount)}</p>
                      <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Zap className="h-3 w-3 text-success" /> {formatRelative(s.at)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.top}</h2>
            {loaded && topProducts.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">{m.noProducts}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {topProducts.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <Cover hue={p.hue} emoji={p.emoji} className="h-9 w-9 shrink-0 rounded-lg text-base" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${topProducts[0].revenue ? (p.revenue / topProducts[0].revenue) * 100 : 0}%`, backgroundImage: "linear-gradient(90deg, var(--color-primary), var(--color-serif))" }} />
                      </div>
                    </div>
                    <span className="shrink-0 font-display text-sm font-semibold tabular-nums">{formatMoney(p.revenue)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.payoutsT}</h2>
            {!hasRealData && loaded ? (
              <p className="mt-4 text-sm text-muted-foreground">{m.noSales}</p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {demoPayouts.map((po) => (
                  <li key={po.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                    <span className={`h-2 w-2 rounded-full ${po.status === "paid" ? "bg-success" : po.status === "pending" ? "bg-warning" : "bg-muted-foreground"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t(po.label)}</p>
                      <p className="text-xs text-muted-foreground">{po.date} · <span className={payoutTone[po.status]}>{statusLabel[po.status]}</span></p>
                    </div>
                    <span className="font-display text-sm font-semibold tabular-nums">{po.amount ? formatMoney(po.amount) : "—"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ── Revenue by month + activity ─────────────────────────────── */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">{m.revByMonth}</h2>
              <p className="text-sm text-muted-foreground">{m.last6}</p>
            </div>
          </div>
          <div className="mt-6 flex h-44 items-end gap-3">
            {revMonths.map((r, i) => (
              <div key={r.m} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-medium tabular-nums text-muted-foreground">${r.v}K</span>
                <div className="flex w-full items-end justify-center" style={{ height: "100%" }}>
                  <div
                    className="w-full max-w-[44px] rounded-t-lg transition-all"
                    style={{
                      height: `${(r.v / maxMonth) * 100}%`,
                      backgroundImage: i === revMonths.length - 1
                        ? "linear-gradient(180deg, var(--color-primary), var(--color-serif))"
                        : "linear-gradient(180deg, color-mix(in oklch, var(--color-primary) 50%, transparent), color-mix(in oklch, var(--color-primary) 18%, transparent))",
                    }}
                  />
                </div>
                <span className="label-mono text-muted-foreground">{r.m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold tracking-tight">{m.activity}</h2>
          {!hasRealData && loaded ? (
            <div className="mt-6 flex flex-col items-center py-8 text-center text-muted-foreground">
              <span className="text-3xl">📋</span>
              <p className="mt-3 text-sm">{m.noSales}</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {demoActivity.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.tone === "success" ? "bg-success" : a.tone === "warning" ? "bg-warning" : a.tone === "info" ? "bg-info" : "bg-primary"}`} />
                  <div className="min-w-0 text-sm">
                    <p className="leading-snug"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{t(a.action)}</span> <span className="font-medium">{a.target}</span></p>
                    <p className="text-xs text-muted-foreground">{formatRelative(a.at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Conversion funnel + balance & payouts ───────────────────── */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">{m.funnelT}</h2>
              <p className="text-sm text-muted-foreground">{m.funnelSub}</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary"><Filter className="h-4 w-4" /></span>
          </div>
          {!hasRealData && loaded ? (
            <div className="mt-6 flex flex-col items-center py-8 text-center text-muted-foreground">
              <span className="text-3xl">📊</span>
              <p className="mt-3 text-sm">{m.noSales}</p>
            </div>
          ) : (
          <ul className="mt-5 space-y-2.5">
            {demoFunnel.map((f, i) => {
              const pct = (f.value / demoFunnel[0].value) * 100;
              return (
                <li key={t(f.label)}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm font-medium">{t(f.label)}</span>
                    <span className="flex items-baseline gap-2">
                      <span className="font-display text-sm font-semibold tabular-nums">{formatNumber(f.value)}</span>
                      <span className="text-[11px] tabular-nums text-muted-foreground">{pct.toFixed(1)}% {m.ofVisits}</span>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundImage: i === demoFunnel.length - 1
                          ? "linear-gradient(90deg, var(--color-primary), var(--color-serif))"
                          : `linear-gradient(90deg, color-mix(in oklch, var(--color-primary) ${70 - i * 14}%, transparent), color-mix(in oklch, var(--color-primary) ${40 - i * 8}%, transparent))`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          )}
        </div>

        <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.balanceT}</h2>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-success/12 text-success"><Banknote className="h-4 w-4" /></span>
          </div>
          {!hasRealData && loaded ? (
            <div className="mt-6 flex flex-1 flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <span className="text-3xl">💳</span>
              <p className="mt-3 text-sm">{m.noSales}</p>
            </div>
          ) : (
            <>
          <p className="label-mono mt-4 text-muted-foreground">{m.available}</p>
          <p className="mt-1 font-display text-[34px] font-semibold leading-none tabular-nums text-primary">{formatMoney(demoBalance.available)}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-[11px] text-muted-foreground">{m.clearing}</p>
              <p className="mt-1 font-display text-base font-semibold tabular-nums">{formatMoney(demoBalance.pending)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-[11px] text-muted-foreground">{m.paidMtd}</p>
              <p className="mt-1 font-display text-base font-semibold tabular-nums">{formatMoney(demoBalance.paidThisMonth)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-xs">
            <span className="text-muted-foreground">{m.nextTransfer}</span>
            <span className="font-medium">{demoBalance.nextDate}</span>
          </div>
          <Button className="mt-4 w-full gap-2"><ArrowUpRight className="h-4 w-4" /> {m.transfer}</Button>
            </>
          )}
        </div>
      </section>

      {/* ── Order & delivery log ────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">{m.deliveryLog}</h2>
          <Link href="/sales" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">{m.all} <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
        {loaded && sales.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center text-muted-foreground">
            <span className="text-3xl">📋</span>
            <p className="mt-3 text-sm">{m.noSales}</p>
          </div>
        ) : (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="label-mono text-left text-muted-foreground">
                  <th className="px-2 pb-3 font-normal">{m.buyer}</th>
                  <th className="px-2 pb-3 font-normal">{m.product}</th>
                  <th className="px-2 pb-3 text-right font-normal">{m.amount}</th>
                  <th className="px-2 pb-3 font-normal">{m.status}</th>
                  <th className="px-2 pb-3 text-right font-normal">{m.when}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sales.slice(0, 10).map((s) => {
                  const Icon = typeIcon[s.type];
                  return (
                    <tr key={s.id} className="text-sm">
                      <td className="px-2 py-3">
                        <span className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">{s.buyer.split(" ").map((x) => x[0]).join("")}</span>
                          <span className="font-medium">{s.buyer}</span>
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="flex items-center gap-2 text-muted-foreground"><Icon className="h-3.5 w-3.5 shrink-0 text-primary" /><span className="max-w-[200px] truncate">{s.product}</span></span>
                      </td>
                      <td className="px-2 py-3 text-right font-display font-semibold tabular-nums text-primary">{formatMoney(s.amount)}</td>
                      <td className="px-2 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-medium text-success"><Check className="h-3 w-3" /> {m.delivered}</span>
                      </td>
                      <td className="px-2 py-3 text-right text-xs text-muted-foreground">{formatRelative(s.at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Top customers ───────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">{m.topCustomers}</h2>
          <Link href="/customers" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">{m.all} <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
        {loaded && customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-14 text-center">
            <span className="text-4xl">👥</span>
            <p className="mt-3 text-sm text-muted-foreground">{lang === "tr" ? "Henüz müşteri yok" : "No customers yet"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customers.slice(0, 6).map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">{c.name.split(" ").map((s) => s[0]).join("")}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium">{c.name}{c.vip && <Crown className="h-3.5 w-3.5 text-primary" />}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.orders} {m.orders} · {c.last}</p>
                </div>
                <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-primary">{formatMoney(c.spent)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
