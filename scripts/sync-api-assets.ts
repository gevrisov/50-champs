// League and label icons from the official Clash API + badges of our clans -> Supabase Storage coc-assets.
// The download runs inside the Supabase Edge Function "assets-sync", which already reaches the Clash API
// through our proxy (CLASH_API_BASE_URL + CLASH_API_TOKEN). No API key is needed here.
// Run: node scripts/sync-api-assets.ts   (Node 22.18+; needs env ASSETS_SYNC_SECRET)

import { appendFileSync } from "node:fs";

const FN = process.env.ASSETS_FUNCTION_URL || "https://bqdobvylbmwraumyskwn.supabase.co/functions/v1/assets-sync";
const SECRET = process.env.ASSETS_SYNC_SECRET || "";

async function main() {
  if (!SECRET) throw new Error("Set ASSETS_SYNC_SECRET (same value as STATS_CRON_SECRET in Supabase).");
  const r = await fetch(FN, {
    method: "POST",
    headers: { "content-type": "application/json", "x-cron-secret": SECRET },
    body: JSON.stringify({ action: "api" }),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`assets-sync: HTTP ${r.status} ${text.slice(0, 300)}`);
  const res = JSON.parse(text);
  const lines = [
    "## API assets sync",
    `Saved: ${res.saved} (${Object.entries(res.counts || {}).map(([k, v]) => `${k} ${v}`).join(", ")})`,
    `Manifest items: ${res.manifest_items}`,
    "",
    `### No icon in the API (${res.no_icon_in_api.length}) — the game sync fills these from the pack`,
    ...(res.no_icon_in_api.length ? res.no_icon_in_api.map((x: string) => `- ${x}`) : ["- none"]),
    "",
    `### Errors (${res.errors.length})`,
    ...(res.errors.length ? res.errors.map((x: string) => `- ${x}`) : ["- none"]),
  ];
  console.log(lines.join("\n"));
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
