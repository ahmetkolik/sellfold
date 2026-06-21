/**
 * Vitrin demo data — a creator's digital product store. With no API keys, the
 * dashboard renders from this file; gradient + emoji cover tiles stand in for
 * product artwork. Wire Stripe + Resend (run /setup) to sell and deliver live.
 */
import type { L } from "@/lib/i18n/config";

export type ProductType = "ebook" | "template" | "preset" | "course";

export interface Product {
  id: string;
  title: string;
  type: ProductType;
  price: number; // TRY
  sales: number;
  revenue: number; // TRY
  hue: string; // oklch hue for the cover tile
  emoji: string;
  live: boolean;
}

export const products: Product[] = [
  { id: "p1", title: "Notion ile Sıfırdan Sistem", type: "template", price: 349, sales: 412, revenue: 143788, hue: "32", emoji: "🗂️", live: true },
  { id: "p2", title: "Sinematik Lightroom Preset Paketi", type: "preset", price: 199, sales: 706, revenue: 140494, hue: "350", emoji: "🎞️", live: true },
  { id: "p3", title: "Freelancer'ın El Kitabı", type: "ebook", price: 149, sales: 528, revenue: 78672, hue: "70", emoji: "📘", live: true },
  { id: "p4", title: "30 Günde Topluluk Kur", type: "course", price: 899, sales: 134, revenue: 120466, hue: "152", emoji: "🎓", live: true },
  { id: "p5", title: "Instagram Carousel Şablonları", type: "template", price: 129, sales: 389, revenue: 50181, hue: "300", emoji: "🎠", live: true },
  { id: "p6", title: "Gün Batımı Reels LUT'ları", type: "preset", price: 89, sales: 241, revenue: 21449, hue: "45", emoji: "🌅", live: false },
];

/* ── Live sales feed ─────────────────────────────────────────────────────── */
export interface Sale {
  id: string;
  buyer: string;
  product: string;
  type: ProductType;
  amount: number; // TRY
  at: string; // ISO
  delivered: boolean;
}

export const sales: Sale[] = [
  { id: "s1", buyer: "Elif Kaya", product: "Sinematik Lightroom Preset Paketi", type: "preset", amount: 199, at: "2026-06-13T09:12:00Z", delivered: true },
  { id: "s2", buyer: "Mert Demir", product: "Notion ile Sıfırdan Sistem", type: "template", amount: 349, at: "2026-06-13T08:54:00Z", delivered: true },
  { id: "s3", buyer: "Zeynep Ar", product: "30 Günde Topluluk Kur", type: "course", amount: 899, at: "2026-06-13T08:31:00Z", delivered: true },
  { id: "s4", buyer: "Can Yıldız", product: "Freelancer'ın El Kitabı", type: "ebook", amount: 149, at: "2026-06-13T07:58:00Z", delivered: true },
  { id: "s5", buyer: "Selin Aksoy", product: "Instagram Carousel Şablonları", type: "template", amount: 129, at: "2026-06-13T07:20:00Z", delivered: true },
  { id: "s6", buyer: "Burak Çelik", product: "Sinematik Lightroom Preset Paketi", type: "preset", amount: 199, at: "2026-06-12T22:46:00Z", delivered: true },
  { id: "s7", buyer: "Deniz Polat", product: "Notion ile Sıfırdan Sistem", type: "template", amount: 349, at: "2026-06-12T21:05:00Z", delivered: true },
  { id: "s8", buyer: "Aslı Korkmaz", product: "Freelancer'ın El Kitabı", type: "ebook", amount: 149, at: "2026-06-12T19:33:00Z", delivered: true },
];

/* ── Customers ───────────────────────────────────────────────────────────── */
export interface Customer {
  id: string;
  name: string;
  email: string;
  spent: number; // TRY
  orders: number;
  last: string; // human relative-ish
  vip: boolean;
}

export const customers: Customer[] = [
  { id: "c1", name: "Elif Kaya", email: "elif@studio.co", spent: 1247, orders: 6, last: "12 dk", vip: true },
  { id: "c2", name: "Zeynep Ar", email: "zeynep@ar.dev", spent: 1797, orders: 4, last: "37 dk", vip: true },
  { id: "c3", name: "Mert Demir", email: "mert.demir@gmail.com", spent: 698, orders: 3, last: "1 sa", vip: false },
  { id: "c4", name: "Can Yıldız", email: "canyildiz@me.com", spent: 447, orders: 3, last: "3 sa", vip: false },
  { id: "c5", name: "Selin Aksoy", email: "selin@aksoy.io", spent: 387, orders: 2, last: "5 sa", vip: false },
  { id: "c6", name: "Burak Çelik", email: "burak@celik.tv", spent: 588, orders: 4, last: "dün", vip: false },
];

