# OpenCortex Launch Post Draft

## Short version

I built **OpenCortex**, an open-source code intelligence engine for AI agents and developers.

It parses a TypeScript/JavaScript repo into:
- symbols
- call graphs
- communities
- critical symbols
- execution flows

The goal is simple: give coding agents a real architectural map before they touch code.

On an OpenClaw benchmark slice, it analyzed:
- 1,090 files
- 8,462 symbols
- 10,407 edges
- 30 communities
- 48 execution flows
- in about 3.4 seconds

Open source, local-first, no vector DB required.

Repo: https://github.com/peter-j-thompson/opencortex
Benchmark report: https://github.com/peter-j-thompson/opencortex/blob/main/examples/reports/openclaw-core.md

## Longer version

Most "repo-aware" AI workflows still lean on search, embeddings, file trees, and fuzzy summaries.

That helps with retrieval, but it does not give an agent an architectural map.

So I built **OpenCortex**.

OpenCortex parses a TypeScript/JavaScript codebase into structural intelligence:
- symbols with line-level precision
- call relationships
- module communities
- critical symbols / bottlenecks
- execution flows

The wedge is straightforward:
**run OpenCortex before an AI agent edits a codebase.**

That gives the agent a much better picture of what is central, what is coupled, and where the boundaries are.

I also ran it against a real OpenClaw benchmark slice and got:
- 1,090 files
- 8,462 symbols
- 10,407 edges
- 30 communities
- 48 execution flows
- in about 3.4 seconds

If you're building coding agents, devtools, or repo-aware workflows, I’d love feedback.

Repo: https://github.com/peter-j-thompson/opencortex
Benchmark report: https://github.com/peter-j-thompson/opencortex/blob/main/examples/reports/openclaw-core.md

## Punchier variant

I think AI coding agents need a structural pre-flight layer.

So I built one.

**OpenCortex** parses TS/JS repos into symbols, call graphs, communities, and execution flows so an agent can understand architecture before it changes code.

Open source. Local-first. No vector DB.

Just ran it on an OpenClaw benchmark slice:
- 1,090 files
- 8,462 symbols
- 10,407 edges
- 30 communities
- 48 flows
- ~3.4s

Repo: https://github.com/peter-j-thompson/opencortex
