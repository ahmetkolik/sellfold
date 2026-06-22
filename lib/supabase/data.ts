import { createClient } from "@/lib/supabase/client";
import type { Product, Sale, Customer, ProductType } from "@/lib/demo/data";

export type Order = Sale & { buyer_email: string };

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, orders(amount)")
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((p: any) => ({
    id: p.id,
    title: p.title,
    type: p.type as ProductType,
    price: Number(p.price),
    hue: p.hue ?? "220",
    emoji: p.emoji ?? "📦",
    live: p.live ?? false,
    sales: Array.isArray(p.orders) ? p.orders.length : 0,
    revenue: Array.isArray(p.orders)
      ? p.orders.reduce((s: number, o: any) => s + Number(o.amount ?? 0), 0)
      : 0,
  }));
}

export async function fetchOrders(): Promise<Order[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, products(title, type)")
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((o: any) => ({
    id: o.id,
    buyer: o.buyer_name,
    buyer_email: o.buyer_email ?? "",
    product: o.products?.title ?? "—",
    type: (o.products?.type ?? "ebook") as ProductType,
    amount: Number(o.amount),
    at: o.created_at,
    delivered: o.delivered ?? false,
  }));
}

export function deriveCustomers(orders: Order[]): Customer[] {
  const map = new Map<string, { name: string; email: string; spent: number; cnt: number; lastAt: string }>();

  for (const o of orders) {
    const email = o.buyer_email || o.buyer.toLowerCase().replace(/\s/g, ".") + "@buyer";
    const prev = map.get(email);
    if (prev) {
      prev.spent += o.amount;
      prev.cnt += 1;
      if (o.at > prev.lastAt) prev.lastAt = o.at;
    } else {
      map.set(email, { name: o.buyer, email, spent: o.amount, cnt: 1, lastAt: o.at });
    }
  }

  const list = [...map.entries()]
    .map(([email, v], i) => ({
      id: email,
      name: v.name,
      email,
      spent: v.spent,
      orders: v.cnt,
      last: formatLast(v.lastAt),
      vip: v.spent >= 500 || v.cnt >= 3,
    }))
    .sort((a, b) => b.spent - a.spent);

  return list;
}

function formatLast(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} dk`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa`;
  return `${Math.floor(h / 24)} gün`;
}

export interface StoreStats {
  revenueMonth: number;
  revenueDelta: string;
  salesMonth: number;
  salesDelta: string;
  conversion: string;
  conversionDelta: string;
  avgOrder: number;
  avgOrderDelta: string;
  refundRate: string;
  refundDelta: string;
  payoutNext: number;
  liveProducts: number;
}

export function computeStats(products: Product[], orders: Order[]): StoreStats {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = orders.filter((o) => new Date(o.at) >= startOfMonth);
  const revenueMonth = thisMonth.reduce((s, o) => s + o.amount, 0);
  const salesMonth = thisMonth.length;
  const avgOrder = salesMonth ? Math.round(revenueMonth / salesMonth) : 0;

  return {
    revenueMonth,
    revenueDelta: salesMonth > 0 ? "yeni" : "—",
    salesMonth,
    salesDelta: "—",
    conversion: "—",
    conversionDelta: "—",
    avgOrder,
    avgOrderDelta: "—",
    refundRate: "—",
    refundDelta: "—",
    payoutNext: 0,
    liveProducts: products.filter((p) => p.live).length,
  };
}

export function computeRevenue14d(orders: Order[]): number[] {
  const now = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 13 + i);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    return orders
      .filter((o) => { const t = new Date(o.at); return t >= dayStart && t < dayEnd; })
      .reduce((s, o) => s + o.amount, 0);
  });
}

export function computeRevenueMonths(orders: Order[]): { m: string; v: number }[] {
  const now = new Date();
  const TR_MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const total = orders
      .filter((o) => {
        const t = new Date(o.at);
        return t.getFullYear() === d.getFullYear() && t.getMonth() === d.getMonth();
      })
      .reduce((s, o) => s + o.amount, 0);
    return { m: TR_MONTHS[d.getMonth()], v: Math.round(total / 1000) };
  });
}
