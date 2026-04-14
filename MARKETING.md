# OpenCortex Marketing Draft

## Positioning

**OpenCortex is code intelligence for AI agents and developers.**
It turns a TypeScript or JavaScript codebase into an architectural graph of symbols, call relationships, communities, and execution flows so an agent can understand the repo before it changes anything.

Short version:

> OpenCortex gives AI agents a senior-engineer-level map of a codebase in seconds.

## Who this is for first

### Primary wedge
- teams building AI coding agents
- developers wiring LLMs into repo-aware workflows
- founders building agentic developer tools

### Secondary wedge
- senior engineers doing architecture review
- teams onboarding into large TypeScript monorepos
- consultants auditing complex codebases

## What problem it solves

Most tools give one of these:
- text search
- embeddings
- file trees
- vague summaries

Those are useful, but they do not tell an agent:
- which symbols are truly critical
- which modules form real communities
- where cross-module boundaries are
- what the likely execution paths are

OpenCortex does.

## Why it is interesting

- local-first
- no proprietary dependencies
- no vector DB
- no LLM required to analyze code
- outputs are useful to both humans and agents
- works fast enough to fit naturally into dev workflows

## Proof points

### OpenClaw core benchmark
Using OpenCortex against a large OpenClaw TypeScript benchmark slice:

- 1,090 files
- 8,462 symbols
- 10,407 edges
- 30 communities
- 48 execution flows
- completed in about 3.4 seconds

See: `examples/reports/openclaw-core.md`

## Strongest messaging angles

### Angle 1: Pre-flight for coding agents
Before an agent edits code, run OpenCortex.
It gets a structural map instead of guessing from retrieval.

### Angle 2: Architecture visibility without enterprise bloat
OpenCortex gives architectural visibility without needing a hosted platform, index farm, or proprietary lock-in.

### Angle 3: Faster onboarding for real repos
Run it on a messy TypeScript repo and get useful structure in seconds.

## Homepage draft

### Hero
**Architectural code intelligence for AI agents**

OpenCortex parses your codebase into symbols, call graphs, communities, and execution flows so agents and developers can understand architecture before making changes.

### Subhead
Senior-engineer-level repo context in seconds. Local-first. Open source. No proprietary indexing pipeline required.

### CTA ideas
- Analyze a repo in 30 seconds
- See a real benchmark report
- Use OpenCortex before your agent writes code

## First launch assets to create

1. short demo GIF of `opencortex analyze`
2. one benchmark thread/post using the OpenClaw report
3. one landing page with benchmark proof and CLI examples
4. one comparison graphic: search vs embeddings vs graph intelligence
5. one "use before agent edit" workflow example

## Suggested first distribution channels

1. GitHub README + release
2. X/Twitter devtools post
3. Hacker News Show HN
4. Reddit communities for TypeScript, LLM agents, and devtools
5. Discord communities where agent builders hang out

## Practical next moves

### Product
1. add config and output polish for more commands
2. add a machine-friendly blast-radius or changed-symbol analysis mode
3. add more benchmark examples

### Marketing
1. publish benchmark examples
2. tighten README hero and proof
3. create a minimal landing page
4. record one clean terminal demo

## What I would say plainly

Do not market this as "yet another code analysis tool."
Market it as:

**the structural pre-flight layer for AI code agents**

That is the sharpest wedge.
