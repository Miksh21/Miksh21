# 04 — AI-ANK / Na2SQL (LlamaIndex)

**Source repo:** https://github.com/AI-ANK/Na2SQL
**Framework:** LlamaIndex
**Detected import:** `from llama_index.core import` in `app.py`
**Repo description:** "Welcome to the Natural Language to SQL demo project using LlamaIndex! This application is designed to demonstrate the innovative use of Large Language Models (LLMs) in translating natural language queries into SQL queries, and fetching meaningful insights from a database."
**Persona match:** Primary target — individual maintainer
**ICP score (illustrative):** 58 (Tier 3)

---

**To:** Ankush
**Subject:** serp fallback

Hi Ankush,

Na2SQL ships the happy path for NL → SQL on a known schema. The usual
follow-up question from users once that works is "what about data that's
not in the DB yet?" — which is where a web-grounded fallback ends up on
the roadmap.

SearchApi is a LlamaIndex-compatible retriever for Google, Bing, Maps,
YouTube. Two lines to wire in, used by Anthropic and Scale. Good fit for
the "I asked and it wasn't in the warehouse" case.

Worth a look as the second retriever?

— Jan @ SearchApi
