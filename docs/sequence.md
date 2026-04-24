# Sequence

Three emails, same thread for E1→E2, new subject for E3. Lifted directly
from the cold-email skill's sequence design rules: 80% of replies come
from Email 1, so that's where the personalization effort goes.

## Timing

| Email | Day | Subject strategy | Thread |
|---|---|---|---|
| 1 | 0 | Two words, lowercase, references their framework or use case | New |
| 2 | 3 | none (reply to E1) | Same thread |
| 3 | 17 | Fresh subject, different angle | New thread |

After Email 3 with no reply: 90-day cooldown, then re-score and re-sequence
with a different angle (different framework, different pain).

## Email 1

Framework: "Short Trigger" from the cold-email skill's copywriting framework
library. Four lines, 80-100 words.

Structure:
1. Observation — names the specific repo and framework
2. Problem — the infra pain that shows up when web search is the bottleneck
3. Solution + soft proof — one sentence on SearchApi, one proof point
4. CTA — a question, not an ask

Why this framework over "Do the Math": the technical buyer hates numeric
projections from strangers. Observation + question feels like another
engineer sharing context, not a pitch.

## Email 2

Same thread, shorter than Email 1. Framework: Upfront Value from the
cold-email skill.

Sends a concrete artifact: a link to SearchApi's relevant integration doc
(LangChain tool, LlamaIndex retriever, etc.). No new pitch.

Structure:
1. "Following up" is banned. Open with the artifact.
2. Single sentence on why it's useful for what they're building.
3. Same CTA as E1 or a softer variant.

## Email 3

New subject, different angle. Framework: Challenge of Similar Companies
from the cold-email skill.

Pattern: "Most teams building [framework]-based agents hit [specific pain]
around [scale/stage]. We've helped [adjacent company type] solve it by
[what]. Worth 15 min?"

## Subject line library

All two words, all lowercase, per the personalization-prompts skill. Sampled
from the live copy in `copy.md`:

- langchain tool
- rag grounding
- serp latency
- scraping taxes
- google access
- fresh pages
- agent search

## Rules applied across the sequence

From the cold-email skill's core principles:

- 60-100 words per email
- Plain text, no HTML
- One CTA per email, soft (question, not ask)
- Change value prop between emails — E1: save eng time, E2: better coverage, E3: cost
- Never more than 3 emails in a sequence before a pause
- 100% email verification before any send (bounce rate <2%)

## Deliverability constraints

Not exotic — just the standard baseline:

- Send from a secondary domain, not `searchapi.io`
- Max 30 sends per inbox per day
- 3-5 rotating inboxes
- 4-8 weeks warmup before first cold send
- SPF/DKIM/DMARC fully set

## Escalation on reply

Any positive reply → human takes over within 4 hours. The tool drafts the
reply in a second n8n workflow (v2), but a human reads and sends. No
auto-reply to positive intent.
