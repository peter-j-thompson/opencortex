# OpenCortex Positioning

## Category

**OpenCortex is the decision-ready pre-flight layer for coding agents.**

It turns a TypeScript or JavaScript codebase into structural intelligence, then turns that into pre-edit briefs, blast-radius analysis, risk signals, and QA guidance so an agent can plan against real architecture before it writes code.

## The simple mental model

- **Wikis explain code**
- **Retrieval finds code**
- **OpenCortex tells you what matters, what breaks, and what to do next**

That is the lane.

## What OpenCortex is not

- not a repo wiki
- not just semantic search
- not a full MCP platform
- not an enterprise orchestration layer

Those can sit beside it. OpenCortex should own the structural analysis layer underneath them.

## OpenCortex vs DeepWiki

### DeepWiki
- strongest at explanation and human-readable repo understanding
- wiki-style surface
- helpful for learning and browsing

### OpenCortex
- strongest at architectural structure
- shows symbol-level relationships, boundaries, and likely execution paths
- better as a pre-flight input before an agent edits code

**Short version:** DeepWiki helps you understand what a repo says. OpenCortex helps an agent understand how the repo is wired.

## OpenCortex vs repo embeddings / RAG search

### Embeddings and search
- good for finding relevant files and snippets
- good for retrieval and question answering
- weak on structural truth

### OpenCortex
- computes architecture directly from code relationships
- identifies critical symbols, communities, cross-boundary dependencies, and flows
- answers "what breaks if this changes?" better than plain retrieval

**Short version:** retrieval finds text. OpenCortex finds structure.

## OpenCortex vs GitNexus

### GitNexus
- broader product surface
- CLI + MCP + web UI + persistent indexing + search + wiki + multi-repo workflows
- more of a full repo-intelligence platform

### OpenCortex
- narrower and cleaner product surface
- focused analysis engine and CLI
- easier to embed anywhere
- easier to explain
- MIT-licensed, clean open-source core

**Short version:** GitNexus is a broader platform. OpenCortex is the sharper structural-analysis primitive.

## The wedge

The strongest entry point is not "full repo intelligence."
It is:

**Give your coding agent an architectural map, a risk read, and a next-action plan before it writes code.**

That wedge is:
- easier to demo
- easier to trust
- easier to adopt
- easier to integrate into existing agent workflows
- more differentiated than just exposing raw graph output

## Messaging pillars

1. **Decision-ready pre-flight for coding agents**
2. **Risk, blast radius, and next actions, not just raw graph data**
3. **Architecture, not fuzzy retrieval**
4. **Local-first and open source**
5. **Fast enough for real development workflows**

## Messaging lines worth reusing

- **Give your agent an architectural map, risk read, and next-action plan before it writes code.**
- **Wikis explain. Retrieval finds. OpenCortex tells you what matters, what breaks, and what to do next.**
- **Run OpenCortex before your agent edits a repo.**
- **Safer code changes for coding agents.**
- **The decision layer above repo structure.**

## Strategic guardrail

Do not try to out-platform platform products too early.

Expand outward from the analysis core in this order:
1. stronger structural outputs
2. blast-radius and changed-symbol analysis
3. better agent-native packaging and integration
4. optional higher-level workflow surfaces later
