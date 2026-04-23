# 05 — agicto / ollama-agent-crewai-search (CrewAI)

**Source repo:** https://github.com/agicto/ollama-agent-crewai-search
**Framework:** CrewAI
**Detected import:** `from crewai import Agent` in `06.py`
**Repo description:** "ollama-agent-crewai-search"
**Persona match:** Primary target — org repo, no single maintainer (contact
TBD via Clay person search; placeholder used here)
**ICP score (illustrative):** 63

---

**To:** [Head of AI — to be resolved by contact enrichment]
**Subject:** crewai search

Hi,

ollama-agent-crewai-search is doing what most CrewAI research crews
converge on: local model + a search tool. The open tabs at scale are
usually reliability and parsing — free Google scrapers start falling
over past a few hundred calls a day.

SearchApi is a CrewAI-compatible tool for Google, Bing, YouTube, and
scholarly results, and it's priced by call, not by proxy rental.
Anthropic and Scale use it behind agent loops like this one.

Worth wiring in as the search tool once you're past local testing?

— Jan @ SearchApi
