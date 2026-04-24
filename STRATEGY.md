# Strategy

Dev-tool GTM lives or dies on two things: finding teams the moment they pick up the
problem your product solves, and writing outbound that sounds like a builder, not
a vendor. Signal-based outbound is 3-4x higher contract value than volume cold;
this repo is one worked example of that, applied to a SERP API serving AI builders.

## The bet

Companies adopting LangChain, LlamaIndex, LangGraph, CrewAI, Haystack, or AutoGen
are building agents and RAG pipelines. Almost every non-trivial one needs
real-world grounding: current prices, fresh articles, local results,
video transcripts, job boards. That's a SERP API job, and SearchApi is well
positioned for it — fast, stable, already used by Anthropic and Scale AI.

The gap between "team commits `from langchain` to a public repo" and
"team evaluates a SERP vendor" is usually weeks. Get there first, with a message
that references their actual repo, and reply rates move from 6-8% cold to
18-22% single-signal to 35-40% when stacked with a second signal like a recent
hire or funding round (benchmarks: signal-sourcer skill, ColdIQ).

## Why GitHub as the primary signal

Most intent tools aggregate Bombora, RB2B, Common Room — second-party and
third-party signals with 30-60 day lag. GitHub public commits are first-party,
timestamped, and attributable to a real company. A commit adding
`from langchain_openai import ChatOpenAI` is equivalent to a demo request in
intent strength, because the team has already moved past evaluation and into
building.

The downside is noise. Hobbyists, students, tutorial forks, and throwaway scripts
dominate raw results. The workflow in this repo uses a three-filter funnel
(ICP match, contact quality, enrichment) to strip the noise down to 10-20
qualified accounts per week — small enough for white-glove personalization,
large enough for a one-person outbound motion.

## What this repo ships

One workflow, nine docs. The workflow runs daily, surfaces new AI builders,
enriches them, finds a technical buyer, and drafts a 90-word email that names
the framework and links the specific repo. The docs explain the GTM thinking
behind every choice — ICP, personas, signal taxonomy, scoring, sequence, copy,
objection handling — so the artifact reads as a system, not a script.

## What's explicitly out of scope (v2)

This repo is the inbound side of a signal-based motion. The things that need
live campaign data before they're worth writing aren't here:

- winning-copy extraction — needs reply data
- performance analysis — needs send data across a statistically meaningful window
- campaign benchmarking — needs a baseline
- deal patterns — needs closed-won data

These are hooks for a v2. Once the workflow runs for 4-6 weeks at SearchApi,
the reply and meeting data become the input to all four.

## How this generalises

The workflow is a pattern, not a SearchApi-only artifact:

- **Trigger:** public-repo first-party signal (framework import, API call, config file)
- **Filter:** ICP match via company enrichment
- **Personalize:** reference the specific repo + the technical context
- **Deliver:** short email to the right technical buyer

Swap the framework list and the email template and this works for any dev-tool
company selling to AI-native teams: vector DBs, observability, eval tools,
inference providers. SearchApi is the example I picked because it's where
the signal-to-value path is tightest and most legible.
