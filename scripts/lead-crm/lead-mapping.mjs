/**
 * Maps an enriched candidate (from candidates.enriched.json) to a Notion page.
 *
 * The target database schema is matched by property *name* (case-insensitive)
 * so the exact Notion setup can vary. See README.md for the expected schema.
 * Only `Website` (url) and the title property are required; anything else that
 * is missing is skipped with a warning.
 */

// Expected property names → how to build the value. `type` is the Notion
// property type we require for that slot.
export const PROPERTY_SPEC = {
  website:      { names: ["Website", "Website URL", "URL"], type: "url", required: true },
  score:        { names: ["Score", "SiteAnalyser Score"], type: "number" },
  scorePct:     { names: ["Score %", "Score Percent", "Score Pct"], type: "number" },
  band:         { names: ["Band", "Opportunity"], type: "select" },
  needsUpgrade: { names: ["Needs Upgrade", "Needs Rebuild"], type: "checkbox" },
  reachable:    { names: ["Reachable", "Site Live"], type: "checkbox" },
  contact:      { names: ["Contact Method", "Contact"], type: "select" },
  reasons:      { names: ["Score Reasons", "Reasons", "Notes"], type: "rich_text" },
  discovered:   { names: ["Discovered", "Date Discovered", "First Seen"], type: "date" },
  lastScanned:  { names: ["Last Scanned", "Scanned", "Last Seen"], type: "date" },
  query:        { names: ["Search Query", "Query", "Keyword"], type: "rich_text" },
  status:       { names: ["Status", "Stage"], type: "select" }, // set on create only
  source:       { names: ["Source", "Lead Source"], type: "select" }, // set on create only
};

const CREATE_ONLY = new Set(["status", "source"]);

const trunc = (s, n) => (s == null ? "" : String(s).slice(0, n));

const V = {
  title: (s) => ({ title: [{ text: { content: trunc(s || "Untitled", 2000) } }] }),
  rich_text: (s) => ({ rich_text: [{ text: { content: trunc(s, 2000) } }] }),
  url: (s) => ({ url: s || null }),
  number: (n) => ({ number: typeof n === "number" && Number.isFinite(n) ? n : null }),
  select: (s) => (s ? { select: { name: trunc(String(s).replace(/,/g, " "), 100) } } : { select: null }),
  checkbox: (b) => ({ checkbox: !!b }),
  date: (iso) => (iso ? { date: { start: iso } } : { date: null }),
};

/** Light normalisation so repeat runs dedupe on the same string. */
export function normalizeUrlForDedupe(raw) {
  const s = String(raw || "").trim();
  try {
    const u = new URL(s);
    u.hash = "";
    u.protocol = u.protocol.toLowerCase();
    u.hostname = u.hostname.toLowerCase().replace(/^www\./, "");
    let out = u.toString();
    if (u.pathname === "/" && !u.search) out = out.replace(/\/$/, "");
    else out = out.replace(/\/(?=$)/, "");
    return out;
  } catch {
    return s.toLowerCase().replace(/\/+$/, "");
  }
}

function contactMethodLabel(analysis) {
  const c = (analysis.criteria || []).find((x) => x.key === "contact");
  if (!c) return "Unknown";
  if (c.points >= 2) return "Direct (email/phone)";
  if (c.points === 1) return "Form / link only";
  return "None found";
}

function reasonsText(analysis) {
  const lines = (analysis.criteria || []).map((c) => {
    const mark = c.notApplicable ? "–" : c.passed ? "✓" : "✗";
    return `${mark} ${c.label} (${c.points}/${c.maxPoints})${c.evidence ? ` — ${c.evidence}` : ""}`;
  });
  return [analysis.summary, "", ...lines].filter((x) => x !== undefined).join("\n");
}

/**
 * Resolve our field slots against a real database's properties.
 * @returns {{ titleProp: string, resolved: Record<string,{name,type}>, missing: string[], errors: string[] }}
 */
export function resolveSchema(database) {
  const props = database.properties || {};
  const entries = Object.entries(props);
  const titleEntry = entries.find(([, def]) => def.type === "title");
  const errors = [];
  if (!titleEntry) errors.push("database has no title property");

  const resolved = {};
  const missing = [];
  for (const [slot, spec] of Object.entries(PROPERTY_SPEC)) {
    const hit = entries.find(
      ([name, def]) =>
        def.type === spec.type &&
        spec.names.some((n) => n.toLowerCase() === name.toLowerCase()),
    );
    if (hit) {
      resolved[slot] = { name: hit[0], type: hit[1].type };
    } else {
      missing.push(`${spec.names[0]} (${spec.type})`);
      if (spec.required) errors.push(`required property missing: ${spec.names[0]} (${spec.type})`);
    }
  }

  return { titleProp: titleEntry ? titleEntry[0] : null, resolved, missing, errors };
}

/**
 * Build the Notion `properties` object for a candidate.
 * @param {object} candidate  enriched candidate (has .analysis)
 * @param {object} schema     from resolveSchema()
 * @param {object} [ctx]      { searchQuery, isCreate }
 */
export function buildProperties(candidate, schema, ctx = {}) {
  const a = candidate.analysis || {};
  const name =
    candidate.businessName ||
    candidate.title ||
    candidate.domain ||
    hostOf(candidate.url) ||
    candidate.url;

  const now = new Date().toISOString();
  const slotValues = {
    website: V.url(normalizeUrlForDedupe(candidate.url)),
    score: V.number(a.score),
    scorePct: V.number(typeof a.scorePct === "number" ? Math.round(a.scorePct * 100) : null),
    band: V.select(a.band),
    needsUpgrade: V.checkbox(a.needsUpgrade),
    reachable: V.checkbox(a.reachable),
    contact: V.select(contactMethodLabel(a)),
    reasons: V.rich_text(reasonsText(a)),
    discovered: V.date(ctx.isCreate ? now : null),
    lastScanned: V.date(a.analyzedAt || now),
    query: V.rich_text(ctx.searchQuery || ""),
    status: V.select("New"),
    source: V.select("Lead Discovery"),
  };

  const out = {};
  if (schema.titleProp) out[schema.titleProp] = V.title(name);
  for (const [slot, meta] of Object.entries(schema.resolved)) {
    if (!ctx.isCreate && CREATE_ONLY.has(slot)) continue; // don't overwrite Status on update
    if (slot === "discovered" && !ctx.isCreate) continue;
    const val = slotValues[slot];
    if (val !== undefined) out[meta.name] = val;
  }
  return out;
}

export function buildPageChildren(candidate) {
  const a = candidate.analysis || {};
  const children = [];
  if (a.summary) {
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: { rich_text: [{ text: { content: trunc(a.summary, 2000) } }] },
    });
  }
  for (const c of a.criteria || []) {
    const mark = c.notApplicable ? "–" : c.passed ? "✅" : "❌";
    children.push({
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            text: {
              content: trunc(
                `${mark} ${c.label} (${c.points}/${c.maxPoints})${c.evidence ? ` — ${c.evidence}` : ""}`,
                2000,
              ),
            },
          },
        ],
      },
    });
  }
  return children.slice(0, 100);
}

function hostOf(u) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
