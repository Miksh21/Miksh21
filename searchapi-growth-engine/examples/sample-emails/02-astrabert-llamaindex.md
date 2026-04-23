# 02 — AstraBert / code-ragent (LlamaIndex)

**Source repo:** https://github.com/AstraBert/code-ragent
**Framework:** LlamaIndex
**Detected import:** `from llama_index.core import` in `api.py`
**Repo description:** "Build a RAG agent for your codebase (+ websearch-grounded!)"
**Persona match:** Primary target — solo maintainer is the builder
**ICP score (illustrative):** 68

---

**To:** Clelia
**Subject:** websearch grounding

Hi Clelia,

code-ragent's whole point is grounding a codebase RAG with live web search —
that's exactly the kind of workflow where a stable SERP layer pays for
itself the first time a tutorial link 404s mid-demo.

SearchApi plugs into LlamaIndex as a retriever with Google, Bing, GitHub
code, and Stack Overflow results. Sub-second, no scraper maintenance. Used
by Anthropic and Scale for similar setups.

Curious if that'd be useful as the web-side retriever in code-ragent?

— Jan @ SearchApi
