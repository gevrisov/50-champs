// Game icons (not in the Clash API) from the ClashKing asset pack -> Supabase Storage coc-assets/game/...
// Run: node scripts/sync-game-assets.ts   (Node 22.18+; needs env ASSETS_SYNC_SECRET)
// Pack: https://github.com/ClashKingInc/ClashKingAssets (credit shown in the site footer).

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const FN = process.env.ASSETS_FUNCTION_URL || "https://bqdobvylbmwraumyskwn.supabase.co/functions/v1/assets-sync";
const SECRET = process.env.ASSETS_SYNC_SECRET || "";
const PACK_DIR = process.env.PACK_DIR || ".cache/clashking";
const PACK_REPO = "https://github.com/ClashKingInc/ClashKingAssets";
const SAMPLE_TAGS = (process.env.SAMPLE_PLAYER_TAGS || "").split(/[\s,]+/).filter(Boolean);
const NAMES_FILE = process.env.NAMES_FILE || ""; // offline test: JSON in the shape of action "names"
const DRY_RUN = process.env.DRY_RUN === "1";
const A = join(PACK_DIR, "assets");

const SIEGE = new Set(["Wall Wrecker", "Battle Blimp", "Stone Slammer", "Siege Barracks", "Log Launcher",
  "Flame Flinger", "Battle Drill", "Troop Launcher"]);

// API name -> pack file (relative to assets/), for names the pack spells differently
const overridesFile = new URL("./asset-overrides.json", import.meta.url);
const OVERRIDES: Record<string, string> = existsSync(overridesFile) ? JSON.parse(readFileSync(overridesFile, "utf8")) : {};

