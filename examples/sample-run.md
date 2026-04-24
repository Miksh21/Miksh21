# Sample run — 2026-04-23

One daily run of the workflow against public GitHub data. Five leads surfaced,
three queued for send, one flagged for a different motion, one dropped at
the enrichment gate. Repo URLs, framework detections, and profile fields
are real; contact emails are placeholders where the GitHub profile does not
expose one.

## Run summary

| Metric | Value |
|---|---|
| Run time (UTC) | 2026-04-23 09:02 |
| Frameworks queried | LangChain, LlamaIndex, LangGraph, CrewAI, Haystack, AutoGen |
| Raw GitHub hits | 214 |
| Unique orgs after flatten | 58 |
| New after 90-day dedup | 5 |
| Passed domain extraction | 4 |
| Passed ICP score (≥40) | 4 |
| With contact email | 1 real, 3 pending Clay waterfall |
| Queued for send | 3 |
| Flagged | 1 |
| Dropped | 1 |

## The five leads

| # | Repo | Framework | Score | Tier | Status |
|---|---|---|---|---|---|
| 1 | nikolamilosevic86/local-genAI-search | LangChain | 79 | 2 | queued |
| 2 | AstraBert/code-ragent | LlamaIndex | 83 | 1 | flagged |
| 3 | davidpadbury/claude-stonks-agent | LangGraph | 65 | 2 | queued |
| 4 | AI-ANK/Na2SQL | LlamaIndex | — | — | dropped |
| 5 | agicto/ollama-agent-crewai-search | CrewAI | 52 | 3 | queued |

Full per-lead records with the drafted emails are in
[`sample-output.json`](sample-output.json). Email bodies also live as
standalone files in [`sample-emails/`](sample-emails/).

## Per-lead detail

### 1. nikolamilosevic86/local-genAI-search → queued, Tier 2

- **Signal:** `from langchain_openai import` in `api.py`, committed in
  the last 24h
- **Enrichment:** Nikola Milošević, NLP/ML researcher. Company field on GitHub
  is `Bayer Pharma R&D` but this is a personal repo — `inspiratron.org` blog
  is the relevant domain. Based in Berlin.
- **Score breakdown:** framework recency 10, team size 3 (individual),
  AI-native 10 (bio literally says ML), funding 5, geography 10 (EU),
  framework fit 10 → **79**
- **Action:** Queued Tier 2. Reviewer recommendation: downgrade to Tier 3
  — individual account, no budget signal, but worth a single templated
  email given a genuine LangChain adoption.

### 2. AstraBert/code-ragent → flagged

- **Signal:** `from llama_index.core import` in `api.py`
- **Enrichment:** Clelia (Astra) Bertelli. GitHub `company` field is
  `@run-llama`. She works at the LlamaIndex company.
- **Score breakdown:** 83 on raw scoring
- **Action:** **Flagged** before email generation. The workflow should not
  cold-pitch a SERP API to a maintainer at the framework vendor — wrong
  motion, and it signals poor research if it reaches her. Human review
  routes this to partnerships / integrations instead.
- **Lesson for the workflow:** add a check against a deny-list of
  framework-vendor domains (langchain.com, llamaindex.ai, haystack.deepset.ai,
  etc.) before the email node. Currently the flag came from human review;
  the workflow should catch it automatically.

### 3. davidpadbury/claude-stonks-agent → queued, Tier 2

- **Signal:** `from langgraph.graph import` in `ui.py`
- **Enrichment:** David Padbury, independent engineer based in Madison,
  Wisconsin. Blog `davidpadbury.com`. 76 public repos.
- **Score breakdown:** framework recency 10, team size 3, AI-native 5
  (no explicit AI bio), funding 5, geography 10 (US), framework fit 10 → **65**
- **Action:** Queued Tier 2. Individual project but an obvious
  SearchApi use case (financial-data agent needs fresh news). Templated
  send, no follow-up past Email 2 unless he engages.

### 4. AI-ANK/Na2SQL → dropped

- **Signal:** `from llama_index.core import` in `app.py`
- **Enrichment attempt:** GitHub profile has null `name`, null `bio`, empty
  `blog` field, null `email`. No discoverable domain.
- **Action:** **Dropped** at the Extract Domain step. Correct workflow
  behavior — no way to route an email, no company to research.
- **Lesson:** this is the ~30% of raw signals that can't be actioned at
  all. Documenting the drop publicly helps calibrate expectations on
  "signals detected" vs "leads sent" — the ratio is closer to 3:1 than 1:1.

### 5. agicto/ollama-agent-crewai-search → queued, Tier 3

- **Signal:** `from crewai import Agent` in `06.py`
- **Enrichment:** AGICTO, organization account with a public contact email
  (`agictolab@gmail.com`) and domain `agicto.com`. Chinese LLM-API
  aggregator — markets 1000+ models via a unified endpoint.
- **Score breakdown:** framework recency 10, team size 7 (org with 33 repos,
  plausible small company), AI-native 10, funding 5, geography 4 (CN, outside
  core ICP), framework fit 8 (CrewAI) → **52**
- **Action:** Queued Tier 3 with a templated send. They sell access to LLMs,
  which overlaps tangentially with SearchApi's use case (grounding LLM calls
  with SERP data). Reviewer could plausibly keep or drop — workflow defaults
  to send-and-see.

## What this run surfaces about the workflow

- **The domain-extraction gate is the single biggest drop point.** About
  30% of User-owned repos have no discoverable domain. Fixing this without
  fabricating data isn't possible — the workflow accepts the drop.
- **Framework-vendor employees slip through.** The AstraBert case shows the
  workflow surfaces people at the vendor's own company. Adding a deny-list
  of vendor email domains is a v1.1 improvement.
- **User-owned repos are over-scored by the team-size proxy.** The fallback
  `public_repos * 5` inflates the score for prolific individuals. Worth
  switching to Clay employee-count when available and skipping the
  proxy entirely for User accounts.
- **Real contact emails only come via Clay.** GitHub profiles rarely expose
  an email. With Clay off (`CLAY_ENABLED=false`), the workflow produces
  rows with `PENDING_WATERFALL_VERIFICATION` and the review step catches
  them. With Clay on, the same rows get real emails or get dropped.

## Reproducing this run

The exact GitHub code-search queries the workflow uses are in
[`docs/signals.md`](../docs/signals.md). You can run each one against the
GitHub API today and get a fresh batch — results will differ since GitHub
indexes new commits continuously.
