# Jan Mikeš

GTM engineer. I build the system underneath a B2B outbound motion: buying signals in, accounts scored and gated, sequences out, replies handled, every touch landing in the CRM. Mostly self-hosted n8n with Postgres as the system of record, and most of the workday in Claude Code.

Before that, a year as a founding BDR and a year running RevOps for a fintech. Since then, building and operating an outbound engine for a recruitment agency, end to end and solo.

## Start here: four n8n builds

Each repo ships the importable workflow JSON and a README that explains the decisions.

| Repo | What it does | Runs on |
|---|---|---|
| [bess-signal-pipeline](https://github.com/Miksh21/bess-signal-pipeline) | Weekly signal pipeline on the UK grid-connection register. Finds new battery-storage projects, enriches the developers, confirms each against tender data and news, then posts a tiered card to Slack with a paste-ready hook. Deterministic scoring, no LLM in the gate. | n8n, Clay, Supabase, Slack |
| [duvo-reply-intelligence](https://github.com/Miksh21/duvo-reply-intelligence) | The reply side of outbound. A prospect answers, the reply is triaged, the account enriched, a calendar-aware draft written and a HubSpot deal created. A human approves every send. Runs live against real tools, silent Loom in the README. | n8n, HubSpot, lemlist, Claude, Sumble, Exa, Slack |
| [searchapi-growth-engine](https://github.com/Miksh21/searchapi-growth-engine) | Signal-based outbound for dev tools. Watches GitHub commits for companies adopting LLM frameworks, finds the technical buyer, drafts an email that names the repo. ICP, personas, signal taxonomy and sequence documented alongside. | n8n, GitHub API, Claude, Google Sheets |
| [ai-task-manager](https://github.com/Miksh21/ai-task-manager) | Emails, Teams chats and voicenotes turned into deduplicated, classified Jira tickets, with a calendar block booked for each. Every five minutes, with an audit table for every decision. | n8n, MS Graph, Jira, OpenAI |

## The architecture behind the client engine

Two anonymised case studies from the recruitment-agency build. No client data, only the design and the reasoning.

- [signal-driven-outbound](https://github.com/Miksh21/signal-driven-outbound) · signals scored by weight, recency decay and stacking, then gated and routed. Hot accounts reach a human before 9am, the rest flow into automation, and a suppression gate makes over-messaging structurally impossible.
- [agentic-reply-engine](https://github.com/Miksh21/agentic-reply-engine) · 12 reply routes, 11 handled autonomously, one escalated to a human. Every message on a Postgres ledger, outcomes re-read weekly.

## Tooling

- [gtm-master-skill](https://github.com/Miksh21/gtm-master-skill) · the Claude Code skill I run outbound work through: ICP, signals, list building, Clay, cold email, sequences and campaign ops as task recipes.
- [slopcheck](https://github.com/Miksh21/slopcheck) · a deterministic linter that catches AI-written copy before it reaches an inbox. English and Czech, no model in the loop.
- [ops-pulse](https://github.com/Miksh21/ops-pulse) · run and health monitoring across every project I automate.

## Contact

[LinkedIn](https://www.linkedin.com/in/jan-mikes21) · me@mikesjan.cz
