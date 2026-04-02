/**
 * OpenCortex — Type Definitions
 *
 * Types for code intelligence: symbols, call graphs, communities, execution flows.
 * Compatible with Cove Memory's CodeIntelAdapter interface.
 */

// ============================================================
// SYMBOL TYPES
// ============================================================

export type SymbolKind = 'function' | 'method' | 'class' | 'interface' | 'variable' | 'type' | 'enum';

export interface CodeSymbol {
  name: string;
  qualifiedName: string;       // e.g., "MyClass.myMethod"
  kind: SymbolKind;
  filePath: string;
  startLine: number;
  endLine: number;
  exported: boolean;
  /** Symbols this symbol calls/references */
  callees: string[];           // qualified names
  /** Symbols that call/reference this symbol */
  callers: string[];           // qualified names (filled during graph build)
  /** Import sources this symbol depends on */
  imports: string[];
}

// ============================================================
// GRAPH TYPES
// ============================================================

export interface CallEdge {
  source: string;   // qualified name
  target: string;   // qualified name
  weight: number;   // call frequency / importance
}

export interface CallGraph {
  nodes: Map<string, CodeSymbol>;
  edges: CallEdge[];
}

// ============================================================
// COMMUNITY TYPES
// ============================================================

export interface Community {
  id: string;
  label: string;
  members: string[];           // qualified names
  symbolCount: number;
  cohesion: number;            // 0.0-1.0 internal density
  keySymbols: string[];        // top symbols by centrality
  languages: string[];
  files: string[];             // unique files in this community
}

export interface CommunityRelation {
  sourceCommunity: string;
  targetCommunity: string;
  callCount: number;
  strength: number;            // 0.0-1.0 normalized
}

// ============================================================
// FLOW TYPES
// ============================================================

export interface ExecutionFlow {
  id: string;
  summary: string;
  type: 'cross_community' | 'intra_community';
  stepCount: number;
  steps: string[];             // qualified names in order
  communities: string[];
  entryPoint: string;
  terminal: string;
}

// ============================================================
// REPO STATS
// ============================================================

export interface RepoStats {
  name: string;
  path: string;
  commitHash: string;
  indexedAt: string;
  totalFiles: number;
  totalSymbols: number;
  totalEdges: number;
  totalCommunities: number;
  totalFlows: number;
  languages: string[];
}

// ============================================================
// CRITICAL SYMBOL (high impact)
// ============================================================

export interface CriticalSymbol {
  name: string;
  kind: SymbolKind;
  filePath: string;
  startLine: number;
  community: string;
  incomingCalls: number;
  outgoingCalls: number;
  processCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================
// ANALYSIS RESULT (full output)
// ============================================================

export interface AnalysisResult {
  stats: RepoStats;
  symbols: CodeSymbol[];
  graph: CallGraph;
  communities: Community[];
  communityRelations: CommunityRelation[];
  criticalSymbols: CriticalSymbol[];
  flows: ExecutionFlow[];
  durationMs: number;
}
