# Publish 50 Champs with GitHub Pages

## 1. Create the repository

Create a **public** GitHub repository named `50champs` (or another name). Upload the files from this release folder to the repository root. Do not upload the outer folder as a single folder; `index.html` must be visible at the repository root.

Required web files include:

- `index.html`
- `manifest.webmanifest`
- `service-worker.js`
- `privacy.html`
- `CNAME`
- `.nojekyll`
- `icons/`

## 2. Enable GitHub Pages

Repository → **Settings** → **Pages** → **Build and deployment**:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**
- Save

GitHub first publishes the temporary address:

`https://YOUR-GITHUB-USERNAME.github.io/50champs/`

## 3. Verify the domain in your GitHub account

GitHub profile → **Settings** → **Pages** → **Add a domain** → enter `50champs.com`.

GitHub gives you a TXT record similar to:

- Type: `TXT`
- Host: `_github-pages-challenge-YOUR-GITHUB-USERNAME`
- Value: the exact value displayed by GitHub

Add it at your DNS provider and keep it permanently.

## 4. Add the custom domain to the repository

Repository → **Settings** → **Pages** → **Custom domain** → enter `50champs.com` → Save.

The included `CNAME` file already contains `50champs.com`.

## 5. DNS records

Remove conflicting A, AAAA, ALIAS, ANAME, and CNAME records for the same hosts, then add:

### Apex/root records

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

### WWW record

| Type | Host | Value |
|---|---|---|
| CNAME | www | YOUR-GITHUB-USERNAME.github.io |

The `www` CNAME must point directly to `YOUR-GITHUB-USERNAME.github.io`, without `/50champs`.

## 6. Enable HTTPS

When GitHub shows that the DNS check succeeded, Repository → **Settings** → **Pages** → enable **Enforce HTTPS**.

## 7. Test on Pixel 9 Pro

1. Open `https://50champs.com` in Chrome.
2. Import a test village JSON.
3. Switch through every module.
4. Close Chrome and reopen the site; confirm that local data remains.
5. Chrome menu → **Add to Home screen** or **Install app**.
6. Open the installed app and confirm standalone display.
7. Turn on airplane mode and reopen it; the cached app shell should load. Exact progress for a new TH/BH may still need internet access.
8. Download a full backup, delete a harmless test item, and restore the backup.

## Important limitation

Publishing makes the app accessible online, but it does **not** add accounts or synchronization. Every phone keeps a separate local copy until the server/Supabase phase is implemented.
