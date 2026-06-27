import appConfig from "@/app.config";
import { SettingsClient } from "@/components/app/settings-client";

export default async function SettingsPage() {
  const connected: Record<string, boolean> = {};
  for (const it of appConfig.integrations) {
    connected[it.key] = it.envVars.every((v) => !!process.env[v]);
  }

  return <SettingsClient connected={connected} />;
}
