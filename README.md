# 50 Champs

Unofficial clan dashboard for Clash of Clans: war room, live war map, CWL, clan roster, village progress and Hero Lab.
Site: https://50champs.com (GitHub Pages). Backend: Supabase (database, Edge Functions, Storage).

## Pages
- `index.html` — landing page
- `dashboard.html` — the app (home feed, war, CWL, clan, village, Hero Lab)
- `war-map.html` — live war map (opened from the War tab)
- `privacy.html` — privacy and fan-content notice
- `404.html` — page not found
- `sw.js`, `manifest.webmanifest`, icons — install to home screen and war notifications
- `coc-icon.js` — `<coc-icon>` game icons
- `game-data.json` — verified game-data overrides used by the dashboard

## Supabase
- SQL: run `sql-1` … `sql-5` in order (all are safe to run again).
- Edge Functions: `clan-sync` (accounts, roles, profiles), `war-stats` (collects wars every 2 min, push, Remind), `assets-sync` (game icons).
- Secrets: `CLASH_API_TOKEN`, `CLASH_API_BASE_URL`, `STATS_CRON_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`. Never commit them.

## Game icons (coc-assets)
Icons live in Supabase Storage, bucket `coc-assets`; the list is in table `coc_assets` and in `coc-assets/manifest.json`.
- League and label icons come from the official Clash API (Edge Function `assets-sync`).
- Troops, siege machines, spells, heroes, pets, equipment, buildings and missing league icons come from [ClashKing Assets](https://github.com/ClashKingInc/ClashKingAssets), converted to webp 128 px and 64 px.
- On pages: `<coc-icon type="hero" name="Barbarian King" size="32"></coc-icon>`. No icon → initials tile.

### After a game update
1. Wait until ClashKing Assets has a new commit with the new units (usually a few days).
2. GitHub → Actions → **Sync game icons** → **Run workflow**. It also runs by itself every Monday.
3. Open the finished run: the summary lists **API names without an icon**.
4. If the pack has the icon under another name, add a line to `scripts/asset-overrides.json`, for example `"New Gear Name": "equipment/new_gear.webp"`, and run the workflow again.
5. Pages pick up the new `manifest.json` within 6 hours.

Locally (optional): `npm install`, then `ASSETS_SYNC_SECRET=... npm run assets:sync` (Node 22.18+).
GitHub secret `ASSETS_SYNC_SECRET` = the value of `STATS_CRON_SECRET` in Supabase.

This material is unofficial and is not endorsed by Supercell. For more information see Supercell's Fan Content Policy: www.supercell.com/fan-content-policy
