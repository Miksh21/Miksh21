# Setup

Ten minutes on a fresh n8n instance. Assumes you have n8n running (self-hosted
or cloud) and access to the four external services.

## Prerequisites

- n8n 1.60+ (tested on 1.76). Self-hosted or cloud.
- GitHub account with a Personal Access Token (public repo scope is enough).
- Anthropic API key with access to `claude-opus-4-6` (any Opus 4.x works).
- Google account with Sheets enabled.
- Clay account with an API key (optional — workflow runs without it).

## Step 1. Create the Google Sheet

1. Create a new Google Sheet named `SearchApi Outbound Leads`.
2. Rename the first tab to `Leads`.
3. Paste this header row into row 1:
   ```
   timestamp	company	domain	framework	repo_url	commit_date	contact_name	contact_email	contact_title	icp_score	tier	subject	body	status	org_login
   ```
4. Copy the Sheet ID from the URL (`docs.google.com/spreadsheets/d/<THIS_PART>/edit`).

## Step 2. Import the workflow

1. In n8n, go to **Workflows → Import from File**.
2. Upload `workflow/github-signal-outbound.json`.
3. Save the workflow. Don't activate yet.

## Step 3. Add credentials

Four credentials are referenced. Create each once, then open each node that
uses it and select the matching credential.

### GitHub PAT
- Type: **Header Auth**
- Name: `GitHub PAT`
- Header name: `Authorization`
- Header value: `Bearer ghp_xxx` (your GitHub PAT with `public_repo` scope)
- Used by: `GitHub Code Search`, `Fetch Org Metadata`

### Anthropic API
- Type: **Header Auth**
- Name: `Anthropic API`
- Header name: `x-api-key`
- Header value: `sk-ant-api03-xxx`
- Used by: `Claude Generate Email`

### Clay API (optional)
- Type: **Header Auth**
- Name: `Clay API`
- Header name: `Authorization`
- Header value: `Bearer <your Clay API key>`
- Used by: `Clay Enrich Company`, `Clay Find Person`
- Skip if not using Clay. Workflow still runs with GitHub-only data and
  writes rows without a contact email (which get filtered out).

### Google Sheets OAuth2
- Type: **Google Sheets OAuth2 API**
- Name: `Google Sheets`
- Follow n8n's OAuth flow to authorize access.
- Used by: `Read Contacted Orgs`, `Append Qualified Lead`

## Step 4. Set environment variables

In n8n, go to **Settings → Environment Variables** (or set them on the
hosting machine if self-hosted):

| Variable | Value |
|---|---|
| `GOOGLE_SHEET_ID` | The ID from step 1 |
| `CLAY_ENABLED` | `true` or `false` |
| `CLAY_ENRICH_COMPANY_ENDPOINT` | Your Clay company-enrichment webhook URL |
| `CLAY_FIND_PERSON_ENDPOINT` | Your Clay person-search webhook URL |
| `SENDER_NAME` | Your name (goes in the email signature) |
| `SENDER_COMPANY` | `SearchApi` |

If `CLAY_ENABLED=false`, the Clay endpoints aren't called — the downstream
Clay-dependent nodes still run but return empty, and rows without a contact
email get filtered out silently.

## Step 5. Test run

1. Open the workflow.
2. Click **Execute Workflow** (runs once, ignoring the schedule).
3. Expect 10-30 rows written to the Sheet on first run. If zero rows land,
   check the execution log for errors in `GitHub Code Search` (rate limit?)
   or `Clay Find Person` (no contacts at these orgs — normal).

## Step 6. Activate

Flip the **Active** toggle. The schedule trigger will fire daily at 09:00 UTC.

## Ops notes

- GitHub code search is rate-limited to 30 requests/minute for authenticated
  requests. This workflow uses 6 requests per run — well under the limit.
- Anthropic rate limits depend on your tier. 20-30 `claude-opus` calls per
  run is typical; ensure your tier allows it.
- Clay credit usage: ~20-30 credits per run (one company enrichment + one
  person search per qualified lead). Budget accordingly.
- The dedup layer uses a 90-day cooldown. To reset, clear the `Leads` sheet
  or add a filter column.

## What to monitor

Track in a sibling `Runs` tab of the Sheet:
- Number of signals detected per framework
- Number of rows passing the dedup gate
- Number of rows passing ICP filter
- Number of rows with a contact email
- Reply rate on sent emails (tracked in your sending tool, not n8n)

The `Log Run Stats` node prints these to the n8n execution log — pipe them
to the Sheet via a second `Append Row` node if you want persistent history.