/* ── Revenue (last 14 days, TRY) ─────────────────────────────────────────── */
export const revenue14d = [3200, 4100, 3800, 5200, 6100, 5400, 7300, 6800, 8200, 9100, 8400, 10800, 12200, 13600];

/* ── Revenue by month (trend, TRY thousands) ─────────────────────────────── */
export const revenueMonths: { m: string; v: number }[] = [
  { m: "Oca", v: 142 }, { m: "Şub", v: 168 }, { m: "Mar", v: 191 }, { m: "Nis", v: 224 },
  { m: "May", v: 268 }, { m: "Haz", v: 312 },
];

/* ── Activity feed ───────────────────────────────────────────────────────── */
export interface DActivity { id: string; who: string; action: L; target: string; at: string; tone: "neutral" | "success" | "warning" | "info"; }
export const activity: DActivity[] = [
  { id: "a1", who: "Vitrin", action: { tr: "siparişi teslim etti:", en: "delivered the order for" }, target: "Lightroom Preset Paketi", at: "2026-06-13T09:12:00Z", tone: "success" },
  { id: "a2", who: "Mert D.", action: { tr: "satın aldı:", en: "purchased" }, target: "Notion ile Sıfırdan Sistem", at: "2026-06-13T08:54:00Z", tone: "info" },
  { id: "a3", who: "Sen", action: { tr: "lansman kuponu oluşturdun:", en: "created a launch coupon for" }, target: "Topluluk Kur", at: "2026-06-12T18:40:00Z", tone: "neutral" },
  { id: "a4", who: "Sistem", action: { tr: "kontenjan azalıyor uyarısı:", en: "flagged a low-seats alert on" }, target: "30 Günde Topluluk Kur", at: "2026-06-12T16:10:00Z", tone: "warning" },
  { id: "a5", who: "Vitrin", action: { tr: "yeni müşteri kaydetti:", en: "registered a new customer:" }, target: "Aslı Korkmaz", at: "2026-06-12T11:25:00Z", tone: "success" },
];

/* ── Payouts ─────────────────────────────────────────────────────────────── */
export interface Payout { id: string; label: L; amount: number; status: "paid" | "pending" | "scheduled"; date: string; }
export const payouts: Payout[] = [
  { id: "po1", label: { tr: "Haziran 1. yarı", en: "June, first half" }, amount: 78400, status: "paid", date: "08 Haz" },
  { id: "po2", label: { tr: "Bu hafta", en: "This week" }, amount: 41250, status: "pending", date: "16 Haz" },
  { id: "po3", label: { tr: "Sonraki transfer", en: "Next transfer" }, amount: 0, status: "scheduled", date: "23 Haz" },
];

/* ── Store month-to-date numbers for the hero ────────────────────────────── */
export const store = {
  revenueMonth: 312480, // TRY
  revenueDelta: "+38%",
  salesMonth: 1842,
  salesDelta: "+24%",
  conversion: "4.8%",
  conversionDelta: "+0.9pt",
  avgOrder: 247, // TRY
  avgOrderDelta: "+11%",
  refundRate: "1.2%",
  refundDelta: "-0.4pt",
  payoutNext: 41250, // TRY pending this period
  liveProducts: products.filter((p) => p.live).length,
};

/* ── Conversion funnel (storefront → purchase, this month) ───────────────── */
export const funnel: { label: L; value: number }[] = [
  { label: { tr: "Ziyaret", en: "Visits" }, value: 38400 },
  { label: { tr: "Ürün sayfası", en: "Product views" }, value: 16920 },
  { label: { tr: "Ödemeye başla", en: "Checkout started" }, value: 3210 },
  { label: { tr: "Satın aldı", en: "Purchased" }, value: 1842 },
];

/* ── Payout / balance summary for the dashboard panel ────────────────────── */
export const balance = {
  available: 41250, // TRY ready to transfer
  pending: 18600, // TRY clearing
  paidThisMonth: 252630, // TRY transferred MTD
  nextDate: "16 Haz",
};
