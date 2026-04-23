# 04 — AI-ANK / Na2SQL (LlamaIndex) — DROPPED

**Source repo:** https://github.com/AI-ANK/Na2SQL
**Framework:** LlamaIndex
**Detected import:** `from llama_index.core import` in `app.py`
**Enrichment attempt:** GitHub profile has null `name`, null `bio`,
empty `blog`, null `email`. No discoverable domain.

---

## Why this was dropped

The workflow's Extract Domain step (step 8) requires a resolvable company
domain — either from the GitHub org's `blog` field or a parseable email.
This profile has neither. The row exits the pipeline before enrichment,
scoring, or email generation.

**No email was drafted.**

This is correct workflow behavior. Roughly 30% of User-owned repos have
this shape — the workflow accepts the drop rather than fabricating contact
data.