const slug = (name: string) => name.toLowerCase().replace(/[.?’]/g, "").trim().replace(/\s+/g, "_");
const title = (s: string) => s.replace(/_/g, " ").replace(/(^|[\s-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
const ROMAN = ["", "I", "II", "III", "IV", "V"];

async function call(action: string, body: object = {}) {
  const r = await fetch(FN, {
    method: "POST",
    headers: { "content-type": "application/json", "x-cron-secret": SECRET },
    body: JSON.stringify({ action, ...body }),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${action}: HTTP ${r.status} ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

function git(args: string[], cwd?: string) {
  return execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "inherit"], env: { ...process.env, GIT_LFS_SKIP_SMUDGE: "1" } })
    .toString().trim();
}
function preparePack() {
  if (!existsSync(join(PACK_DIR, ".git"))) {
    mkdirSync(PACK_DIR, { recursive: true });
    git(["clone", "--depth", "1", "--filter=blob:none", "--sparse", PACK_REPO, PACK_DIR]);
  } else {
    git(["fetch", "--depth", "1", "origin", "HEAD"], PACK_DIR);
    git(["reset", "--hard", "FETCH_HEAD"], PACK_DIR);
  }
  git(["sparse-checkout", "set", "assets/heroes", "assets/troops", "assets/spells", "assets/pets", "assets/equipment",
    "assets/buildings/home-village", "assets/buildings/builder-base", "assets/leagues"], PACK_DIR);
  return git(["log", "-1", "--format=%h %cs"], PACK_DIR);
}

const ls = (dir: string) => (existsSync(dir) ? readdirSync(dir) : []);
const file = (rel: string) => (existsSync(join(A, rel)) ? rel : null);

// Where an icon for this name would sit in the pack, by category
function findInPack(name: string, category: string): string | null {
  if (OVERRIDES[name]) return file(OVERRIDES[name]);
  const s = slug(name);
  const tries: Record<string, string[]> = {
    heroes: [`heroes/${s}/icon.webp`],
    pets: [`pets/${s}/icon.webp`],
    troops: [`troops/${s}/icon.webp`],
    siege: [`troops/${s}/icon.webp`],
    spells: [`spells/${s}.webp`, `spells/${s}_spell.webp`],
    equipment: [`equipment/${s}.webp`],
  };
  for (const rel of tries[category] || []) if (file(rel)) return rel;
  return null;
}

type Entry = { type: string; category: string; external_id: string; name: string; src: string; confirmed: boolean };

function collect(names: any) {
  const entries: Entry[] = [];
  const missing: string[] = [];
  const used = new Set<string>();
  const add = (type: string, category: string, name: string, src: string | null, confirmed: boolean) => {
    if (!src) { missing.push(`${category}: ${name}`); return; }
    const id = slug(name).replace(/'/g, "");
    if (entries.some((e) => e.type === type && e.external_id === id)) return;
    entries.push({ type, category, external_id: id, name, src, confirmed });
    used.add(src);
  };

  // 1) exact names from real /players answers
  for (const x of names.heroes) add("hero", "heroes", x.name, findInPack(x.name, "heroes"), true);
  for (const x of names.spells) add("spell", "spells", x.name, findInPack(x.name, "spells"), true);
  for (const x of names.equipment) add("equipment", "equipment", x.name, findInPack(x.name, "equipment"), true);
  for (const x of names.troops) {
    const pet = findInPack(x.name, "pets");
    if (pet) add("pet", "pets", x.name, pet, true);
    else if (SIEGE.has(x.name)) add("siege", "siege", x.name, findInPack(x.name, "siege"), true);
    else add("troop", "troops", x.name, findInPack(x.name, "troops"), true);
  }

  // 2) the rest of the pack, with names built from file names (not seen in the sampled players)
  const extra: string[] = [];
  const rest = (type: string, category: string, rel: string, name: string) => {
    if (used.has(rel)) return;
    add(type, category, name, rel, false);
    extra.push(`${category}: ${name}`);
  };
  for (const d of ls(join(A, "heroes"))) if (file(`heroes/${d}/icon.webp`)) rest("hero", "heroes", `heroes/${d}/icon.webp`, title(d));
  for (const d of ls(join(A, "pets"))) if (file(`pets/${d}/icon.webp`)) rest("pet", "pets", `pets/${d}/icon.webp`, title(d));
  for (const d of ls(join(A, "troops"))) {
    const rel = `troops/${d}/icon.webp`;
    if (!file(rel)) continue;
    const name = title(d);
    rest(SIEGE.has(name) ? "siege" : "troop", SIEGE.has(name) ? "siege" : "troops", rel, name);
  }
  for (const f of ls(join(A, "spells"))) if (f.endsWith(".webp")) rest("spell", "spells", `spells/${f}`, title(f.replace(/\.webp$/, "")));
  for (const f of ls(join(A, "equipment"))) if (f.endsWith(".webp")) rest("equipment", "equipment", `equipment/${f}`, title(f.replace(/\.webp$/, "")));

  // 3) buildings: highest level of each; halls get one icon per level ("Town Hall 18")
  for (const village of ["home-village", "builder-base"]) {
    for (const d of ls(join(A, "buildings", village))) {
      const levels = ls(join(A, "buildings", village, d))
        .map((f) => /^level_(\d+)\.webp$/.exec(f)).filter(Boolean).map((m) => Number(m![1])).sort((a, b) => a - b);
      if (!levels.length) continue;
      const prefix = village === "builder-base" ? "bb_" : "";
      if (d === "town_hall" || d === "builder_hall") {
        for (const lv of levels) {
          const name = `${title(d)} ${lv}`;
          add("building", "buildings", name, `buildings/${village}/${d}/level_${lv}.webp`, false);
        }
      } else {
        const name = (village === "builder-base" ? "Builder Base " : "") + title(d);
        const e = `buildings/${village}/${d}/level_${levels.at(-1)}.webp`;
        if (!entries.some((x) => x.type === "building" && x.name === name)) {
          entries.push({ type: "building", category: "buildings", external_id: prefix + slug(d).replace(/'/g, ""), name, src: e, confirmed: false });
        }
      }
    }
  }

  // 4) league icons the API does not give (war, capital, builder leagues; ranked tiers)
  const LEAGUE_DIRS: [string, string, boolean][] = [
    ["cwl", "war_league", true], ["capital-leagues", "capital_league", true],
    ["builder-base", "builder_league", true], ["league-tier", "league_tier", false],
  ];
  for (const [dir, type, roman] of LEAGUE_DIRS) {
    for (const f of ls(join(A, "leagues", dir))) {
      const m = /^(.*?)(?:_(\d+))?\.png$/.exec(f);
      if (!m) continue;
      let name = title(m[1]);
      if (m[2]) name += " " + (roman && Number(m[2]) <= 5 ? ROMAN[Number(m[2])] : m[2]);
      entries.push({ type, category: "leagues", external_id: `${dir}_${f.replace(/\.png$/, "")}`, name,
        src: `leagues/${dir}/${f}`, confirmed: false });
    }
  }
  return { entries, missing, extra };
}

async function render(e: Entry) {
  const src = join(A, e.src);
  const out = async (px: number) => sharp(src).resize(px, px, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88, effort: 5 }).toBuffer();
  const big = await out(128), small = await out(64);
  const id = e.external_id.replace(/[^a-z0-9_-]/g, "");
  return {
    type: e.type, external_id: e.external_id, name: e.name,
    path: `game/${e.category}/${id}.webp`, path_small: `game/${e.category}/${id}-64.webp`,
    hash: createHash("sha1").update(big).update(small).digest("hex"),
    data: big.toString("base64"), data_small: small.toString("base64"),
  };
}

function report(lines: string[]) {
  const text = lines.join("\n");
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + "\n");
}

async function main() {
  if (!SECRET && !NAMES_FILE) throw new Error("Set ASSETS_SYNC_SECRET (same value as STATS_CRON_SECRET in Supabase).");
  const commit = existsSync(join(A, "heroes")) && process.env.SKIP_PACK_UPDATE === "1" ? "local copy" : preparePack();
  const names = NAMES_FILE ? JSON.parse(readFileSync(NAMES_FILE, "utf8")) : await call("names", { tags: SAMPLE_TAGS });
  const { entries, missing, extra } = collect(names);

  let written = 0;
  const prepared = [];
  for (const e of entries) prepared.push(await render(e));
  if (!DRY_RUN) {
    for (let i = 0; i < prepared.length; i += 25) {
      const r = await call("upload", { items: prepared.slice(i, i + 25) });
      written += r.written;
    }
    await call("manifest");
  }

  const byCat: Record<string, number> = {};
  for (const e of entries) byCat[e.category] = (byCat[e.category] || 0) + 1;
  report([
    `## Game assets sync${DRY_RUN ? " (dry run)" : ""}`,
    `Pack: ClashKingAssets ${commit}`,
    `Players sampled: ${(names.players || []).join("; ") || "none"}`,
    `Icons: ${entries.length} (${Object.entries(byCat).map(([k, v]) => `${k} ${v}`).join(", ")}); changed and uploaded: ${written}`,
    "",
    `### API names without an icon (${missing.length})`,
    ...(missing.length ? missing.map((m) => `- ${m}`) : ["- none"]),
    "",
    `Fix: add "API name": "path inside assets/" to scripts/asset-overrides.json, then run again.`,
    "",
    `<details><summary>Pack icons not seen in sampled players (${extra.length}); names guessed from file names</summary>\n\n${extra.join(", ")}\n</details>`,
  ]);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
    
