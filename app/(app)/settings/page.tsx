import appConfig from "@/app.config";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "@/components/app/settings-client";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ subscription?: string }>;
}) {
  const params = await searchParams;
  const connected: Record<string, boolean> = {};
  for (const it of appConfig.integrations) {
    connected[it.key] = it.envVars.every((v) => !!process.env[v]);
  }

  let plan = "starter";
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();
      if (data?.plan) plan = data.plan;
    }
  } catch {
    // demo mode — no supabase
  }

  return (
    <SettingsClient
      connected={connected}
      plan={plan}
      subscriptionSuccess={params.subscription === "success"}
    />
  );
}
