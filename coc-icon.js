/* 50 Champs <coc-icon> — Clash of Clans icons from Supabase Storage (bucket coc-assets).
   Usage: <coc-icon type="hero" name="Barbarian King" size="32"></coc-icon>
   type: troop siege spell hero pet equipment building league league_tier builder_league
         war_league capital_league clan_label player_label clan_badge (plural forms work too)
   name: exact name from the Clash API ("Electro Titan"); for clan_badge use the clan tag.
   src:  optional fallback URL (e.g. badgeUrls.small of a clan that is not ours).
   No icon -> tidy initials tile in the site palette (light and graphite themes). */
(() => {
  if (customElements.get("coc-icon")) return;
  const BASE = "https://bqdobvylbmwraumyskwn.supabase.co/storage/v1/object/public/coc-assets/";
  const KEY = "coc-icon-manifest-v1";
  const TTL = 6 * 3600e3;
  const ALIAS = { heroes: "hero", troops: "troop", spells: "spell", pets: "pet", buildings: "building",
    leagues: "league", badge: "clan_badge", badges: "clan_badge", gear: "equipment", siege_machine: "siege",
    siege_machines: "siege", label: "clan_label" };

  let manifestPromise = null;
  const lower = new Map();
  function load() {
    if (manifestPromise) return manifestPromise;
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(KEY) || "null"); } catch {}
    const fresh = () => fetch(BASE + "manifest.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((m) => { try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), m })); } catch {} return m; });
    if (cached && Date.now() - cached.t < TTL) {
      manifestPromise = Promise.resolve(cached.m);
    } else {
      manifestPromise = fresh().catch(() => (cached ? cached.m : null));
    }
    return manifestPromise;
  }
  function find(m, type, name) {
    const group = m && m.items && m.items[type];
    if (!group) return null;
    if (group[name]) return group[name];
    if (!lower.has(type)) lower.set(type, new Map(Object.entries(group).map(([k, v]) => [k.toLowerCase(), v])));
    return lower.get(type).get(name.toLowerCase()) || null;
  }
  function initials(name) {
    const words = String(name || "").replace(/[^\p{L}\p{N}\s]/gu, "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  const css = document.createElement("style");
  css.textContent = `
coc-icon{display:inline-block;flex:none;vertical-align:middle;line-height:0;width:var(--coc-size,32px);height:var(--coc-size,32px)}
coc-icon img{width:100%;height:100%;object-fit:contain;display:block}
coc-icon .coc-ph{width:100%;height:100%;display:grid;place-items:center;border-radius:24%;
  background:rgba(var(--ink-rgb,24,29,37),.07);box-shadow:inset 0 0 0 1px rgba(var(--ink-rgb,24,29,37),.12);
  color:rgba(var(--ink-rgb,24,29,37),.62);font:700 calc(var(--coc-size,32px)*.36)/1 system-ui,-apple-system,"Segoe UI",sans-serif;
  letter-spacing:.02em;user-select:none}`;
  document.head.appendChild(css);

  class CocIcon extends HTMLElement {
    static get observedAttributes() { return ["type", "name", "size", "src"]; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    placeholder(name) {
      this.innerHTML = "";
      const d = document.createElement("span");
      d.className = "coc-ph";
      d.textContent = initials(name);
      this.appendChild(d);
    }
    async render() {
      const size = Math.max(8, Number(this.getAttribute("size")) || 32);
      const raw = String(this.getAttribute("type") || "").trim().toLowerCase();
      const type = ALIAS[raw] || raw;
      let name = String(this.getAttribute("name") || "").trim();
      if (type === "clan_badge") name = "#" + name.toUpperCase().replace(/^#/, "");
      this.style.setProperty("--coc-size", size + "px");
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", name);
      this.title = name;
      const ticket = (this._ticket = (this._ticket || 0) + 1);
      const m = await load();
      if (ticket !== this._ticket) return; // attributes changed meanwhile
      const hit = find(m, type, name);
      const base = (m && m.base) || BASE;
      const url = hit ? base + (size * (window.devicePixelRatio || 1) <= 72 ? hit[1] : hit[0]) + (hit[2] ? "?v=" + hit[2] : "")
        : this.getAttribute("src");
      if (!url) return this.placeholder(name);
      const img = document.createElement("img");
      img.alt = name;
      img.loading = "lazy";
      img.decoding = "async";
      img.width = img.height = size;
      img.onerror = () => this.placeholder(name);
      this.innerHTML = "";
      this.appendChild(img);
      img.src = url;
    }
  }
  customElements.define("coc-icon", CocIcon);
  window.cocIconHtml = (type, name, size = 32, src = "") => {
    const e = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    return `<coc-icon type="${e(type)}" name="${e(name)}" size="${Number(size) || 32}"${src ? ` src="${e(src)}"` : ""}></coc-icon>`;
  };
})();
