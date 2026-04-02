/**
 * OpenCortex Community Detection — Label Propagation Algorithm
 *
 * Detects communities (clusters of tightly-coupled code) in the call graph.
 * Uses a label propagation approach: each node adopts the most common label
 * among its neighbors, iterating until stable.
 *
 * This is simpler and faster than Louvain for our use case, and produces
 * good results for code architecture analysis.
 */

import type { CallGraph, Community, CommunityRelation, CodeSymbol } from '../types.js';
import { getAdjacencyList } from './index.js';
import * as path from 'node:path';

/**
 * Detect communities in the call graph using label propagation.
 */
export function detectCommunities(graph: CallGraph, minCommunitySize: number = 2): Community[] {
  const adj = getAdjacencyList(graph);
  const nodes = Array.from(graph.nodes.keys());

  if (nodes.length === 0) return [];

  // Phase 1: File-based seeding — symbols in the same file start with the same label
  const labels = new Map<string, string>();
  const fileGroups = new Map<string, string[]>();

  for (const [name, sym] of graph.nodes) {
    const dir = path.dirname(sym.filePath);
    const existing = fileGroups.get(dir) || [];
    existing.push(name);
    fileGroups.set(dir, existing);
  }

  // Seed labels by directory
  let labelId = 0;
  for (const [_dir, members] of fileGroups) {
    const label = `comm_${labelId++}`;
    for (const member of members) {
      labels.set(member, label);
    }
  }

  // Phase 2: Label propagation — iterate until convergence
  const maxIterations = 50;
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;

    // Shuffle nodes for randomness
    const shuffled = [...nodes].sort(() => Math.random() - 0.5);

    for (const node of shuffled) {
      const neighbors = adj.get(node);
      if (!neighbors || neighbors.size === 0) continue;

      // Count neighbor labels
      const labelCounts = new Map<string, number>();
      for (const neighbor of neighbors) {
        const neighborLabel = labels.get(neighbor);
        if (neighborLabel) {
          labelCounts.set(neighborLabel, (labelCounts.get(neighborLabel) || 0) + 1);
        }
      }

      if (labelCounts.size === 0) continue;

      // Find most common label
      let maxCount = 0;
      let bestLabel = labels.get(node)!;
      for (const [label, count] of labelCounts) {
        if (count > maxCount) {
          maxCount = count;
          bestLabel = label;
        }
      }

      if (bestLabel !== labels.get(node)) {
        labels.set(node, bestLabel);
        changed = true;
      }
    }

    if (!changed) break;
  }

  // Phase 3: Build communities from labels
  const communityMembers = new Map<string, string[]>();
  for (const [node, label] of labels) {
    const members = communityMembers.get(label) || [];
    members.push(node);
    communityMembers.set(label, members);
  }

  // Filter by minimum size and build Community objects
  const communities: Community[] = [];
  let finalId = 0;

  for (const [_label, members] of communityMembers) {
    if (members.length < minCommunitySize) continue;

    const memberSymbols = members
      .map(m => graph.nodes.get(m))
      .filter((s): s is CodeSymbol => s !== undefined);

    // Calculate cohesion (internal edge density)
    const memberSet = new Set(members);
    let internalEdges = 0;
    let totalPossibleEdges = members.length * (members.length - 1) / 2;

    for (const edge of graph.edges) {
      if (memberSet.has(edge.source) && memberSet.has(edge.target)) {
        internalEdges++;
      }
    }

    const cohesion = totalPossibleEdges > 0 ? internalEdges / totalPossibleEdges : 0;

    // Find key symbols (highest connectivity within community)
    const connectivity = new Map<string, number>();
    for (const member of members) {
      const neighbors = adj.get(member) || new Set();
      let internalConnections = 0;
      for (const n of neighbors) {
        if (memberSet.has(n)) internalConnections++;
      }
      connectivity.set(member, internalConnections);
    }

    const keySymbols = [...connectivity.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    // Detect languages
    const langs = new Set<string>();
    const files = new Set<string>();
    for (const sym of memberSymbols) {
      files.add(sym.filePath);
      const ext = path.extname(sym.filePath).toLowerCase();
      if (ext === '.ts' || ext === '.tsx') langs.add('TypeScript');
      else if (ext === '.js' || ext === '.jsx') langs.add('JavaScript');
    }

    // Generate a human-readable label from the most common directory
    const dirCounts = new Map<string, number>();
    for (const sym of memberSymbols) {
      const dir = path.dirname(sym.filePath);
      const dirName = path.basename(dir) || path.basename(sym.filePath, path.extname(sym.filePath));
      dirCounts.set(dirName, (dirCounts.get(dirName) || 0) + 1);
    }
    const topDir = [...dirCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

    communities.push({
      id: `comm_${finalId}`,
      label: topDir,
      members,
      symbolCount: members.length,
      cohesion: Math.round(cohesion * 1000) / 1000,
      keySymbols,
      languages: Array.from(langs),
      files: Array.from(files),
    });

    finalId++;
  }

  return communities.sort((a, b) => b.symbolCount - a.symbolCount);
}

/**
 * Detect cross-community relationships (calls between communities).
 */
export function detectCommunityRelations(
  graph: CallGraph,
  communities: Community[]
): CommunityRelation[] {
  // Build symbol -> community lookup
  const symbolToCommunity = new Map<string, string>();
  for (const comm of communities) {
    for (const member of comm.members) {
      symbolToCommunity.set(member, comm.id);
    }
  }

  // Count cross-community edges
  const relationMap = new Map<string, CommunityRelation>();

  for (const edge of graph.edges) {
    const sourceComm = symbolToCommunity.get(edge.source);
    const targetComm = symbolToCommunity.get(edge.target);

    if (sourceComm && targetComm && sourceComm !== targetComm) {
      const key = `${sourceComm}->${targetComm}`;
      const existing = relationMap.get(key);
      if (existing) {
        existing.callCount += edge.weight;
      } else {
        relationMap.set(key, {
          sourceCommunity: sourceComm,
          targetCommunity: targetComm,
          callCount: edge.weight,
          strength: 0,
        });
      }
    }
  }

  // Normalize strength
  const relations = Array.from(relationMap.values());
  const maxCalls = Math.max(...relations.map(r => r.callCount), 1);
  for (const rel of relations) {
    rel.strength = Math.round((rel.callCount / maxCalls) * 1000) / 1000;
  }

  return relations.sort((a, b) => b.callCount - a.callCount);
}
