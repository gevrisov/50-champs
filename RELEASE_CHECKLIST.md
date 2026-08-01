# 0.7 Alpha release checklist

## Passed

- [x] `index.html` and `standalone.html` are byte-identical.
- [x] JavaScript passes `node --check`.
- [x] HTML IDs are unique.
- [x] JavaScript ID selectors resolve to existing elements.
- [x] Upgrade Planner is present in the canonical build.
- [x] Full local War Room is present in the canonical build.
- [x] CWL Bonus Tracker is present in the canonical build.
- [x] Archived CWL seasons render as read-only.
- [x] Manual backup and restore use the shared version-4 payload.
- [x] Automatic recovery controls and local-data warning are present.
- [x] README and changelog describe the actual build.

## Required during clan alpha

- [ ] Test direct opening on the owner's Google Pixel.
- [ ] Import the owner's full real village export.
- [ ] Create a real 15v15 or 30v30 War Room record.
- [ ] Enter one complete CWL day and verify bonus ranking.
- [ ] Download a backup, clear test data, and restore it on-device.
- [ ] Test a large roster and long war history for storage limits.

## Blockers for public 1.0

- [ ] Authentication and server-enforced roles.
- [ ] Shared cloud synchronization.
- [ ] Server backups and audit history.
- [ ] Privacy policy and user-data deletion.
- [ ] Official Clash API integration.
- [ ] Cross-device Android and iPhone test matrix.
