# 02 — AstraBert / code-ragent (LlamaIndex) — FLAGGED

**Source repo:** https://github.com/AstraBert/code-ragent
**Framework:** LlamaIndex
**Detected import:** `from llama_index.core import` in `api.py`
**Enriched company:** Clelia (Astra) Bertelli — GitHub profile lists `@run-llama` as employer
**Enriched domain:** clelia.dev
**ICP score:** 83 → Tier 1 on scoring, **flagged before send**

---

## Why this was flagged

The maintainer works at `@run-llama`, the company behind LlamaIndex itself.
Cold-pitching a SERP API to a maintainer at the framework vendor is wrong
motion — it signals lazy research and burns the account. Human review
intercepted this row and routed it to partnerships instead.

The email below is what the workflow drafted before the flag fired. It is
not sent.

---

**Drafted (not sent):**

**To:** Clelia
**Subject:** llamaindex retriever

Hi Clelia,

code-ragent's whole point is grounding a codebase RAG with live web search —
that's exactly the kind of workflow where a stable SERP layer pays for
itself the first time a tutorial link 404s mid-demo.

SearchApi plugs into LlamaIndex as a retriever with Google, Bing, GitHub
code, and Stack Overflow results. Sub-second, no scraper maintenance. Used
by Anthropic and Scale.

Curious if that'd be useful as the web-side retriever in code-ragent?

— Jan @ SearchApi

---

**Workflow improvement needed:** add a deny-list check against
framework-vendor domains (`langchain.com`, `llamaindex.ai`,
`haystack.deepset.ai`, `crewai.com`, `autogen.microsoft.com`) before the
email-generation node. v1.1.
