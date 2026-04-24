# Qualification

Qualification happens in the workflow, not a CRM. By the time a row hits
the Google Sheet it has already passed three gates: ICP, signal strength,
contact quality. Anything that lands in the Sheet is by definition
campaign-ready — a human should never need to qualify again before sending.

## The three gates

Gate 1, ICP fit (workflow step 6)

Drops anything outside 10-500 employees, non-AI-adjacent, or with no
discoverable domain. Uses Clay's industry classification when available,
falls back to a GPT-4-mini check on the company description.

Gate 2, signal strength (workflow step 6 scoring)

Applies the weighted ICP score from `icp.md`. Score below 40 gets dropped
silently; 40-59 goes to Tier 3 batch; 60+ continues.

Gate 3, contact quality (workflow step 7)

A row without a valid technical buyer's email is worthless. Contact search
fails about 30-40% of the time for smaller orgs — those rows get dropped
rather than written with a guessed email.

## Scoring mechanics

Score is computed in the n8n Code node using the formula from the
list-building skill's qualification workflow:

```
score = (framework_recency * 0.25)
      + (team_size_fit  * 0.20)
      + (ai_native      * 0.20)
      + (funding_growth * 0.15)
      + (geography      * 0.10)
      + (framework_fit  * 0.10)
```

Each dimension is 0-10. The multiplier pushes the total into 0-100.

Recency multiplier is applied on top:

```
final = score * recency_multiplier
```

where recency_multiplier is 1.5 for last-24h, 1.2 for last-7d, 1.0 for
last-14d, 0.7 for last-30d.

## What the Sheet looks like per row

Columns, in order:

`timestamp, company, domain, framework, repo_url, commit_date, contact_name,
contact_email, contact_title, icp_score, tier, subject, body, status`

`status` starts as `queued`. Human review flips it to `approved` or
`rejected`. Approved rows get picked up by the sending tool via a filtered
view.

## Why qualification is not outsourced to Clay

Clay can do the enrichment and the score, but the decision to reach out is
a judgment call that depends on three things Clay doesn't see:

- Is this account already in SearchApi's customer list?
- Did we touch this account in the last 90 days?
- Does the copy actually make sense for what this company builds?

The workflow checks the first two against the Google Sheet state. The
third is the 5-minute human review. Everything else runs automated.

## Re-scoring cadence

Dropped accounts get re-scored when they reappear with a new signal —
a different framework import, a funding announcement, or a new hire on the
ML team. The dedup layer in the workflow uses a 90-day cooldown rather
than a permanent block, so re-entry is automatic.

## Benchmarks to track

Per the signal-sourcer skill:

- Reply rate on 60+ scores: expect 18-22% (single-signal)
- Reply rate on 80+ scores with multiplier: expect 35-40% (multi-signal)
- Close rate on replies: 10-20% typical for dev-tool outbound

If reply rate is below 15% after 200 sends, the bottleneck is copy,
not targeting. If it's above 25%, the bottleneck is sending volume.
