# 50 Champs — Web Preview 0.9

50 Champs is an unofficial browser-based clan management and village progress toolkit.

## Website structure

- `index.html` — public landing page
- `dashboard.html` — working local web dashboard
- `privacy.html` — privacy information
- `404.html` — not-found page

## Current dashboard modules

- Village JSON import and snapshots
- Home Village and Builder Base inventory
- Active upgrade timers
- Upgrade Planner
- Progress history
- Clan members
- War Room and cleanup board
- CWL Bonus Tracker
- Local backup and recovery

## Important alpha limitation

All operational data is stored in the visitor's browser. Different phones do not share data. Clearing browser storage removes local data unless a backup was downloaded.

## Deployment

Publish the files from the repository root with GitHub Pages. The public entry point is `index.html`; users open the tool through `dashboard.html`.

## Next development stage

Authentication, shared clan workspaces, roles, invitations, synchronization, and server backups.

This is an unofficial fan project and is not affiliated with or endorsed by Supercell.
