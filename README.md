# OpenCortex

**Architectural intelligence for codebases.** OpenCortex parses any TypeScript/JavaScript project into a knowledge graph of symbols, call chains, communities, and execution flows — giving AI agents (or humans) a senior-engineer-level understanding of code architecture in seconds.

```
opencortex analyze ~/my-project

═══════════════════════════════════════════════════════════
  OpenCortex — Analyzing: my-project
═══════════════════════════════════════════════════════════

── Stats ──────────────────────────────────────────────────

  Symbols:      351
  Edges:        391
  Communities:  18
  Flows:        41
  Duration:     2400ms

── Critical Symbols (15 total) ────────────────────────────

  🔴 getLoader             in: 42 out:  3  src/loaders.ts:15
  🟠 processRequest        in: 18 out:  7  src/server.ts:44
  🟡 validateInput         in:  8 out:  2  src/validation.ts:10
```

## What It Does

OpenCortex reads your codebase and builds:

- **Symbols** — Every function, class, method, interface, type, and enum with line-level precision
- **Call Graph** — Who calls whom, with weighted edges and bidirectional tracking
- **Communities** — Clusters of tightly-coupled code detected via label propagation (think: "these files form a module")
- **Critical Symbols** — High fan-in/fan-out nodes that represent architectural risk points
- **Cross-Community Dependencies** — How your modules actually talk to each other
- **Execution Flows** — Traced call chains from entry points through the entire graph

## Why

Every AI coding agent needs to understand code architecture before making changes. Most tools give you text search or embedding-based retrieval. OpenCortex gives you the actual dependency graph — the same mental model a senior engineer builds after months on a project, generated in seconds.

