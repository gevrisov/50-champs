# Changelog

## 0.10.0-web-alpha — 2026-08-01

### Added

- Clickable progress-category cards for Home Village and Builder Base.
- Original inline SVG icons for structures, traps, laboratory, heroes, equipment, pets, walls, Builder Base, and Star Laboratory.
- Responsive category detail sheet that opens as a bottom sheet on phones and a centered dialog on larger screens.
- Individual current levels for heroes, pets, equipment, troops, spells, siege machines, structures, traps, walls, Builder Base troops, and Builder Base heroes.
- Active-upgrade status, target level, remaining time, item counts, level distributions, and latest snapshot change inside category details.
- Laboratory filters for troops, spells, and siege machines.
- Structure filters for defenses, resources, army buildings, Town Hall or Builder Hall, support structures, and other buildings.
- Keyboard Escape and backdrop closing plus focus restoration for the detail dialog.

### Changed

- Replaced ambiguous progress lines with clear interactive cards containing an icon, item count, percentage, level-point total, and “View details” affordance.
- Updated dashboard and landing-page version labels to Web Alpha 0.10.

### Current boundary

- Per-object detail currently shows the level present in the village export. Exact maximum levels are still calculated at category level rather than attached to every individual object.

## 0.7.0-alpha — 2026-08-01

### Added

- First-run warning explaining that the alpha stores data only in the current browser.
- Debounced automatic recovery checkpoint after village, planner, roster, War Room, or CWL changes.
- Download and restore controls for the latest automatic recovery checkpoint.
- Shared backup builder used by manual backup and automatic recovery.
- Backup format version 4 with `appVersion`, creation reason, complete account snapshots, planner state, War Room history, and CWL seasons.
- Read-only locking for archived CWL seasons. Archived settings, roster, daily points, destruction values, and remove controls are disabled until the season is reopened.
- Visible Alpha 0.7 version labeling in the interface.

### Changed

- Promoted the complete self-contained 0.6 build to both `standalone.html` and the canonical `index.html`; the previous `index.html` was an older partial build.
- Updated import and dashboard copy to match the 24-snapshot limit and active max-level catalog.
- Rewrote README to reflect the actual Upgrade Planner, full War Room, CWL tracker, local-storage boundaries, and real release files.

### Safety boundary

- Automatic recovery is stored in the same browser and does not replace a downloaded backup.
- This remains a closed local alpha without authentication, cloud sync, or server-side recovery.

## 0.6.0 — 2026-07-30

### Added

- Integrated CWL Bonus Tracker as a first-class navigation module.
- Multiple persistent CWL seasons with active/archive status and season switching.
- Season roster selection from the existing clan roster plus custom player names.
- Seven daily point fields per player with blank-versus-missed-attack semantics.
- Average-destruction tiebreak from comma-separated attack percentages.
- Live ranking, bonus-position highlighting, roster completion metrics, and current leader.
- Bonus-result messages split at the 128-character Clash chat limit.
- Per-season JSON export containing the calculated ranking and bonus positions.
- CWL seasons and selected season included in full backup/restore.
- Pure CWL scoring and ranking tests plus a mobile interaction smoke test.

### Fixed

- Full backups now explicitly include complete War Room history and active-war selection.
- The mobile CWL table remains contained in its own horizontal scroller with a sticky player column.

### Current boundary

- Daily CWL points are entered manually.
- The app does not automatically decide whether a target counts as above or below mirror because roster position may not reflect true base difficulty.


## 0.5.0 — 2026-07-25

### Added

- Multiple persistent local war records for CW, CWL, and Friendly War.
- 5v5–50v50 enemy lineups with editable Town Hall and scout notes.
- Per-war participant selection from the local clan roster.
- Separate first- and second-attack assignments with backup/cleanup instructions.
- Attack result logging by player slot, target, stars, destruction, time, and note.
- Best-result calculation per enemy base and total war metrics.
- Cleanup board for unhit and non-tripled bases.
- Remaining-attack list restricted to selected war participants.
- Assignment, cleanup, and reminder messages split at the 128-character chat limit.
- War status management, archive/restore, deletion, and local history switching.
- Migration of the older single assignment board into an imported war record.
- Complete war history and active-war selection in local backup/restore version 3.
- Pure war-logic tests and a headless mobile interaction smoke test.

### Fixed

- Wide War Room tables no longer stretch the entire mobile page; they scroll inside their panels.
- The responsive app grid now uses a zero-minimum column so mobile controls remain inside the viewport.
- The new-war form collapses after a war is created, keeping the active board closer to the top.

### Current boundary

- War data is entered manually and stored only in the current browser.
- Results are not yet synchronized from the official Clash API.
- The War Room tracks operational planning and results; it does not predict whether an attacker will triple a base.

## 0.4.0 — 2026-07-25

### Added

- Per-account Upgrade Planner with persistent local queues.
- Worker-lane scheduling for Home builders, Laboratory, Pet House, Builder Base builders, Star Laboratory, and instant tasks.
- Imported active timers reserve worker capacity automatically.
- Configurable builder counts and optional manual time/cost boost.
- Future task form with level, duration, resource, cost, priority, and note fields.
- Calculated start/finish timeline, worker availability cards, resource totals, and queue completion date.
- Queue reordering, deletion, clearing, and JSON export.
- Planner data in full local backup and restore.
- Automated planner tests and a corrected single-file bundler.

### Changed

- Increased local snapshot retention wording to match the actual 24-snapshot limit.
- Rebuilt `standalone.html` without leftover ES-module syntax so it can run when opened directly on Android.
- Zero planned work is now displayed as `0m` instead of `Likely completed`.

### Accuracy boundary

- Future cost and duration are entered manually. The village export contains current levels and active timers, not a complete level-by-level future upgrade table.
- The planner calculates a schedule from the values entered; it does not yet validate prerequisites or resource availability.

## 0.3.0 — 2026-07-25

### Added

- Exact core progress by Town Hall and Builder Hall using a pinned max-level catalog.
- Category progress bars for structures, traps, laboratory, heroes, equipment, pets, walls, Star Laboratory, and Builder heroes.
- Cached max-level summaries with offline fallback.
- Full village inventory view with search and filters.
- Multi-account switching inside one browser.
- Local backup and restore for snapshots, roster, and assignments.
- Detailed entity-distribution comparisons between snapshots.
- Single-file `standalone.html` build for Android file opening.
- PWA icons and revised offline asset cache.
- Data provenance and accuracy-boundary documentation.

### Changed

- Replaced the initial shared ID dictionary with category-specific Home/Builder mappings.
- Increased retained snapshot count from 12 to 24 per account.
- Excluded unsupported categories from the combined progress percentage instead of estimating them.

### Known limitations

- Local-only storage; no account login or phone-to-phone synchronization.
- Some newly introduced export IDs can still appear as unknown names.
- No cost/time upgrade planner yet.
- War Room remains a manual local assignment board.

## 0.8 Deploy Preview — 2026-08-01

- Prepared the static alpha for `50champs.com` and GitHub Pages.
- Added a web app manifest, Android icons, and service-worker app-shell caching.
- Added `CNAME`, `.nojekyll`, `privacy.html`, `robots.txt`, and a root fallback page.
- Added an exact GitHub Pages, DNS, HTTPS, and Pixel 9 Pro deployment guide.
- Rebranded the hosted shell as **50 Champs** while retaining the Clan Command Center product name.
- No cloud synchronization or user authentication is included; operational data remains browser-local.
