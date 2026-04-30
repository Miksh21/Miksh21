#!/usr/bin/env node
// BESS signal-detection pipeline — standalone fallback for when n8n isn't running.
// Same 8 stages, same logic, same Supabase tables, same Slack webhook.
// Usage:  node scripts/run_pipeline.mjs            (uses live NESO + seed)
//         node scripts/run_pipeline.mjs --seed     (skips NESO, runs against seed only)
//         node scripts/run_pipeline.mjs --dry      (no Slack, no DB writes)

import { readFileSync } from 'node:fs';
import { argv, env, exit } from 'node:process';

const FLAGS = new Set(argv.slice(2));
const DRY = FLAGS.has('--dry');
const SEED_ONLY = FLAGS.has('--seed');

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
for (const k of required) {
  if (!env[k]) { console.error(`missing env: ${k}`); exit(1); }
}

const SUPA = env.SUPABASE_URL.replace(/\/$/, '');
const HEADERS_DB = {
  apikey: env.SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
};

async function rpc(path, init = {}) {
  const r = await fetch(`${SUPA}${path}`, { ...init, headers: { ...HEADERS_DB, ...(init.headers || {}) } });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

// ──────────── Stage 1: source ────────────
async function fetchTecRows() {
  if (SEED_ONLY) return [];
  const pkg = await fetch('https://api.neso.energy/api/3/action/datapackage_show?id=transmission-entry-capacity-tec-register').then(r => r.json());
  const resources = pkg?.result?.resources || pkg?.resources || [];
  const csv = resources.find(r => (r.format || '').toLowerCase() === 'csv') || resources[0];
  if (!csv?.path) throw new Error('no csv resource in datapackage');
  const text = await fetch(csv.path).then(r => r.text());
  return parseCsv(text);
}

function parseCsv(text) {
  const rows = [];
  let i = 0, field = '', row = [], inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i+1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQ = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows.shift().map(h => h.trim());
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  const idx = name => header.findIndex(h => norm(h) === norm(name));
  const pick = names => names.map(idx).find(i => i >= 0);
  const projectIdx = pick(['ProjectName', 'ProjectRef', 'CustomerName']);
  const developerIdx = pick(['Customer', 'CustomerName', 'Company', 'Developer']);
  const plantIdx = pick(['PlantType', 'Technology']);
  const mwIdx = pick(['MWConnected', 'MW', 'CapacityMW', 'GenerationCapacityMW']);
  const connIdx = pick(['ConnectionDate', 'CompletionDate']);
  const statusIdx = pick(['Status', 'ProjectStatus']);
  const pull = new Date().toISOString();
  return rows.filter(r => r.some(v => v && v.trim())).map((r, n) => ({
    pull_date: pull,
    project_id: (projectIdx >= 0 ? r[projectIdx] : `row-${n}`) || `row-${n}`,
    developer: developerIdx >= 0 ? r[developerIdx] : null,
    plant_type: plantIdx >= 0 ? r[plantIdx] : null,
    mw: mwIdx >= 0 ? Number(String(r[mwIdx]).replace(/[^0-9.-]/g, '')) || null : null,
    connection_date: connIdx >= 0 ? r[connIdx] : null,
    status: statusIdx >= 0 ? r[statusIdx] : null,
    raw: Object.fromEntries(header.map((h, i) => [h, r[i] ?? '']))
  }));
}

// ──────────── Stage 2: snapshot + diff ────────────
async function snapshotAndDiff(rows) {
  if (rows.length && !DRY) {
    for (let i = 0; i < rows.length; i += 500) {
      await rpc('/rest/v1/tec_snapshots?on_conflict=pull_date,project_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify(rows.slice(i, i + 500))
      });
    }
  }
  const sql = `with pulls as (select distinct pull_date from tec_snapshots order by pull_date desc limit 2),
  latest as (select * from tec_snapshots where pull_date = (select max(pull_date) from pulls)),
  prev   as (select * from tec_snapshots where pull_date = (select min(pull_date) from pulls where pull_date < (select max(pull_date) from pulls)))
  select l.* from latest l left join prev p on p.project_id = l.project_id where p.project_id is null`;
  // PostgREST has no SQL endpoint — use RPC. Define `tec_diff()` once in Supabase, or fall back to two REST calls:
  const { latest, previous } = await fetchLatestTwoPulls();
  const prevIds = new Set(previous.map(r => r.project_id));
  return latest.filter(r => !prevIds.has(r.project_id));
}

