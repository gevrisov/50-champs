# 50 Champs — Clan Command Center 0.8 Deploy Preview

Clan Command Center is a mobile-first, unofficial Clash of Clans companion for village tracking, upgrade planning, war coordination, and CWL bonus decisions.

**Release status:** closed local alpha. The application is usable on one device, but it is not yet a shared online clan service. There is no login, cloud synchronization, or automatic Clash API import.

## Current modules

### Village import and progress

- Paste a Clash of Clans village JSON export or choose a `.json` file.
- Detect the player tag, export timestamp, Town Hall, and Builder Hall.
- Parse Home Village and Builder Base separately.
- Track buildings, traps, walls, troops, spells, siege machines, heroes, pets, equipment, helpers, boosts, and collection data.
- Preserve unknown IDs instead of silently assigning an incorrect name.
- Search and filter the complete imported inventory.
- Keep up to 24 snapshots per player account in the current browser.
- Compare exact entity distributions between snapshots.
- Switch between multiple imported accounts on the same device.

### Upgrade progress and timers

- Calculate category progress against the pinned `clash-of-clans-data@0.16.0` max-level catalog.
- Display separate progress for structures, traps, laboratory, heroes, equipment, pets, walls, Builder structures, Star Laboratory, and Builder heroes.
- Calculate finish times from the export timestamp and remaining timer.
- Continue live countdowns after the import.
- Mark expired timers as **Likely completed** until a new export confirms the result.
- Cache previously loaded max-level summaries for offline reuse.

The combined Home Village value is intentionally described as **core tracked progress**. Unsupported or not-yet-verified categories are not estimated.

### Upgrade Planner

- Maintain a separate planned queue for every imported account.
- Reserve Home Village builders, Laboratory, Pet House, Builder Base builders, and Star Laboratory using imported active timers.
- Configure Home and Builder Base builder counts.
- Add manual future upgrades with duration, resource, cost, priority, target level, and notes.
- Calculate the next available worker, planned start and finish dates, total scheduled work, and resource totals.
- Reorder, remove, clear, and export the plan.

Future costs and durations are currently entered manually. The village export does not contain the full upgrade table for all future levels.

### Clan roster

- Maintain a local list of clan members with player tag, Town Hall, and role.
- Reuse that roster in War Room and CWL Bonus Tracker.

### War Room

- Create and retain multiple CW, CWL, or Friendly War records.
- Support 5v5 through 50v50 lineups.
- Select the participating roster for each war.
- Maintain the enemy lineup with Town Hall and scout notes.
- Assign first and second attacks, backup targets, and leader notes.
- Log stars, destruction, target, attack slot, and result notes.
- Calculate best result per enemy base, total stars, used and remaining attacks, and average destruction.
- Build a cleanup board for unhit and non-tripled bases.
- Generate assignment, cleanup, and remaining-attack messages split at the 128-character clan-chat limit.
- Archive, reopen, and delete local war records.

War information is entered manually. Official API synchronization is not connected yet.

### CWL Bonus Tracker

- Create and retain multiple CWL seasons.
- Select players from the clan roster or add a temporary name.
- Enter points for seven war days.
- Treat a blank day as benched and `0` as a missed attack.
- Rank by total points, then average destruction percentage.
- Highlight the configured number of bonus positions.
- Generate 128-character bonus-result messages.
- Export an individual season as JSON.
- Archive a completed season to lock its roster, settings, scores, and destruction fields against accidental editing.

Daily points remain a leader-entered judgment. The app does not automatically decide whether a base was truly above or below a player's mirror.

## Data safety in 0.7 Alpha

All operational data is stored in the current browser using `localStorage`:

- village snapshots;
- upgrade plans;
- clan members;
- war history;
- CWL seasons;
- cached max-level summaries.

Clearing browser data, uninstalling the browser, or changing phones can remove it.

Version 0.7 added:

- a first-run local-storage warning;
- one automatic recovery checkpoint after saved changes;
- manual full-backup download;
- automatic-recovery download and restore;
- backup format version 4 with the application version recorded.

The automatic checkpoint is stored in the same browser. It protects against some accidental edits, but **not** against browser-data loss. Downloaded backups remain the portable recovery method.

## Publish and open on Android

For deployment to `50champs.com`, follow `DEPLOY_GITHUB_PAGES.md`. For direct local testing, use the single-file build:

```text
standalone.html
```

Download it, open the Files app, and open the file with Chrome. The main interface, parser, planner, War Room, and CWL module are contained in that file.

The max-level catalog may require internet access the first time a new TH/BH combination is calculated. Previously loaded summaries are cached locally.

For normal browser hosting, serve `index.html` through HTTPS or a local HTTP server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Deployment files added in 0.8 preview

- `CNAME` for `50champs.com`.
- `.nojekyll` for direct static publishing.
- `manifest.webmanifest` and 192/512 px icons for Android installation.
- `service-worker.js` for cached app-shell loading.
- `privacy.html`, `robots.txt`, and `404.html`.
- `DEPLOY_GITHUB_PAGES.md` with GitHub Pages, DNS, HTTPS, and Pixel 9 Pro steps.

Publishing this version does not create shared accounts. Data remains local to each browser.

## Release files

```text
index.html                  Canonical browser build
standalone.html             Same self-contained build for direct phone opening
README.md                   Current features, boundaries, and setup
CHANGELOG.md                Version history
docs/PRODUCT_SPEC.md        Long-term product requirements
supabase/schema.sql         Draft cloud database schema for a future server release
tests/release_check.py      Static release consistency checks
```

## Verification performed through 0.8 preview

- JavaScript syntax check with Node.js.
- Required DOM element and function checks.
- Consistency check between `index.html` and `standalone.html`.
- Backup payload and restore-path source checks.
- CWL archived-season lock source checks.
- Stale version and stale feature-description scan.

A complete production test matrix across multiple Android devices, iPhone/Safari, large 50-player datasets, storage quota limits, and upgrade migration is still pending.

## Not implemented yet

- Email or Google login.
- Shared cloud database and phone-to-phone synchronization.
- Real clan invitation links and server-enforced roles.
- Official Clash of Clans API integration.
- Automatic future upgrade cost, duration, and prerequisite lookup.
- Push, email, or Discord notifications.
- Russian interface localization.
- Server backups, audit logs, privacy controls, and account deletion.
- Verified mappings for every future game update.

## Fan-content notice

This is an unofficial fan project. It is not affiliated with, endorsed, sponsored, or specifically approved by Supercell. Supercell is not responsible for it.
