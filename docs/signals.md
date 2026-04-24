# Signals

The primary signal is a GitHub code commit that imports a supported LLM
framework. First-party, timestamped, attributable to a real org — closer in
strength to a demo request than to a Bombora topic surge. Benchmark from the
signal-sourcer skill: single signal = 18-22% reply rate, multi-signal (3+)
= 35-40%.

## Primary signal catalog

One workflow node per framework. Each query uses GitHub code search, filters
to Python (the dominant language across all six frameworks), and bounds to
repos pushed in the last 24 hours.

| Signal | Import pattern | Why it matters |
|---|---|---|
| LangChain | `from langchain_openai import` / `from langchain.agents import` | Largest ecosystem, highest volume of SERP grounding use cases |
| LlamaIndex | `from llama_index.core import` / `from llama_index.llms import` | RAG-heavy, strong web search need |
| LangGraph | `from langgraph.graph import` | Agent orchestration, usually wraps a web search tool |
| CrewAI | `from crewai import Agent` | Multi-agent research flows, search-heavy |
| Haystack | `from haystack import Pipeline` | RAG with retriever components, often plug in web search |
| AutoGen | `from autogen import` | Microsoft's agent framework, growing adoption |

LangChain and LlamaIndex together cover ~75% of the volume based on code-search
counts; LangGraph and CrewAI are the highest-intent because agent builders
almost always need a search tool wired in.

## Signal strength multipliers

A raw import alone is Tier 2. Stack it with one of these to move to Tier 1:

- **Import + repo description mentions "search" or "research"** → tool is the
  product, not a side dependency
- **Import + org has 3+ AI-related repos** → serious AI team, not a tutorial
- **Import + the committer's LinkedIn bio includes "AI" or "ML"** → the person
  who made the commit is the decision-maker
- **Import + the org posted a press release or funding announcement in the
  last 90 days** → active budget window

## Recency multiplier

Pulled from the signal-scoring skill:

| Commit age | Multiplier |
|---|---|
| Last 24 hours | 1.5x |
| Last 7 days | 1.2x |
| Last 14 days | 1.0x |
| Last 30 days | 0.7x |
| 30+ days | 0.3x (drop) |

The workflow runs daily so the default is 1.2-1.5x.

## Secondary signals (v2)

Not in the workflow yet but on the roadmap:

- npm/PyPI download spike for a specific SDK version → framework uptake
- Job posting for "AI Engineer" with framework named → hiring + tech signal stack
- Blog post using a framework's name → content-level intent
- Sponsorship or talk at a LangChain / LlamaIndex event → community-level signal

## Signal hygiene rules

- Never mention the signal source explicitly in copy — prospects are sensitive
  to "I see you committed X on GitHub yesterday" and it kills reply rates
- Dedup against a rolling 90-day window. Don't touch the same org twice
  even if they add new frameworks
- A fork without original commits is not a signal — the workflow checks for
  `fork: false` in the GitHub org metadata
- Personal accounts (type: "User" where the user is not a company founder)
  get filtered out before enrichment

## What this signal is not

This is a leading indicator, not a confirmed intent. Some teams import a
framework, decide to self-host search, and never buy a SERP API. The
conversion math only works because the cost per signal is near-zero and the
close rate on the ones that do convert is high.
