import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { path, referrer, session_id, product_id } = await req.json();

    if (product_id) {
      await supabase.from("product_clicks").insert({ product_id, path, session_id });
    } else {
      await supabase.from("page_views").insert({ path, referrer, session_id });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
