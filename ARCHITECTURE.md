# OpenCortex Architecture

## Canonical product view

**OpenCortex is the decision-ready pre-flight layer for coding agents.**

It exists to help agents and developers make safer code changes by turning repo structure into:
- pre-edit briefs
- blast-radius analysis
- critical boundaries and risk hotspots
- execution path context
- QA guidance and next-action plans

The important point is this:

**raw graph intelligence is not the product**

Raw graph intelligence is the substrate.
The product is the decision layer built on top of it.

---

## What OpenCortex is not

OpenCortex is not:
- a personal AI memory architecture
- a repo wiki
- a semantic search product
- just a graph explorer
- a thin wrapper over GitNexus

Those distinctions matter.

If OpenCortex stops at graph exposure, it risks reading as "GitNexus with new paint."
To become its own product, it has to own the layer above raw structure: safer decisions and safer changes.

---

## Product mental model

- **Wikis explain code**
- **Retrieval finds code**
- **OpenCortex tells you what matters, what breaks, and what to do next**

That is the cleanest way to position the product.

---

## Architecture model

OpenCortex should be understood as **one core substrate plus product surfaces above it**, not as a set of artificially equal layers.

### 1. Structural substrate (foundation)
The foundational layer.

This is where OpenCortex computes the structural truth of a repo:
- symbols
- call graph
- communities / boundaries
- critical symbols
- execution flows
- cross-module dependencies

This layer answers questions like:
- what is connected to what?
- what is central or risky?
- what are the real module boundaries?
- what execution paths exist?

Without this layer, everything above it is guesswork.

### 2. Decision surfaces (primary product)
This is the core OpenCortex product layer.

This layer turns raw structure into action-ready outputs:
- pre-edit briefs
- blast-radius analysis
- risky boundary detection
- suggested QA scope
- safer edit planning

This layer answers questions like:
- what matters before I change this?
- what will probably break?
- what should be tested?
- what should the agent do next?

This is where OpenCortex becomes more than raw graph tooling.

### 3. Ownership intelligence (high-value derived layer)
This layer adds organizational context to the structural map:
- who owns this module?
- who should review this PR?
- who has the most context here?
- where are the knowledge silos?

This is highly practical and has immediate team value.

### 4. Change intelligence (high-value derived layer)
This layer tracks how the codebase evolves over time:
- graph diffs
- architecture drift
- growth of centrality / risk
- change velocity through modules
- "how did we get here?"

This is where OpenCortex starts telling the story of system evolution, not just current structure.

### 5. Health and knowledge surfaces (later product surfaces)
These are higher-level outputs derived from the earlier layers:
- health/risk dashboards
- runbooks
- onboarding context
- institutional knowledge capture
- technical due diligence views

These should come later.
They become powerful only when grounded in solid structural, ownership, and change intelligence.

---

## Why this model is better than a flat 5-layer story

A flat layer model sounds elegant, but it can hide what is actually foundational versus what is derivative.

This architecture is clearer because it separates:
- **substrate** from **product outputs**
- **current reality** from **later expansion**
- **structural truth** from **management surfaces**

That keeps us from overbuilding too early or designing for symmetry instead of usefulness.

---

## Build order

### Phase 1: Structural substrate
Harden the current analysis engine.

Priority:
- parsing quality
- graph accuracy
- critical symbol detection
- community/boundary quality
- execution flow usefulness
- stable CLI and machine-readable output

### Phase 2: Decision surfaces
This is the next most important phase.

Priority:
- pre-edit brief
- blast-radius analysis
- change-risk framing
- QA plan generation
- safer agent planning output

This is the phase that makes OpenCortex feel like its own product.

### Phase 3: Ownership intelligence
Priority:
- contributor graph
- expert detection
- review routing
- knowledge silo detection

### Phase 4: Change intelligence
Priority:
- snapshotting
- graph diffs
- architecture drift
- historical hotspot tracking

### Phase 5: Health and knowledge surfaces
Priority:
- health scoring
- leadership dashboards
- onboarding surfaces
- runbook and rationale generation

---

## Current strategic rule

**Do not market OpenCortex as "a graph."**

The graph is how it works.
It is not the user outcome.

The user outcome is:
- safer changes
- better planning
- fewer blind edits
- clearer risk
- clearer next actions

---

## Dependency posture

Today, some of the underlying capability may be accelerated by external graph/indexing systems.
That is acceptable as a bootstrap strategy.

But strategically:
- external graph tooling can accelerate development
- it must not become the entire product identity
- licensing constraints must be treated as real risk

If an underlying dependency makes commercial distribution hard, OpenCortex needs a path to replace or own that core capability over time.

So the rule is:

**borrow acceleration, but own the product layer and eventually own the critical substrate where needed**

---

## Product language to reuse

- OpenCortex gives coding agents an architectural map, a risk read, and a next-action plan before they write code.
- Wikis explain. Retrieval finds. OpenCortex tells you what matters, what breaks, and what to do next.
- OpenCortex turns repo structure into decision-ready engineering intelligence.
- The goal is not more graph data. The goal is safer code changes.

---

## Canonical summary

If someone asks what OpenCortex is, the answer should be:

> OpenCortex is the decision-ready pre-flight layer for coding agents. It computes the structural truth of a codebase, then turns that into blast radius, risk, and next-action guidance so agents and developers can make safer changes.
