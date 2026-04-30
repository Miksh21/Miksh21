# BESS signal-detection workflow — v0 demo

A working v0 of a Battery Energy Storage System (BESS) signal-detection pipeline:
**NESO TEC register → Supabase snapshot/diff → BESS filter → Clay enrichment →
TED + Google News confirmation → Slack alerts → Supabase audit log.**

This is a **5-minute Loom demo**, not production. No retries, no DLQ, no LLM step
(keyword scoring only).

## Repo layout

```
supabase/
  migrations/0001_init.sql           tables, indexes, RLS off
  seed.sql                           two simulated pulls so the diff returns rows on first run
  queries/diff_latest_vs_previous.sql  reference copy of the diff query embedded in n8n
n8n/
  bess_signal_workflow.json          import this into n8n
infra/
  docker-compose.yml                 spin n8n up locally if you can't connect to a hosted instance
scripts/
  run_pipeline.mjs                   standalone Node.js fallback (same logic, no n8n)
clay/
  BESS_developers.md                 Clay table schema + webhook contracts
slack/
  block_kit_template.json            standalone copy of the message template
.env.example                         all the credentials you need
```

## Setup order

### 1. Supabase

1. You already have a project: `lcyqbwjcchpssvghnvgz`.
2. **Rotate the service_role key** if it has been pasted anywhere. Project Settings → API → "Reset service_role key".
3. SQL editor → run `supabase/migrations/0001_init.sql`.
4. SQL editor → run `supabase/seed.sql` (gives you 12 rows across two pull dates so the diff returns 6 net-new rows, of which 3 BESS rows in window will fire to Slack).
5. Project Settings → Database → copy the **Connection string (URI)** into `SUPABASE_PG_CONN`.

### 2. n8n credentials

You said n8n is unreachable. Two paths:

**A. Self-host locally with docker-compose:**
```bash
cp .env.example .env       # fill in values
docker compose -f infra/docker-compose.yml up -d
open http://localhost:5678
```
Then in the n8n UI: **Credentials → New → Postgres** with the `SUPABASE_PG_CONN` from step 1. Note the credential ID and replace `REPLACE_WITH_POSTGRES_CRED_ID` in `n8n/bess_signal_workflow.json` before importing (or just re-bind the credential in the UI after importing — n8n will prompt).

**B. n8n Cloud (free trial)** — sign up at n8n.cloud, same credential setup. The trial covers 14 days, plenty for a Loom.

Then **Workflows → Import from File → `n8n/bess_signal_workflow.json`**. Open each Postgres node once and bind your credential. Save.

### 3. Clay table

In Clay:
1. New table called **BESS_developers**.
2. Sources → Add Source → **Webhook**. Copy the URL → `CLAY_WEBHOOK_URL`.
3. Add columns and enrichments per `clay/BESS_developers.md`.
4. Add an action **"Send to Webhook"** → URL = `{{ callback_url }}`. Trigger: when all four enrichment columns are non-null. Body = the outbound payload spec in the doc.

### 4. Slack incoming webhook

api.slack.com/apps → Create App → Incoming Webhooks → Add New Webhook to Workspace → pick a channel → copy URL into `SLACK_WEBHOOK_TIER1`. If you want a separate Tier 2 channel, repeat for `SLACK_WEBHOOK_TIER2`. Otherwise set both to the same URL.

### 5. TED API key

ted.europa.eu → Developer portal → register → free key → `TED_API_KEY`. (If you skip this, the Stage 5 TED call will return nothing and only Google News will contribute to the score — the demo still works.)

## Required environment variables

See `.env.example`. Copy it to `.env`, fill in the `REPLACE_WITH_*` sentinels.

```
SUPABASE_URL                  https://lcyqbwjcchpssvghnvgz.supabase.co
SUPABASE_SERVICE_KEY          rotate first, then paste here
SUPABASE_PG_CONN              postgres://... from Supabase dashboard
N8N_BASE_URL                  e.g. https://n8n.your-domain.com
CLAY_WEBHOOK_URL              from BESS_developers webhook source
SLACK_WEBHOOK_TIER1           hooks.slack.com/services/...
SLACK_WEBHOOK_TIER2           same or another channel
TED_API_KEY                   from TED developer portal
```

## How to demo this (Loom runbook, ~5 min)

The seed data is the script. Run it before recording so the diff has real rows.

1. **(0:00)** Start in Supabase → SQL editor. Show:
   ```sql
   select pull_date, count(*) from tec_snapshots group by 1 order by 1;
   ```
   Two pull dates, 6 + 12 rows. "Two weekly snapshots, last week and this week."
2. **(0:30)** Run the diff query (paste from `supabase/queries/diff_latest_vs_previous.sql`). 6 new rows. Point out three are BESS in the right date window.
3. **(1:00)** Switch to n8n canvas. Pan across all 8 sticky-note stages briefly. "Trigger, snapshot, filter, enrich, confirm, route, fire, log."
4. **(1:30)** Click **Manual Trigger → Execute Workflow**. Wait ~30s.
5. **(2:30)** Show the Clay table populating with 3 new rows + enrichment columns.
6. **(3:00)** Cut to Slack. 2-3 messages have arrived. Bold dev name, MW, source link buttons.
7. **(4:00)** Back to Supabase → `select * from fired_signals order by fired_at desc limit 5;`. Audit log row per Slack message.
8. **(4:30)** Close on the n8n canvas. "Cron fires this Mondays 06:00 UTC; everything else is the same."

If n8n isn't usable on the day, run the standalone script instead:
```bash
node scripts/run_pipeline.mjs
```
It hits the same Supabase + Slack + TED + Google News, prints stage-by-stage logs, and writes to `fired_signals`. The visual punch is lower (terminal not canvas) but the logic is identical.

## Deliberate non-features

- **No LLM judgment.** Keyword bag only.
- **No retries / DLQ.** Demo, not prod.
- **No row-level security.** Single-tenant service-role access.
- **Cap of 10 developers / run.** Keeps Clay credits ≤ ~$1/run. Excess gets re-evaluated next Monday since they remain "new vs previous pull" until Clay enriches them.
- **First-run safe diff.** If `tec_snapshots` only has one pull date, the diff returns every row — by design.
- **Phantom-project guard.** `confirmation_score == 0` drops the row. Many TEC entries are speculative; this is the whole point of Stages 5+6.