async function fetchLatestTwoPulls() {
  const pulls = await rpc('/rest/v1/tec_snapshots?select=pull_date&order=pull_date.desc');
  const distinct = [...new Set(pulls.map(p => p.pull_date))].slice(0, 2);
  if (!distinct.length) return { latest: [], previous: [] };
  const latest = await rpc(`/rest/v1/tec_snapshots?pull_date=eq.${encodeURIComponent(distinct[0])}`);
  const previous = distinct[1] ? await rpc(`/rest/v1/tec_snapshots?pull_date=eq.${encodeURIComponent(distinct[1])}`) : [];
  return { latest, previous };
}

// ──────────── Stage 3: filter ────────────
const BESS = /battery|storage|bess/i;
const FROM = new Date('2027-01-01').getTime();
const TO   = new Date('2035-12-31').getTime();
function filterBess(rows) {
  return rows.filter(r => {
    if (!BESS.test(r.plant_type || '')) return false;
    if (!r.connection_date) return false;
    const t = new Date(r.connection_date).getTime();
    return Number.isFinite(t) && t >= FROM && t <= TO;
  }).sort((a, b) => (Number(b.mw) || 0) - (Number(a.mw) || 0)).slice(0, 10);
}

// ──────────── Stage 4: enrich (Clay) ────────────
async function enrichOne(row) {
  if (!env.CLAY_WEBHOOK_URL || env.CLAY_WEBHOOK_URL.includes('REPLACE_WITH')) {
    return { ...row, domain: null, linkedin: null, news: [], hiring: [], other_tec_count: 0 };
  }
  await fetch(env.CLAY_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...row, callback_url: `${env.N8N_BASE_URL || ''}/webhook/clay-callback` })
  }).catch(() => {});
  // Standalone script can't wait for Clay's async webhook; fall back to no-enrichment.
  return { ...row, domain: null, linkedin: null, news: [], hiring: [], other_tec_count: 0 };
}

// ──────────── Stage 5: confirm ────────────
const KEYWORDS = ['BESS','battery storage','MWh','construction','groundbreaking','commissioning','energization','grid connection','planning permission'];
async function score(row) {
  const dev = row.developer || '';
  const sources = [];
  let s = 0;

  if (env.TED_API_KEY && !env.TED_API_KEY.includes('REPLACE_WITH')) {
    try {
      const u = new URL('https://api.ted.europa.eu/v3/notices/search');
      u.searchParams.set('query', `buyer-name="${dev}" AND classification-cpv IN (09310000, 31682500)`);
      u.searchParams.set('limit', '10');
      const r = await fetch(u, { headers: { Authorization: `Bearer ${env.TED_API_KEY}` } });
      if (r.ok) {
        const j = await r.json();
        const hits = j.notices || j.results || [];
        for (const h of hits) {
          const url = h.uri || h.url || h.publicationUri || '';
          const snippet = (h.title || h['title-proc'] || '').toString().slice(0, 240);
          sources.push({ type: 'ted', url, snippet });
          s += 2;
          for (const k of KEYWORDS) if (snippet.toLowerCase().includes(k.toLowerCase())) s += 1;
        }
      }
    } catch {}
  }

  try {
    const q = encodeURIComponent(`${dev} battery storage OR BESS`);
    const text = await fetch(`https://news.google.com/rss/search?q=${q}&hl=en-GB&gl=GB&ceid=GB:en`).then(r => r.text());
    const items = (text.match(/<item[\s\S]*?<\/item>/g) || []).slice(0, 5);
    for (const it of items) {
      const title = (it.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '').replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      const link  = (it.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '').trim();
      if (!title) continue;
      sources.push({ type: 'news', url: link, snippet: title });
      s += 1;
      for (const k of KEYWORDS) if (title.toLowerCase().includes(k.toLowerCase())) s += 1;
    }
  } catch {}

  return { ...row, confirmation_score: s, confirmation_sources: sources, news_hits: sources.filter(x => x.type === 'news').length, ted_hits: sources.filter(x => x.type === 'ted').length };
}

