from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
required = [
    'index.html','standalone.html','manifest.webmanifest','service-worker.js',
    'privacy.html','CNAME','.nojekyll','robots.txt','404.html',
    'icons/icon-192.png','icons/icon-512.png','DEPLOY_GITHUB_PAGES.md'
]
missing = [name for name in required if not (root / name).exists()]
assert not missing, f'Missing deployment files: {missing}'
assert (root/'CNAME').read_text().strip() == '50champs.com'
manifest = json.loads((root/'manifest.webmanifest').read_text())
assert manifest['start_url'] == './'
assert manifest['display'] == 'standalone'
html = (root/'index.html').read_text()
assert 'manifest.webmanifest' in html
assert 'service-worker.js?v=0.8.0' in html
assert not re.search(r'(?<!:)http://', html), 'Unexpected insecure HTTP reference in index.html'
assert (root/'index.html').read_bytes() == (root/'standalone.html').read_bytes()
print('Deployment checks passed.')
