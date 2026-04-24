# searchapi-growth-engine

A working n8n workflow that detects AI companies adopting LLM frameworks
(LangChain, LlamaIndex, LangGraph, CrewAI, Haystack, AutoGen) via GitHub
commits, enriches them, finds a technical buyer, and drafts a personalized
cold email that names the specific repo. Plus the GTM documentation — ICP,
personas, signal taxonomy, sequence, copy framework, objection handling —
that frames the workflow as the output of a real system.

Built as a worked example of signal-based outbound for dev-tool companies
selling to AI-native teams. SearchApi is the primary example because it's a
clean fit: a SERP API is exactly what most LLM frameworks end up needing
for real-world grounding.

## What ships

- `workflow/github-signal-outbound.json` — importable n8n workflow
- `workflow/SETUP.md` — 10-minute setup guide
- `docs/` — nine documents covering the GTM thinking
- `examples/sample-run.md` — a real run against today's GitHub data: 5 leads, 3 queued, 1 flagged, 1 dropped
- `examples/sample-emails/` — the individual drafted emails per lead
- `examples/sample-output.json` — the same five leads as structured records
- `STRATEGY.md` — why this workflow, what it doesn't try to do

## Read in 90 seconds

1. [STRATEGY.md](STRATEGY.md) — the thesis
2. [examples/sample-run.md](examples/sample-run.md) — what one run produces, end to end
3. [docs/signals.md](docs/signals.md) — what the workflow watches
4. [docs/copy.md](docs/copy.md) — what it writes

## Run locally

See [workflow/SETUP.md](workflow/SETUP.md). Requires n8n 1.60+, a GitHub PAT,
an Anthropic API key, a Google Sheet. Clay is optional.

## Doc map

| File | What's in it |
|---|---|
| [STRATEGY.md](STRATEGY.md) | The GTM bet behind the workflow |
| [docs/icp.md](docs/icp.md) | Who gets contacted and who gets dropped |
| [docs/personas.md](docs/personas.md) | The one technical buyer per account |
| [docs/signals.md](docs/signals.md) | The GitHub signal taxonomy |
| [docs/triggers.md](docs/triggers.md) | Signal → action mapping |
| [docs/qualification.md](docs/qualification.md) | The three-gate scoring |
| [docs/sequence.md](docs/sequence.md) | Three emails, same thread + new thread |
| [docs/copy.md](docs/copy.md) | Email template + Claude prompt |
| [docs/objections.md](docs/objections.md) | Six objections, pre-handled |

## What's out of scope (v2 hooks)

- Winning-copy extraction — needs reply data
- Performance analysis — needs send data
- Campaign benchmarking — needs a baseline
- Deal-pattern extraction — needs closed-won data

Each of these plugs in once the workflow has run for 4-6 weeks and the
first reply/meeting cohort is measurable.

## Generalising

Swap the framework list and the email template and the same pattern works
for any dev-tool selling to AI-native teams — vector DBs, observability,
eval tooling, inference providers. The workflow is the pattern; SearchApi
is the worked example.

## License

[MIT](LICENSE).
