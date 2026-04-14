# OpenCortex Landing Page Copy

## Hero

### Headline
Architectural code intelligence for AI agents

### Subheadline
OpenCortex parses your TypeScript and JavaScript codebase into symbols, call graphs, communities, and execution flows so agents and developers can understand architecture before making changes.

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

That helps with retrieval, but not with architecture.

Before an agent edits code, it should know:
- which symbols are critical
- which modules actually form boundaries
- where cross-module dependencies live
- what the likely execution paths are

OpenCortex gives that map.

## Section 2: What OpenCortex produces

OpenCortex turns a repo into:
- symbols with line-level precision
- a call graph of who calls whom
- communities that reveal real module boundaries
- critical symbols that highlight architectural risk points
- execution flows that trace meaningful paths through the codebase

## Section 3: Why this matters for agents

AI coding agents are strongest when they understand the codebase before they generate changes.

OpenCortex acts like a structural pre-flight layer:
1. analyze the repo
2. feed the output to the agent
3. let the agent plan against real architecture instead of guesses

## Section 4: Why this matters for humans

OpenCortex also works for:
- senior engineers doing architecture review
- teams onboarding into large TypeScript repos
- consultants auditing real-world codebases
- devtools builders creating repo-aware workflows

## Section 5: Why OpenCortex is different

- local-first
- open source
- no proprietary dependencies
- no hosted indexing requirement
- no vector database required
- useful to both humans and agents

## Section 6: Benchmark block

### Title
A real benchmark, not toy output

### Body
On a core OpenClaw benchmark slice, OpenCortex analyzed 1,090 files and surfaced 8,462 symbols, 10,407 edges, 30 communities, and 48 execution flows in about 3.4 seconds.

### CTA
Read the OpenClaw benchmark report

## Section 7: CLI example

```bash
npm install -g opencortex
opencortex analyze /path/to/repo --output markdown --out reports/architecture.md
```

## Section 8: Closing CTA

### Headline
Use OpenCortex before your agent writes code

### Body
If your workflow depends on coding agents, structural repo understanding should not be optional.

### CTA options
- Analyze a repo now
- View benchmark report
- Star OpenCortex on GitHub