// ──────────── Stages 6-8: route, slack, log ────────────
function tierOf(r) {
  if (r.confirmation_score >= 4 || ((r.other_tec_count || 0) > 1 && r.news_hits > 0)) return 'tier1';
  if (r.confirmation_score >= 1) return 'tier2';
  return null;
}

function blockKit(r) {
  const tier = r.tier;
  return {
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `${r.developer} — ${tier === 'tier1' ? 'TIER 1' : 'TIER 2'}` } },
      { type: 'section', fields: [
        { type: 'mrkdwn', text: `*Developer*\n*${r.developer}*` },
        { type: 'mrkdwn', text: `*MW*\n${r.mw} MW` },
        { type: 'mrkdwn', text: `*Connection date*\n${r.connection_date}` },
        { type: 'mrkdwn', text: `*Tier*\n${tier} (score ${r.confirmation_score})` }
      ]},
      { type: 'divider' },
      { type: 'actions', elements: (r.confirmation_sources || []).slice(0, 3).map((s, i) => ({
        type: 'button',
        text: { type: 'plain_text', text: `${(s.type || 'src').toUpperCase()} ${i+1}` },
        url: s.url || 'https://example.com',
        value: `src_${i}`
      }))}
    ]
  };
}

async function send(r) {
  const url = r.tier === 'tier1' ? env.SLACK_WEBHOOK_TIER1 : (env.SLACK_WEBHOOK_TIER2 || env.SLACK_WEBHOOK_TIER1);
  if (!url || url.includes('REPLACE_WITH') || DRY) {
    console.log(`[dry] would send to ${r.tier}:`, r.developer, r.confirmation_score);
    return null;
  }
  const r2 = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(blockKit(r)) });
  return r2.headers.get('x-slack-req-id') || null;
}

async function log(r, ts) {
  if (DRY) return;
  await rpc('/rest/v1/fired_signals', {
    method: 'POST',
    body: JSON.stringify([{
      developer: r.developer, tier: r.tier, confirmation_score: r.confirmation_score,
      confirmation_sources: r.confirmation_sources, tec_project_id: r.project_id, slack_message_ts: ts
    }])
  });
}

// ──────────── orchestrate ────────────
(async () => {
  console.log('Stage 1: fetching NESO TEC');
  const fetched = await fetchTecRows();
  console.log(`  ${fetched.length} rows`);

  console.log('Stage 2: snapshot + diff');
  const newRows = await snapshotAndDiff(fetched);
  console.log(`  ${newRows.length} new vs previous pull`);

  console.log('Stage 3: filter BESS + window + cap 10');
  const candidates = filterBess(newRows);
  console.log(`  ${candidates.length} candidates: ${candidates.map(r => r.developer).join(', ')}`);

  console.log('Stage 4: enrich via Clay');
  const enriched = [];
  for (const c of candidates) enriched.push(await enrichOne(c));

  console.log('Stage 5: confirm via TED + Google News');
  const scored = [];
  for (const e of enriched) scored.push(await score(e));

  console.log('Stages 6-8: route + Slack + log');
  for (const s of scored) {
    const tier = tierOf(s);
    if (!tier) { console.log(`  drop: ${s.developer} score=${s.confirmation_score}`); continue; }
    const row = { ...s, tier };
    const ts = await send(row);
    await log(row, ts);
    console.log(`  ${tier}: ${s.developer} score=${s.confirmation_score} sources=${s.confirmation_sources.length}`);
  }
  console.log('done.');
})().catch(err => { console.error(err); exit(1); });
