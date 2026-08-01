from pathlib import Path
import re
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
standalone = (root / 'standalone.html').read_text()
index = (root / 'index.html').read_text()
readme = (root / 'README.md').read_text()
changelog = (root / 'CHANGELOG.md').read_text()

assert standalone == index, 'index.html and standalone.html differ'
assert '0.8.0-preview' in standalone
assert '# 50 Champs — Clan Command Center 0.8 Deploy Preview' in readme
assert '## 0.8 Deploy Preview' in changelog
assert 'development build 0.3' not in readme
assert 'Full War Room with enemy lineup' not in readme
assert 'Upgrade costs, durations, prerequisites, and a builder queue planner.' not in readme

soup = BeautifulSoup(standalone, 'html.parser')
ids = [tag.get('id') for tag in soup.find_all(attrs={'id': True})]
assert len(ids) == len(set(ids)), 'duplicate HTML ids found'

script = '\n'.join(tag.string or tag.get_text() for tag in soup.find_all('script'))
queried = set(re.findall(r'document\.querySelector\("#([A-Za-z0-9_-]+)"\)', script))
missing = sorted(queried - set(ids))
assert not missing, f'JS queries missing IDs: {missing}'

required_ids = {
    'view-planner', 'war-workspace', 'view-cwl', 'local-data-banner',
    'auto-recovery-status', 'download-auto-recovery-button',
    'restore-auto-recovery-button', 'cwl-lock-note'
}
assert required_ids <= set(ids), f'missing required IDs: {sorted(required_ids - set(ids))}'

required_source = [
    'function buildBackupPayload',
    'function queueAutoRecoverySnapshot',
    'function saveAutoRecoverySnapshot',
    'function applyBackupData',
    'function isCwlSeasonLocked',
    'function requireEditableCwlSeason',
    'version: BACKUP_FORMAT_VERSION',
    'appVersion: APP_VERSION',
    '${locked ? "disabled" : ""}',
]
for marker in required_source:
    assert marker in script, f'missing source marker: {marker}'

print(f'PASS: {len(ids)} unique DOM ids; {len(queried)} JS id queries; builds identical.')
