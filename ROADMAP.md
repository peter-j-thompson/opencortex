# OpenCortex Product Roadmap

## Purpose

This roadmap turns the OpenCortex architecture into a practical build sequence.

The governing principle is simple:

**Do not optimize for more graph output. Optimize for safer code changes and better engineering decisions.**

---

## Product promise

OpenCortex gives coding agents and developers:
- an architectural map
- a risk read
- a next-action plan

before they change code.

That promise should drive prioritization.

---

## Stage 0: Current state

### What exists now
- core TypeScript/JavaScript analysis engine
- symbols, call graph, communities, critical symbols, execution flows
- CLI output modes
- config support
- benchmark proof on OpenClaw
- positioning and landing page aligned around decision-ready pre-flight

### What is missing
- opinionated pre-edit brief output
- blast-radius analysis as a first-class product surface
- QA guidance / test scope generation
- ownership intelligence
- change intelligence over time
- health surfaces and dashboards

---

## Stage 1: Decision-ready pre-flight (highest priority)

### Goal
Turn raw structural analysis into something an agent or engineer can act on immediately before making a change.

### Build
1. **Pre-edit brief**
   - summarize what area of the system is being touched
   - identify critical symbols and nearby boundaries
   - highlight risk hotspots

2. **Blast-radius analysis**
   - likely affected modules
   - likely affected execution flows
   - likely dependency breakpoints

3. **QA guidance**
   - suggest what to test
   - suggest what should be regression-checked
   - generate change-specific QA plans

4. **Machine-friendly output**
   - stable JSON structures for agent consumption
   - clean markdown summaries for humans

### Success condition
A developer or agent can run OpenCortex before editing code and immediately get:
- what matters
- what is risky
- what might break
- what to test next

### Why this stage matters most
This is the first place OpenCortex becomes more than graph infrastructure.
This is the product wedge.

---

## Stage 2: Ownership intelligence

### Goal
Help teams answer who should be involved when a risky change is being made.

### Build
1. contributor graph
2. module ownership inference
3. expert detection
4. suggested reviewer routing
5. knowledge silo detection

### Success condition
OpenCortex can answer:
- who owns this area?
- who should review this?
- who has the most context here?

### Why this matters
This is immediate practical value for engineering teams, not just agent builders.

---

## Stage 3: Change intelligence

### Goal
Move from static structure to codebase evolution over time.

### Build
1. graph snapshotting
2. diff between snapshots
3. architecture drift detection
4. hotspot growth tracking
5. module churn and risk trend visibility

### Success condition
OpenCortex can answer:
- how did this area evolve?
- when did this become risky?
- where is architecture drifting?

### Why this matters
This is where OpenCortex stops being just pre-edit intelligence and starts becoming strategic engineering intelligence.

---

## Stage 4: Health surfaces

### Goal
Turn structural and change intelligence into leadership-grade visibility.

### Build
1. risk hotspot scoring
2. complexity trend scoring
3. dependency risk surfaces
4. codebase health summaries
5. team-facing and leadership-facing reports

### Success condition
OpenCortex can answer:
- where should we invest engineering time?
- which areas are accumulating risk?
- what should be stabilized next quarter?

### Warning
Do not build vague dashboards before the underlying signals are solid.
Health must be derived from real structure and change data.

---

## Stage 5: Knowledge surfaces

### Goal
Capture institutional understanding on top of structural truth.

### Build
1. runbook generation
2. onboarding summaries
3. change rationale surfaces
4. "what usually breaks here" knowledge capture
5. technical due diligence and audit surfaces

### Success condition
OpenCortex can help preserve and surface team knowledge without drifting into fluff.

### Warning
Do not build this too early.
Knowledge surfaces are only useful when anchored in the substrate and decision layers below them.

---

## Product packaging guidance

### Near-term public story
OpenCortex is the decision-ready pre-flight layer for coding agents.

### Near-term feature story
OpenCortex should showcase:
- pre-edit brief
- blast radius
- QA guidance
- risk hotspots

### Do not lead with
- graph database internals
- graph explorer as the main outcome
- community detection as the end product
- generic "code intelligence" language without decision value

---

## Suggested near-term deliverables

### Immediate
1. add a first-class pre-edit brief command/output
2. add blast-radius analysis output
3. add QA plan generation from structural analysis
4. create one killer demo showing safer change planning on a real repo

### After that
5. add ownership inference
6. add historical snapshots and drift views
7. add health summaries

---

## What a great demo looks like

A strong OpenCortex demo should show:
1. target a risky symbol or area
2. generate a pre-edit brief
3. show blast radius
4. show recommended QA scope
5. show why an agent would make a safer plan because of it

That demo is more valuable than just showing raw graph stats.

---

## Current product rule

Every roadmap item should be tested against this question:

**Does this help an agent or engineer make a safer, better decision before or after a code change?**

If not, it is probably not a priority yet.

---

## Canonical sequencing

1. **Decision-ready pre-flight**
2. **Ownership intelligence**
3. **Change intelligence**
4. **Health surfaces**
5. **Knowledge surfaces**

This is the build order unless a strong reason emerges to change it.
