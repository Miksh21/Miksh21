# Personas

The workflow targets one persona per account: the technical buyer closest to
the framework commit. Multi-thread is not v1 — one signal, one contact,
one message.

## Primary target: Founding engineer / Head of AI

The person who committed the import or whose teammate did. Sole decision-maker
on dev-tool spend under $10K/month, which covers most SearchApi starter and
growth plans. Lives in the codebase, cares about latency and SDK ergonomics,
hates sales calls, will reply to a short email that names the repo.

- Seniority: IC to director — below-the-line in the ATL/BTL split
- Titles: Founding Engineer, Head of AI, ML Lead, Staff Engineer, Lead AI Engineer, Principal Engineer
- JTBD: ship an agent or RAG pipeline that works in production without burning a sprint on infrastructure
- Pain: crawling and SERP scraping is tedious, brittle, and legally messy. Rolling it yourself breaks under rate limits
- Success metric: latency, coverage, cost per call

Message pattern: BTL. 80-100 words, plain text, one soft CTA, names the repo,
skips the "hope you're having a great week" opener.

## Secondary target: CTO / VP Engineering

Triggered only when the company is 50+ employees AND the commit came from a
senior engineer, suggesting the hands-on lead has bought in. Strategic framing,
not tactical.

- Seniority: VP/C-level — above-the-line
- Titles: CTO, VP Engineering, Chief AI Officer
- JTBD: prove the AI bet is working and defensible
- Pain: infra spend is growing faster than revenue from AI features
- Success metric: infrastructure margin, time-to-ship

Message pattern: ATL. 2-3 sentences, outcome-framed, no technical jargon.

## Tertiary target: Founder / CEO (solo-dev teams only)

For sub-10-person teams where the CEO is also the person committing code.
Same BTL pattern as the primary target but subject line skews toward the
business outcome.

## Who the workflow explicitly does NOT target

- Recruiters, HR, finance, legal — never receive these emails even if they're
  surfaced by enrichment
- Sales and marketing titles — wrong buying motion, will route to procurement
- Generic "Software Engineer" with no seniority signal — too junior to own the call

## Contact-finding rules

Clay's person search runs against the enriched company with these title filters
in order of preference, taking the first match:

1. Founding Engineer OR Head of AI OR AI Lead
2. Staff/Principal/Lead + (Engineer OR ML OR AI)
3. CTO OR VP Engineering
4. Founder OR CEO (only if company under 10 employees)

No match → skip the account. Don't default to the first engineer listed.
