# Copy

Every email names the repo and the framework. Everything else is consistent.
Volume of personalization is intentionally low — one strong hook beats five
weak ones, and the "specific repo" hook is about as strong as it gets.

## The Email 1 template

Based on the Short Trigger framework from the cold-email skill, adapted for
SearchApi's tech-buyer audience.

```
Subject: {{two_word_subject}}

Hi {{first_name}},

Saw {{repo_name}} pulled in {{framework}} — {{one_line_observation_on_the_repo}}.

If that stack needs live Google / Bing / YouTube results, most teams end up
{{pain_one}} or {{pain_two}} before they ship. SearchApi gives you {{one_concrete_feature}}
without any of that — {{customer_proof_point}}.

{{soft_cta}}

{{signature}}
```

## Variables and how they're filled

| Variable | Source | Example |
|---|---|---|
| `first_name` | Clay person enrichment | Nikola |
| `repo_name` | GitHub signal | local-genAI-search |
| `framework` | Workflow classifier | LangChain |
| `one_line_observation_on_the_repo` | Claude API node, prompted with repo description + README excerpt | "a local RAG search engine over your own files" |
| `pain_one` | Claude API node, prompted with framework + use case | "rolling your own SERP scraper" |
| `pain_two` | same | "fighting Google's rate limits in production" |
| `one_concrete_feature` | Static per framework | "a drop-in LangChain tool" |
| `customer_proof_point` | Static | "it's what Anthropic and Scale use" |
| `soft_cta` | Static rotation | "Worth showing how it plugs into {{framework}}?" |
| `signature` | Sender | "Jan @ SearchApi" |

## The Claude prompt

The workflow uses Claude Opus 4.6 with this system prompt for the generation
node:

```
You are writing a single cold email on behalf of a SERP API product called
SearchApi. The recipient is a technical buyer (founding engineer, head of AI,
or CTO) at an AI-native company that just committed an import for {{framework}}
to their public repo.

Rules:
- 80 to 100 words max
- Plain text, no HTML, no emoji, no exclamation marks
- Reference the repo by name and the framework
- Infer one specific pain from {{repo_description}} and {{readme_excerpt}}
- Close with a question CTA, not a hard ask
- Do not mention that you saw their commit or repo
- Never start with "Hope you're well" or similar
- Lowercase subject line, two words, flows into the body

Output JSON: {"subject": "...", "body": "..."}
```

## Writing rules applied across all copy

From the personalization-prompts skill and the cold-email skill's
copywriting-principles:

- Specific over generic. "LangChain" not "your framework".
- Pain before solution. Never open with SearchApi.
- No adjectives unless they carry information. "Fast" is noise; "sub-200ms"
  is signal.
- Proof points are customer names, not metrics. Anthropic + Scale is the
  strongest credential SearchApi has.
- Questions over statements at the CTA. "Worth a look?" beats "Let me know."
- Lowercase everywhere that's informal. Sentence-case subject lines read as
  automated.

## Banned phrases

- "I hope this email finds you well"
- "Quick question" (as an opener)
- "Just circling back"
- "Reaching out because"
- "I wanted to introduce myself"
- "Leverage", "synergy", "unlock", "empower", "optimize", "streamline"
- Any adjective applied to SearchApi that the prospect can't verify
  ("best-in-class", "industry-leading", "cutting-edge")

## The Email 2 template

```
Subject: (reply, empty)

Here's how the tool wires into {{framework}} with two lines:
{{integration_doc_url}}

Most teams use it for {{primary_use_case}} — {{one_sentence_why}}.

{{same_or_softer_cta}}
```

## The Email 3 template

```
Subject: {{different_two_word_subject}}

Most teams using {{framework}} in production hit Google rate limits around
the {{scale_stage}}. We've seen it at {{similar_company_type}} enough times
that SearchApi exists to skip that step.

Worth 15 min to see if the shape fits?
```

## Tone check

Read every draft out loud. If a sentence sounds like a template, rewrite
it until a real engineer would say it over a beer.