Built as the analytical engine for [OpenMemory](https://github.com/peter-j-thompson/openmemory). Memory remembers. Cortex analyzes.

## Quick Start

```bash
# Clone and install
git clone https://github.com/peter-j-thompson/opencortex.git
cd opencortex
npm install
npm run build

# Analyze any TypeScript/JavaScript project
npx opencortex analyze /path/to/your/project

# Or use the dev runner
npm run dev -- analyze /path/to/your/project
```

## CLI Commands

```bash
opencortex analyze [path]        # Full analysis with visual output
opencortex stats [path]          # Quick stats as JSON
opencortex communities [path]    # Show detected communities
opencortex critical [path]       # Show critical (high-risk) symbols
opencortex flows [path]          # Show execution flows
opencortex json [path]           # Full analysis as JSON (for piping)
```

## Programmatic API

```typescript
import { analyze } from 'opencortex';

const result = analyze({ rootDir: '/path/to/repo' });

console.log(result.stats);              // RepoStats
console.log(result.symbols);            // CodeSymbol[]
console.log(result.communities);        // Community[]
console.log(result.criticalSymbols);    // CriticalSymbol[]
console.log(result.communityRelations); // CommunityRelation[]
console.log(result.flows);             // ExecutionFlow[]
```

### Options

```typescript
analyze({
  rootDir: '/path/to/repo',
  minCommunitySize: 2,     // Minimum symbols to form a community
  maxFiles: 5000,          // Safety limit on files parsed
  include: ['src/**/*.ts'], // Glob patterns to include
  exclude: ['**/*.test.*'], // Glob patterns to exclude
});
```

## Architecture

```
Source Files → AST Parser (ts-morph) → Symbol Extraction → Call Graph Builder
                                                              ↓
                 Execution Flows ← Community Detection ← Adjacency Graph
                                   (Label Propagation)
```

**Parser** (`src/parser/`) — Uses `ts-morph` to parse TypeScript/JavaScript ASTs. Extracts functions, classes, methods, interfaces, types, enums, and arrow functions. Resolves call expressions including property access chains and `this` references.

**Graph** (`src/graph/`) — Builds a bidirectional call graph with weighted edges. Resolves callee references to actual symbols in the graph. Computes adjacency lists for community detection.

**Community Detection** (`src/graph/community.ts`) — Label propagation algorithm seeded by directory structure. Iterates until convergence to find natural clusters. Calculates cohesion (internal edge density) and identifies key symbols per community.

**Flow Detection** (`src/flows/`) — Finds entry points (exported functions with high fan-out or no callers) and traces DFS call chains through the graph. Classifies flows as cross-community or intra-community.

**Analyzer** (`src/analyzer.ts`) — Orchestrates the full pipeline and computes critical symbols (architectural risk points based on fan-in/fan-out).

## Stack

| Component | Library | License |
|-----------|---------|---------|
| AST Parsing | [ts-morph](https://github.com/dsherret/ts-morph) | MIT |
| Runtime | Node.js 18+ | MIT |
| Language | TypeScript 5.x | Apache 2.0 |

**One production dependency.** That's it. No vector databases, no LLM calls, no Docker required.

## Language Support

| Language | Status | Parser |
|----------|--------|--------|
| TypeScript | Full | ts-morph (deep type resolution) |
| JavaScript | Full | ts-morph (with `allowJs`) |
| JSX/TSX | Full | ts-morph |
| Python | Planned | tree-sitter |
| Rust | Planned | tree-sitter |
| Go | Planned | tree-sitter |
| Java | Planned | tree-sitter |

## Output Types

<details>
<summary><b>CodeSymbol</b></summary>

```typescript
interface CodeSymbol {
  name: string;
  qualifiedName: string;  // e.g., "MyClass.myMethod"
  kind: 'function' | 'method' | 'class' | 'interface' | 'variable' | 'type' | 'enum';
  filePath: string;
  startLine: number;
  endLine: number;
  exported: boolean;
  callees: string[];
  callers: string[];
  imports: string[];
}
```
</details>

<details>
<summary><b>Community</b></summary>

```typescript
interface Community {
  id: string;
  label: string;
  members: string[];
  symbolCount: number;
  cohesion: number;       // 0.0-1.0 internal density
  keySymbols: string[];
  languages: string[];
  files: string[];
}
```
</details>

<details>
<summary><b>CriticalSymbol</b></summary>

```typescript
interface CriticalSymbol {
  name: string;
  kind: SymbolKind;
  filePath: string;
  startLine: number;
  community: string;
  incomingCalls: number;
  outgoingCalls: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
```
</details>

<details>
<summary><b>ExecutionFlow</b></summary>

```typescript
interface ExecutionFlow {
  id: string;
  summary: string;
  type: 'cross_community' | 'intra_community';
  stepCount: number;
  steps: string[];
  communities: string[];
  entryPoint: string;
  terminal: string;
}
```
</details>

## Use Cases

- **AI Agent Pre-flight** — Feed OpenCortex output to an LLM before it modifies code. It'll know which symbols are critical, which modules exist, and how changes ripple through the architecture.
- **Architecture Audits** — Instantly see which parts of your codebase are tightly coupled, which symbols are bottlenecks, and where the boundaries are.
- **Onboarding** — New to a repo? Run `opencortex analyze` and get the architectural map in seconds.
- **Refactoring Planning** — See community boundaries before reorganizing. Know which cross-community dependencies you'll break.
- **Code Review Context** — Understand the blast radius of a PR by checking which communities and flows the changed symbols touch.

## Companion Project

**[OpenMemory](https://github.com/peter-j-thompson/openmemory)** — 7-layer cognitive memory for AI agents. OpenMemory remembers and evolves. OpenCortex analyzes and understands. Together they give AI agents both continuity and comprehension.

## Contributing

Contributions welcome. Areas where help is needed:

- **Language support** — Adding Python, Rust, Go, Java parsers via tree-sitter
- **Performance** — Parallelizing file parsing for large repos (10K+ files)
- **Visualization** — Interactive graph rendering of communities and flows
- **MCP Server** — Model Context Protocol integration for AI tool access

## License

MIT — Cove AI
