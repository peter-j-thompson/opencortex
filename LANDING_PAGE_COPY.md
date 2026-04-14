# OpenCortex Landing Page Copy

## Hero

### Eyebrow
Decision-ready pre-flight for coding agents

### Headline
Give your agent an architectural map, risk read, and next-action plan before it writes code

### Subheadline
OpenCortex turns your TypeScript and JavaScript codebase into structural intelligence so agents can make safer changes instead of guessing from fuzzy retrieval.

### Proof strip
- 1,090-file OpenClaw benchmark
- 8,462 symbols
- 10,407 edges
- 30 communities
- 48 execution flows
- ~3.4s analysis time

### Primary CTA
Analyze a repo

### Secondary CTA
See benchmark report

## Section 1: The problem

Most repo-aware AI workflows still rely on some mix of:
- keyword search
- embeddings
- file trees
- vague summaries
- wiki-like explanations

Those help with retrieval and orientation, but they do not tell an agent:
- what actually matters
- what is risky
- what will probably break
- what should be tested next

OpenCortex gives that decision layer.

## Section 2: What OpenCortex tells you

OpenCortex helps turn raw repo structure into:
- a pre-edit brief
- blast-radius analysis
- critical boundaries and risk hotspots
- execution path context
- QA guidance for safer merges

### One-line summary
Wikis explain. Retrieval finds. OpenCortex tells you what matters, what breaks, and what to do next.

## Section 3: Why this matters for agents

OpenCortex acts like a decision-ready pre-flight layer:
1. analyze the repo
2. identify the risky boundaries and likely blast radius
3. give the agent a better plan before it edits anything

## Section 4: Why this matters for humans

OpenCortex also works for:
- senior engineers reviewing risky changes
- teams onboarding into large TypeScript repos
- consultants auditing real-world codebases
- engineering leaders trying to reduce avoidable breakage

## Section 5: Why OpenCortex is different

- focused on safer changes, not just raw graph output
- architecture-aware, not fuzzy retrieval
- local-first
- open source
- MIT-licensed
- no proprietary dependencies
- useful to both humans and agents

## Section 6: Benchmark block

### Title
A real benchmark, not toy output

### Body
On a core OpenClaw benchmark slice, OpenCortex analyzed 1,090 files and surfaced 8,462 symbols, 10,407 edges, 30 communities, and 48 execution flows in about 3.4 seconds.

### Why it matters
That benchmark proves OpenCortex can build the structural layer fast enough to power real pre-edit decision support.

### CTA
Read the OpenClaw benchmark report

## Section 7: CLI example

```bash
npm install -g opencortex
opencortex analyze /path/to/repo --output markdown --out reports/architecture.md
```

## Section 8: Closing CTA

### Headline
Run OpenCortex before your agent edits a repo

### Body
If your workflow depends on coding agents, architecture-aware risk and QA context should not be optional.

### CTA options
- Analyze a repo now
- View benchmark report
- Star OpenCortex on GitHub
