# Objections

Five objections cover ~90% of the replies this sequence will produce. Each
has a short handle built into Email 1 or Email 2 so the rebuttal doesn't
need to be argued — it's pre-empted.

## 1. "We already use SerpAPI / ScrapingBee / Bright Data"

The most common objection from teams past the prototype stage. It's also
the easiest: SearchApi's pitch against incumbents is speed, uptime, and
pricing transparency, not feature parity.

**Handled in copy:** Don't compete on features in Email 1. Frame around
the specific pain (latency, rate limits, cost scaling) and let the reply
open the comparison. The customer-proof mention ("Anthropic and Scale use it")
does the vendor-positioning work without starting a feature war.

**Reply template if raised:**
> Makes sense — most teams we talk to started there. The usual reasons people
> switch are [latency | cost at scale | SDK ergonomics]. Happy to share
> specific numbers if useful — what's your rough query volume?

## 2. "We built our own / we use Serper / we just use Google directly"

Usually signals a <50-person team that hasn't hit scale pain yet.

**Handled in copy:** Email 2 leads with the integration doc, not a pitch.
If they're rolling their own, the friction of wiring SearchApi is often
lower than they'd expect — show, don't tell.

**Reply template:**
> Fair — plenty of teams stay on that until something breaks. The one thing
> worth checking: is it stable at 10x your current volume? That's usually
> where home-rolled falls over. No pressure either way.

## 3. "Not a priority right now"

Default soft-no. Not a rejection of SearchApi, a rejection of the timing.

**Handled in copy:** The soft CTA ("worth a look?") is designed to produce
a clean "not now" rather than a forced meeting. Getting this response is a
win compared to silence — it means the account stays in the pipeline for
v2 re-sequencing.

**Reply template:**
> No worries. When the search layer does become a priority, these are the
> two docs worth bookmarking: [integration] [pricing]. I'll check back in
> a quarter.

Then: add to a 90-day re-touch list with a different angle.

## 4. "What's the pricing?"

High-intent signal dressed as an objection. Never send pricing cold — send
the link + an offer to talk.

**Handled in copy:** N/A, this only surfaces after a reply.

**Reply template:**
> Starts at $49/mo and scales per call — full tiers here: [link]. Happy to
> run the math on your specific volume if you share rough numbers.

## 5. "Can you handle [specific use case / integration / region]?"

Technical qualification. Often asked by the actual buyer.

**Handled in copy:** Email 1 names the framework, so if they're asking
about integration, they're already reading carefully. Answer with specifics
and a link to the relevant doc.

**Reply template:**
> Yes — here's how it wires into [framework]: [link]. If you want a deeper
> walkthrough or have a non-standard use case, happy to jump on 15 min.

## 6. "Remove me / unsubscribe / stop"

Always honored same-day. Never argued.

**Handled in copy:** Email includes a one-line opt-out at the bottom.
**Reply action:** Remove from the Google Sheet and flag the domain so the
workflow never re-adds this org.

## Objections the copy does NOT try to handle

- "You're violating CAN-SPAM / GDPR" — handle infra-side (correct opt-out,
  valid reply-to, valid postal address), not in copy. If the objection comes
  up, remove + apologize, no defense.
- "Cold email is spam" — don't argue. Remove and drop.
- "This isn't for me" — take at face value, ask for a referral once, drop
  if no response.

## Meta-rule

Every objection reply should be shorter than the original email. Long
rebuttals read as desperate. The goal at the reply stage is a 15-minute
call, not a debate.
