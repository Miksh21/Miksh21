# 03 — David Padbury / claude-stonks-agent (LangGraph)

**Source repo:** https://github.com/davidpadbury/claude-stonks-agent
**Framework:** LangGraph
**Detected import:** `from langgraph.graph import` in `ui.py`
**Repo description:** "Example langchain/langgraph agent using Claude v2.1 on AWS bedrock"
**Persona match:** Primary target — repo owner is the builder
**ICP score (illustrative):** 61

---

**To:** David
**Subject:** fresh pages

Hi David,

claude-stonks-agent on LangGraph + Bedrock is a clean stack, but the
financial data side is where most hobby-to-production jumps fall over —
Yahoo scraping breaks, news feeds go stale, and the agent starts citing
2022 prices.

SearchApi gives LangGraph agents a Google News + Google Finance tool with
fresh data and no scraper work. Anthropic and Scale use it behind agent
flows like this one.

Worth plugging in as the news / fundamentals retriever?

— Jan @ SearchApi
