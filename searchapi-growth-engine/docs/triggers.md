# Triggers

Each signal maps to one action. No "nurture with a newsletter" fallback —
either the signal is strong enough to warrant an email this week or the
account gets dropped. The goal is a tight signal-to-action loop, not a
marketing funnel.

## Trigger → action table

| Trigger | Score range | Action | SLA | Channel |
|---|---|---|---|---|
| Framework import + Tier 1 ICP + strength multiplier | 80+ | Email 1 from sequence, sent to primary persona | 24 hours from detection | Email |
| Framework import + Tier 1 ICP, no multiplier | 60-79 | Email 1, same sequence, lighter personalization | 48 hours | Email |
| Framework import + Tier 2 ICP | 40-59 | Email 1, templated, Monday batch send | Weekly batch | Email |
| Framework import + Tier 3 ICP or no contact found | <40 | Drop, log for future re-scoring | — | — |

Response SLA benchmarks are pulled from the signal-scoring skill — act-today
for >100 scores, act-this-week for 50-99, monitor-only below that.

## Why no phone or LinkedIn on the first touch

Three reasons:

1. The technical buyer persona hates sales calls and actively avoids LinkedIn
   connection spam. Email is the path of least resistance.
2. LinkedIn scraping and cold-connect is rate-limited and gets accounts
   flagged fast — unsustainable at 50+/week volume.
3. Phone is reserved for Tier 1 accounts that engaged with email. Cold
   dialing a founding engineer is guaranteed to burn the account.

If a Tier 1 account replies positively, the handoff is: email → calendar link →
call. LinkedIn becomes a backchannel for a second touch if Email 2 doesn't
land. Everything else stays async.

## Daily routine (9:00 UTC)

The workflow runs at 09:00 UTC. Within 30 minutes:

1. Workflow writes 10-30 new rows to the Google Sheet
2. Human review pass — 5 minutes scanning for obviously bad matches
   (enrichment got the wrong company, or the framework import is in a fork)
3. Approved rows are copied to the sending tool (Instantly, Smartlead,
   or whatever the team standardises on)
4. Scheduled to send at 14:00-16:00 local time in the prospect's timezone

This is one human touch per morning — the tight feedback loop between
detection and send is the whole point.

## Escalation paths

| Response | Action |
|---|---|
| Positive reply asking for a call | AE (or CEO, at SearchApi's size) takes the thread |
| Clarifying question about pricing / features | Reply same day with a link + a calendar offer |
| "Not the right person" | Ask for the right person's name, loop in, close the loop with the original contact |
| Out of office auto-reply | Log return date, re-queue Email 1 for that day |
| No reply by Day 3 | Email 2 fires automatically (see sequence.md) |
| No reply by Day 17 | Email 3 fires automatically, new subject |
| No reply after Email 3 | Drop for 90 days, then re-queue with a different angle |

## What triggers explicitly do not do

- No "Slack alert the AE" stage. At a one-person-engine scale, the alert is
  the row appearing in the Sheet.
- No automated calendar holds or personalized videos. That's v2 once reply
  data confirms the core flow works.
- No multi-sequence branching based on persona. One sequence, one copy
  framework, one CTA.
