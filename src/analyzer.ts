/**
 * OpenCortex Analyzer — Main orchestrator
 *
 * Coordinates parsing, graph building, community detection, and flow analysis.
 * This is the primary API entry point.
 */

import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { parseCodebase, detectLanguages, type ParseOptions } from './parser/index.js';
import { buildCallGraph } from './graph/index.js';
import { detectCommunities, detectCommunityRelations } from './graph/community.js';
import { detectFlows } from './flows/index.js';
import type { AnalysisResult, CriticalSymbol, RepoStats } from './types.js';

export interface AnalyzeOptions {
  /** Root directory of the repository */
  rootDir: string;
  /** Minimum community size (default: 2) */
  minCommunitySize?: number;
  /** Maximum files to parse (default: 5000) */
  maxFiles?: number;
  /** Include patterns */
  include?: string[];
  /** Exclude patterns */
  exclude?: string[];
}

/**
 * Analyze a codebase and return full architectural intelligence.
 */
export function analyze(options: AnalyzeOptions): AnalysisResult {
  const startTime = Date.now();
  const { rootDir, minCommunitySize = 2, maxFiles, include, exclude } = options;

  // 1. Parse the codebase
  const symbols = parseCodebase({
    rootDir,
    maxFiles,
    include,
    exclude,
  });

  // 2. Build call graph
  const graph = buildCallGraph(symbols);

  // 3. Detect communities
  const communities = detectCommunities(graph, minCommunitySize);
  const communityRelations = detectCommunityRelations(graph, communities);

  // 4. Detect execution flows
  const flows = detectFlows(graph, communities);

  // 5. Find critical symbols
  const criticalSymbols = findCriticalSymbols(graph, communities);

  // 6. Build stats
  const files = new Set(symbols.map(s => s.filePath));
  const languages = detectLanguages(rootDir, Array.from(files));

  let commitHash = 'unknown';
  try {
    commitHash = execSync('git rev-parse --short HEAD', {
      cwd: rootDir,
      encoding: 'utf-8',
    }).trim();
  } catch { /* not a git repo */ }

  const stats: RepoStats = {
    name: path.basename(rootDir),
    path: rootDir,
    commitHash,
    indexedAt: new Date().toISOString(),
    totalFiles: files.size,
    totalSymbols: symbols.length,
    totalEdges: graph.edges.length,
    totalCommunities: communities.length,
    totalFlows: flows.length,
    languages,
  };

  const durationMs = Date.now() - startTime;

  return {
    stats,
    symbols,
    graph,
    communities,
    communityRelations,
    criticalSymbols,
    flows,
    durationMs,
  };
}

/**
 * Find critical symbols — high fan-in/fan-out nodes that represent
 * architectural risk points.
 */
function findCriticalSymbols(
  graph: ReturnType<typeof buildCallGraph>,
  communities: ReturnType<typeof detectCommunities>
): CriticalSymbol[] {
  // Build symbol -> community lookup
  const symbolToCommunity = new Map<string, string>();
  for (const comm of communities) {
    for (const member of comm.members) {
      symbolToCommunity.set(member, comm.id);
    }
  }

  const critical: CriticalSymbol[] = [];

  for (const [name, sym] of graph.nodes) {
    if (sym.kind !== 'function' && sym.kind !== 'method') continue;

    const inCalls = sym.callers.length;
    const outCalls = sym.callees.filter(c => graph.nodes.has(c)).length;
    const total = inCalls + outCalls;

    if (total < 3) continue;

    let riskLevel: CriticalSymbol['riskLevel'] = 'low';
    if (inCalls >= 50) riskLevel = 'critical';
    else if (inCalls >= 20) riskLevel = 'high';
    else if (inCalls >= 5) riskLevel = 'medium';

    critical.push({
      name: sym.name,
      kind: sym.kind,
      filePath: sym.filePath,
      startLine: sym.startLine,
      community: symbolToCommunity.get(name) || '',
      incomingCalls: inCalls,
      outgoingCalls: outCalls,
      processCount: 0, // filled later if flows reference this symbol
      riskLevel,
    });
  }

  return critical
    .sort((a, b) => (b.incomingCalls + b.outgoingCalls) - (a.incomingCalls + a.outgoingCalls))
    .slice(0, 50);
}
