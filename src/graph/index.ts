/**
 * OpenCortex Graph Builder — Builds call graphs from parsed symbols
 *
 * Takes extracted symbols and constructs a full call graph with edges,
 * then fills in caller references.
 */

import type { CodeSymbol, CallGraph, CallEdge } from '../types.js';

/**
 * Build a call graph from parsed symbols.
 * Resolves callee names to actual symbols and creates bidirectional edges.
 */
export function buildCallGraph(symbols: CodeSymbol[]): CallGraph {
  const nodes = new Map<string, CodeSymbol>();
  const nameIndex = new Map<string, string[]>(); // simple name -> qualified names

  // Index all symbols
  for (const sym of symbols) {
    nodes.set(sym.qualifiedName, sym);

    // Build name index for resolution
    const existing = nameIndex.get(sym.name) || [];
    existing.push(sym.qualifiedName);
    nameIndex.set(sym.name, existing);
  }

  const edges: CallEdge[] = [];
  const edgeSet = new Set<string>();

  // Build edges from callees
  for (const sym of symbols) {
    for (const calleeName of sym.callees) {
      // Try exact match first
      let targetNames: string[] = [];

      if (nodes.has(calleeName)) {
        targetNames = [calleeName];
      } else {
        // Try simple name lookup
        const candidates = nameIndex.get(calleeName) || [];
        if (candidates.length > 0) {
          targetNames = candidates;
        } else {
          // Try matching method name (e.g., "this.foo" -> "ClassName.foo" in same file)
          const parts = calleeName.split('.');
          if (parts.length === 2) {
            const methodName = parts[1];
            // Find methods with this name in the same file
            const sameFileMatches = symbols.filter(
              s => s.kind === 'method' && s.name === methodName && s.filePath === sym.filePath
            );
            if (sameFileMatches.length > 0) {
              targetNames = sameFileMatches.map(s => s.qualifiedName);
            } else {
              // Try any method with this qualified name pattern
              const qualMatches = nameIndex.get(methodName) || [];
              targetNames = qualMatches;
            }
          }
        }
      }

      for (const targetName of targetNames) {
        const edgeKey = `${sym.qualifiedName}->${targetName}`;
        if (!edgeSet.has(edgeKey) && sym.qualifiedName !== targetName) {
          edgeSet.add(edgeKey);
          edges.push({
            source: sym.qualifiedName,
            target: targetName,
            weight: 1,
          });

          // Add caller reference
          const target = nodes.get(targetName);
          if (target && !target.callers.includes(sym.qualifiedName)) {
            target.callers.push(sym.qualifiedName);
          }
        }
      }
    }
  }

  return { nodes, edges };
}

/**
 * Get the adjacency list representation of the graph.
 */
export function getAdjacencyList(graph: CallGraph): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();

  // Initialize all nodes
  for (const name of graph.nodes.keys()) {
    adj.set(name, new Set());
  }

  // Add edges (undirected for community detection)
  for (const edge of graph.edges) {
    adj.get(edge.source)?.add(edge.target);
    adj.get(edge.target)?.add(edge.source);
  }

  return adj;
}
