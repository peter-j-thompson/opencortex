# OpenCortex Landing Page Copy

## Hero

### Eyebrow
Structural pre-flight for coding agents

### Headline
Give your agent an architectural map before it writes code

### Subheadline
OpenCortex turns your TypeScript and JavaScript codebase into symbols, call graphs, communities, critical symbols, and execution flows so agents can plan against real architecture instead of fuzzy retrieval.

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
- which symbols are truly critical
- which modules form real boundaries
- where cross-module dependencies actually live
- what the likely execution paths are

OpenCortex gives that map.

## Section 2: Where OpenCortex fits

### Retrieval tools
Great for finding files and snippets.
Weak on architectural truth.

### Wiki tools
Great for explaining code to humans.
Weak on structural dependency mapping.

### OpenCortex
Maps the codebase itself.
It gives agents structure, boundaries, and execution paths before they change anything.

### One-line summary
Wikis explain. Retrieval finds. OpenCortex maps architecture.

## Section 3: What OpenCortex produces

OpenCortex turns a repo into:
- symbols with line-level precision
- a call graph of who calls whom
- communities that reveal real module boundaries
- critical symbols that highlight architectural risk points
- execution flows that trace meaningful paths through the codebase

## Section 4: Why this matters for agents

OpenCortex acts like a structural pre-flight layer:
1. analyze the repo
2. feed the output to the agent
3. let the agent plan against real architecture instead of guesses

## Section 5: Why this matters for humans

OpenCortex also works for:
- senior engineers doing architecture review
- teams onboarding into large TypeScript repos
- consultants auditing real-world codebases
- devtools builders creating repo-aware workflows

## Section 6: Why OpenCortex is different

- focused on architectural structure
- local-first
- open source
- MIT-licensed
- no proprietary dependencies
- no hosted indexing requirement
- no vector database required
- useful to both humans and agents

## Section 7: Benchmark block

### Title
A real benchmark, not toy output

### Body
On a core OpenClaw benchmark slice, OpenCortex analyzed 1,090 files and surfaced 8,462 symbols, 10,407 edges, 30 communities, and 48 execution flows in about 3.4 seconds.

### CTA
Read the OpenClaw benchmark report

## Section 8: CLI example

```bash
npm install -g opencortex
opencortex analyze /path/to/repo --output markdown --out reports/architecture.md
```

## Section 9: Closing CTA

### Headline
Run OpenCortex before your agent edits a repo

### Body
If your workflow depends on coding agents, architecture-aware context should not be optional.

### CTA options
- Analyze a repo now
- View benchmark report
- Star OpenCortex on GitHub
