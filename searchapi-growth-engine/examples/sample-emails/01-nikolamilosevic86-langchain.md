# 01 — Nikola Milošević / local-genAI-search (LangChain)

**Source repo:** https://github.com/nikolamilosevic86/local-genAI-search
**Framework:** LangChain
**Detected import:** `from langchain_openai import` in `api.py`
**Enriched company:** Nikola Milošević (individual, NLP/ML researcher)
**Enriched domain:** inspiratron.org
**ICP score:** 79 → **Tier 2, queued** (review note: downgrade to Tier 3, individual repo)

---

**To:** Nikola
**Subject:** langchain grounding

Hi Nikola,

local-genAI-search ties Llama 3 + Qdrant into a grounded search over local
files — nice shape. If you ever want to answer over the live web too, the
usual next step is wiring a SERP tool into the LangChain chain, and that's
where most teams lose a weekend to rate limits and HTML parsing.

SearchApi is a drop-in LangChain tool for Google, Bing, and YouTube results
with sub-second latency — it's what Anthropic and Scale use. Worth a look
as a secondary retriever alongside Qdrant?

— Jan @ SearchApi
