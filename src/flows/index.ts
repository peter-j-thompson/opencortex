/**
 * OpenCortex Flow Detection — Traces execution paths through the call graph
 *
 * Finds meaningful execution flows by starting from entry points (exported functions
 * with high fan-out or no callers) and tracing call chains. Detects both
 * cross-community and intra-community flows.
 */

import type { CallGraph, Community, ExecutionFlow, CodeSymbol } from '../types.js';

const MAX_FLOW_DEPTH = 15;
const MAX_FLOWS = 100;

/**
 * Detect execution flows in the call graph.
 */
export function detectFlows(
  graph: CallGraph,
  communities: Community[]
): ExecutionFlow[] {
  // Build symbol -> community lookup
  const symbolToCommunity = new Map<string, string>();
  for (const comm of communities) {
    for (const member of comm.members) {
      symbolToCommunity.set(member, comm.id);
    }
  }

  // Find entry points: exported symbols with callers < callees (producers)
  const entryPoints = findEntryPoints(graph);

  const flows: ExecutionFlow[] = [];
  const seenFlows = new Set<string>();
  let flowId = 0;

  for (const entry of entryPoints) {
    if (flows.length >= MAX_FLOWS) break;

    // Trace call chain from this entry point
    const visited = new Set<string>();
    const chain = traceCallChain(entry, graph, visited, 0);

    if (chain.length < 2) continue;

    // Create a signature to avoid duplicate flows
    const sig = chain.join('->');
    if (seenFlows.has(sig)) continue;
    seenFlows.add(sig);

    // Determine communities crossed
    const communitiesCrossed = new Set<string>();
    for (const step of chain) {
      const comm = symbolToCommunity.get(step);
      if (comm) communitiesCrossed.add(comm);
    }

    const flowType = communitiesCrossed.size > 1 ? 'cross_community' : 'intra_community';

    // Build summary from first and last meaningful names
    const entryName = shortName(chain[0]);
    const terminalName = shortName(chain[chain.length - 1]);
    const summary = `${entryName} → ${terminalName}`;

    flows.push({
      id: `flow_${flowId++}`,
      summary,
      type: flowType,
      stepCount: chain.length,
      steps: chain,
      communities: Array.from(communitiesCrossed),
      entryPoint: chain[0],
      terminal: chain[chain.length - 1],
    });
  }

  // Sort: cross-community first, then by step count
  return flows.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'cross_community' ? -1 : 1;
    }
    return b.stepCount - a.stepCount;
  });
}

/**
 * Find entry points in the graph.
 * Entry points are exported functions/methods that either:
 * - Have no callers (top-level entry)
 * - Have many callees (orchestrators)
 */
function findEntryPoints(graph: CallGraph): string[] {
  const entries: Array<{ name: string; score: number }> = [];

  for (const [name, sym] of graph.nodes) {
    // Must be a function or method
    if (sym.kind !== 'function' && sym.kind !== 'method') continue;

    let score = 0;

    // Exported = more likely an entry point
    if (sym.exported) score += 3;

    // No callers = definitely an entry point
    if (sym.callers.length === 0) score += 5;

    // High fan-out = orchestrator
    score += Math.min(sym.callees.length, 10);

    // Has callers but also callees = intermediate, lower priority
    if (sym.callers.length > 0 && sym.callees.length > 0) score -= 2;

    if (score > 2 && sym.callees.length > 0) {
      entries.push({ name, score });
    }
  }

  return entries
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map(e => e.name);
}

/**
 * Trace a call chain from a starting symbol.
 * Uses DFS with cycle detection.
 */
function traceCallChain(
  current: string,
  graph: CallGraph,
  visited: Set<string>,
  depth: number
): string[] {
  if (depth >= MAX_FLOW_DEPTH || visited.has(current)) {
    return [current];
  }

  visited.add(current);
  const sym = graph.nodes.get(current);
  if (!sym) return [current];

  // Find the "most interesting" callee to follow
  // Prefer callees that are in our graph (not external)
  const resolvedCallees = sym.callees.filter(c => graph.nodes.has(c));

  if (resolvedCallees.length === 0) {
    return [current];
  }

  // Follow the callee with the highest fan-out (most interesting path)
  let bestCallee = resolvedCallees[0];
  let bestScore = 0;

  for (const callee of resolvedCallees) {
    if (visited.has(callee)) continue;
    const calleeSym = graph.nodes.get(callee);
    if (!calleeSym) continue;

    const score = calleeSym.callees.length + (calleeSym.callers.length > 3 ? 2 : 0);
    if (score > bestScore) {
      bestScore = score;
      bestCallee = callee;
    }
  }

  if (visited.has(bestCallee)) {
    return [current];
  }

  const rest = traceCallChain(bestCallee, graph, visited, depth + 1);
  return [current, ...rest];
}

/**
 * Get a short display name from a qualified name.
 */
function shortName(qualifiedName: string): string {
  const parts = qualifiedName.split('.');
  if (parts.length > 2) {
    return parts.slice(-2).join('.');
  }
  return qualifiedName;
}
