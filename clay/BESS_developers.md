# Clay table: `BESS_developers`

Inbound and outbound webhook contracts for the Stage 4 enrichment step.

---

## Table structure

| Column                   | Type     | Source                                                                 |
|--------------------------|----------|------------------------------------------------------------------------|
| `developer`              | text     | inbound from n8n (Stage 4 POST)                                        |
| `project_id`             | text     | inbound from n8n                                                       |
| `mw`                     | number   | inbound from n8n                                                       |
| `connection_date`        | date     | inbound from n8n                                                       |
| `plant_type`             | text     | inbound from n8n                                                       |
| `status`                 | text     | inbound from n8n                                                       |
| `domain`                 | text     | Clay enrichment: **Find Company Domain** (input: `developer`)         |
| `linkedin_url`           | text     | Clay enrichment: **Find LinkedIn Company URL** (input: `developer`)   |
| `recent_press`           | json[]   | Clay enrichment: **News Scraper** (input: `developer + " BESS"`)      |
| `hiring_signals`         | json[]   | Clay enrichment: **Find Job Postings** with title filter `BMS engineer OR site engineer OR project manager battery storage` (input: `domain`) |
| `other_tec_count`        | number   | Clay HTTP API column → Supabase REST: `GET {SUPABASE_URL}/rest/v1/tec_snapshots?developer=eq.{developer}&select=count` (header: `apikey: {SUPABASE_SERVICE_KEY}`, `Prefer: count=exact`); read `Content-Range` header |
| `enriched_at`            | timestamp| Clay formula: `now()`                                                  |
| `webhook_callback_status`| text     | set by Clay's "Send to Webhook" action                                |

The "Send to Webhook" action fires once **all enrichment columns are non-null** (configure: trigger = "Run after column updates" → all four enrichment columns).

---

## Inbound payload (n8n → Clay)

`POST {CLAY_WEBHOOK_URL}` (one POST per developer; n8n iterates after capping at 10 per run).

```json
{
  "developer":       "Field Energy",
  "project_id":      "TEC-2001",
  "mw":              330,
  "connection_date": "2028-04-01",
  "plant_type":      "Battery Storage",
  "status":          "Scoping",
  "callback_url":    "https://your-n8n.example.com/webhook/clay-callback"
}
```

Map each top-level field to the matching column in Clay's webhook source step. Store `callback_url` in a column named `callback_url` so the outbound step can read it.

---

## Outbound payload (Clay → n8n)

Clay's "Send to Webhook" action, URL = `{{callback_url}}`, method `POST`, body:

```json
{
  "developer":        "{{developer}}",
  "project_id":       "{{project_id}}",
  "mw":               {{mw}},
  "connection_date":  "{{connection_date}}",
  "plant_type":       "{{plant_type}}",
  "status":           "{{status}}",
  "domain":           "{{domain}}",
  "linkedin_url":     "{{linkedin_url}}",
  "recent_press":     {{recent_press}},
  "hiring_signals":   {{hiring_signals}},
  "other_tec_count":  {{other_tec_count}}
}
```

The n8n `Wait for Clay enriched` node resumes when this POST hits its webhook URL. The downstream `Score signals` Code node reads `developer`, `other_tec_count`, etc.

---

## Credit budget

- Find Company Domain: ~1 credit / dev
- Find LinkedIn URL: ~1 credit / dev
- News Scraper: ~2 credits / dev
- Find Job Postings: ~1 credit / dev
- Custom HTTP (Supabase count): 0 credits

≈ 5 credits × 10 developers = 50 credits/run, well under the $1 cap on a paid plan.
