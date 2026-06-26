import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const since = new Date(Date.now() - 14 * 86400000).toISOString();

    const [{ data: rawViews }, { data: rawClicks }] = await Promise.all([
      supabase.from("page_views").select("created_at, path").gte("created_at", since),
      supabase.from("product_clicks").select("created_at, product_id").gte("created_at", since),
    ]);

    // Build 14-day day labels
    const days: string[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    const viewsByDay = days.map((day) => ({
      day: day.slice(5), // MM-DD
      v: (rawViews || []).filter((x) => x.created_at.slice(0, 10) === day).length,
    }));

    const clicksByDay = days.map((day) => ({
      day: day.slice(5),
      v: (rawClicks || []).filter((x) => x.created_at.slice(0, 10) === day).length,
    }));

    const pageCounts: Record<string, number> = {};
    (rawViews || []).forEach((v) => {
      pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }));

    return NextResponse.json({
      viewsByDay,
      clicksByDay,
      topPages,
      totalViews: (rawViews || []).length,
      totalClicks: (rawClicks || []).length,
      todayViews: viewsByDay[viewsByDay.length - 1]?.v ?? 0,
    });
  } catch {
    return NextResponse.json({
      viewsByDay: [],
      clicksByDay: [],
      topPages: [],
      totalViews: 0,
      totalClicks: 0,
      todayViews: 0,
    });
  }
}
