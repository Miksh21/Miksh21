# ICP

The ideal SearchApi account is a 10-500 person team building an LLM-powered
product that needs real-time web data as a grounding layer. Anything smaller
is a hobby project; anything larger usually has in-house crawling
infrastructure. The sweet spot is teams past prototype and into production,
where a self-serve SERP API beats "build it yourself" on speed and cost.

## Tiering

The tier system follows the ColdIQ model from the list-building skill: Tier 1
goes white-glove, Tier 3 goes templated.

| Tier | Definition | Weekly capacity |
|---|---|---|
| 1 | 20-200 employees, AI-native product, visible LLM framework in public repos, seed–Series B, US/EU/Israel | 10-15 accounts, deep personalization, multi-thread |
| 2 | 200-500 employees or non-AI-native but shipping AI features, any LLM framework, Series B+ | 20-30 accounts, segment-level personalization |
| 3 | <20 employees but founder-led with traction, or enterprise subsidiaries | 10-20 accounts, templated with one variable |

## Hard filters (workflow drops these automatically)

- Fewer than 10 employees → likely side project, no budget
- More than 500 employees → custom sales motion, not the outbound lane
- No company domain discoverable from the GitHub org → can't route a message
- Repo is a fork with no commits in the last 30 days → not actively building
- Org is a university, government, or non-profit research lab → wrong buying motion
- Existing SearchApi customer or in active pipeline → dedup layer

## Scoring

Weighted, 1-10 per dimension, 100 max. Workflow writes the score to the Sheet.

| Dimension | Weight | What earns a 10 |
|---|---|---|
| Framework adoption recency | 25 | Import committed in the last 7 days |
| Team size fit | 20 | 30-150 employees |
| AI-native positioning | 20 | Blog, homepage, or repos make it obvious the product is AI-first |
| Funding or growth signal | 15 | Recent raise, hiring spike, or press mention in 90 days |
| Geographic fit | 10 | US, EU, Israel — timezones SearchApi already serves |
| Framework fit | 10 | LangChain, LlamaIndex, LangGraph = 10. AutoGen, Haystack, CrewAI = 8 |

Score 80+ → Tier 1. 60-79 → Tier 2. 40-59 → Tier 3. Below 40 → drop.

## Geography

English-first markets only for v1. Vilnius timezone overlaps cleanly with
EU and the Eastern US; West Coast and Israel work with a split sending window.
Asia and LATAM excluded until a localized sequence exists.

## What this ICP is NOT

- Enterprise AI platforms with procurement teams — wrong motion, needs field sales
- Consumer AI apps — they hit Google directly, not via SERP APIs
- Agencies building one-off client chatbots — low LTV, high churn
- Academic labs — publishing intent, not purchasing intent
