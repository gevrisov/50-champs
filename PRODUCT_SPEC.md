# Clan Command Center — Product Specification

## Product objective

A mobile-first, multilingual fan companion for Clash of Clans that combines:

1. Village and Builder Base progress tracking from the in-game JSON export.
2. Active upgrade timers and confirmation through later snapshots.
3. Upgrade planning and history.
4. Multi-account and multi-clan membership.
5. War roster readiness, target assignments, cleanup coordination, and chat message generation.

The first public release is intended to contain the complete core workflow. Development may be modular, but the product should not be publicly presented as complete until the core modules are integrated.

## Non-goals

- Controlling the Clash of Clans client.
- Automating attacks or upgrades.
- Requesting Supercell ID credentials.
- Guaranteeing attack outcomes from progression data.
- Treating an expired timer as confirmed completion without a newer export.

## Core modules

### Identity and access

- Email and Google authentication.
- User profile, locale, and timezone.
- Multiple player accounts per user.
- Multiple clans per user/account.
- Leader, co-leader, and member roles with granular permissions.

### Village import

- Paste JSON or upload a `.json` file.
- Validate tag, timestamp, categories, and known item structure.
- Preserve the original source snapshot.
- Create normalized entities for querying and comparison.
- Maintain a versioned ID catalog.
- Place unknown IDs into an administrative review queue.

### Upgrade tracker

- Home Village and Builder Base views.
- Buildings, traps, walls, troops, spells, siege machines, heroes, pets, equipment, helpers, boosts, decorations, skins, and sceneries.
- Active timer calculation: `finish_at = export_timestamp + timer_seconds`.
- “Likely completed” state after expiration until confirmed by a new snapshot.
- Category completion based on a versioned game catalog.
- Separate offensive, defensive, hero, pet, equipment, wall, and Builder Base percentages.
- Rush indicators that disclose their formula.

### Progress history

- Immutable snapshots.
- Latest import comparison.
- Daily, weekly, monthly, and custom-range changes.
- Per-entity history.
- Activity and stale-data warnings.

### Upgrade planner

- Manual and recommendation modes.
- Builder, laboratory, Pet House, Blacksmith, and Builder Base queues.
- Costs, durations, prerequisites, and resource type.
- CW/CWL preparation mode.
- User-defined priority and notes.

### Clan dashboard

- Clan profile, rules, links, locale, and timezone.
- Roster and player account association.
- Freshness, hero availability, progress, rush, and technical readiness filters.
- Leadership-only access to private progression fields where configured.

### War room

- CW, CWL, and friendly wars.
- 5v5 through 50v50.
- Roster ordering and readiness snapshot.
- Enemy base list.
- First target, reserve target, second attack, and save-for-cleanup assignments.
- Player confirmation and assignment audit history.
- Manual result entry plus official API synchronization where available.
- Cleanup board and available attacker filtering.

### Message generator

- Clash clan chat chunks with a configurable character limit.
- Clan mail format.
- Discord format.
- Preserve each player's assignment on a single line when chunking.
- Templates owned by each clan.

### Notifications

- Upgrade likely completed.
- Builder/lab/pet/equipment slot availability.
- Snapshot stale.
- Assignment created or changed.
- First-attack deadline.
- Cleanup request.
- War start and end.

## Readiness model

The UI must distinguish:

- Progression/completion.
- Technical war readiness.
- Historical attack performance.
- Assignment discipline.

A readiness score must be decomposable into visible factors and must never be presented as a probability of a three-star attack.

## Privacy model

- A player owns their export and snapshots.
- The player chooses whether leadership may see full details or summary readiness only.
- Clan members do not automatically see one another's private progression.
- API keys remain server-side.
- Account and data deletion are supported.
- Data export is supported.
- Leadership actions are audited.

## Localization

Initial production languages:

- English
- Russian

All dates and timer deadlines use the user's timezone. Clan deadlines also display the clan timezone when different.

## Technical direction

- Frontend: Next.js App Router, TypeScript, mobile-first PWA.
- Database/auth/realtime: Supabase/PostgreSQL.
- Background notifications: scheduled server jobs or Supabase Edge Functions.
- Game API access: server-side only.
- Village parser: isolated, versioned TypeScript package with fixture tests.
- Game catalog: versioned records, never embedded only in UI code.

## Current prototype scope

The included static prototype already demonstrates:

- Browser-side JSON parsing.
- TH/BH detection for known IDs.
- Active timer calculation and live countdown.
- Local snapshot history and comparison.
- Local clan roster.
- War assignments.
- 128-character message chunking.

It intentionally labels category totals as a level score until the max-level catalog is connected. This avoids publishing a misleading completion percentage.
