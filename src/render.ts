import * as fs from 'node:fs';
import * as path from 'node:path';
import type { AnalysisResult } from './types.js';
import type { OutputFormat } from './config.js';

export function renderAnalysis(result: AnalysisResult, format: OutputFormat): string {
  switch (format) {
    case 'json':
      return `${JSON.stringify(toSerializableResult(result), null, 2)}\n`;
    case 'markdown':
      return renderMarkdown(result);
    case 'summary':
    default:
      return renderSummary(result);
  }
}

export function writeOutput(output: string, outFile?: string): string | undefined {
  if (!outFile) {
    process.stdout.write(output);
    return undefined;
  }

  const resolved = path.resolve(outFile);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, output, 'utf-8');
  return resolved;
}

export function renderStats(result: AnalysisResult): string {
  return `${JSON.stringify(result.stats, null, 2)}\n`;
}

export function renderCommunities(result: AnalysisResult): string {
  const lines: string[] = [];
  for (const comm of result.communities) {
    lines.push(`[${comm.id}] ${comm.label} — ${comm.symbolCount} symbols (cohesion: ${comm.cohesion})`);
    lines.push(`  Key: ${comm.keySymbols.join(', ')}`);
    lines.push(`  Files: ${comm.files.join(', ')}`);
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

export function renderCritical(result: AnalysisResult): string {
  const lines = result.criticalSymbols.map(sym => (
    `[${sym.riskLevel.toUpperCase()}] ${sym.name} — in:${sym.incomingCalls} out:${sym.outgoingCalls} — ${sym.filePath}:${sym.startLine}`
  ));
  return `${lines.join('\n')}\n`;
}

export function renderFlows(result: AnalysisResult): string {
  const lines: string[] = [];
  for (const flow of result.flows) {
    lines.push(`[${flow.id}] ${flow.summary} (${flow.type}, ${flow.stepCount} steps)`);
    lines.push(`  Path: ${flow.steps.join(' → ')}`);
    lines.push(`  Communities: ${flow.communities.join(', ')}`);
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

function renderSummary(result: AnalysisResult): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('═'.repeat(60));
  lines.push(`  OpenCortex — Analyzing: ${result.stats.name}`);
  lines.push('═'.repeat(60));
  lines.push('');

  pushSection(lines, 'Stats');
  lines.push(`  Repository:   ${result.stats.name}`);
  lines.push(`  Commit:       ${result.stats.commitHash}`);
  lines.push(`  Files:        ${result.stats.totalFiles}`);
  lines.push(`  Symbols:      ${result.stats.totalSymbols}`);
  lines.push(`  Edges:        ${result.stats.totalEdges}`);
  lines.push(`  Communities:  ${result.stats.totalCommunities}`);
  lines.push(`  Flows:        ${result.stats.totalFlows}`);
  lines.push(`  Languages:    ${result.stats.languages.join(', ')}`);
  lines.push(`  Duration:     ${result.durationMs}ms`);

  if (result.communities.length > 0) {
    pushSection(lines, `Top Communities (${result.communities.length} total)`);
    for (const comm of result.communities.slice(0, 10)) {
      const bar = '█'.repeat(Math.min(20, Math.round(comm.symbolCount / 2)));
      lines.push(`  ${comm.label.padEnd(25)} ${String(comm.symbolCount).padStart(5)} symbols  ${bar}  cohesion: ${comm.cohesion}`);
    }
  }

  if (result.criticalSymbols.length > 0) {
    pushSection(lines, `Critical Symbols (${result.criticalSymbols.length} total)`);
    for (const sym of result.criticalSymbols.slice(0, 15)) {
      const risk = sym.riskLevel === 'critical'
        ? '🔴'
        : sym.riskLevel === 'high'
          ? '🟠'
          : sym.riskLevel === 'medium'
            ? '🟡'
            : '🟢';
      lines.push(`  ${risk} ${sym.name.padEnd(30)} in:${String(sym.incomingCalls).padStart(3)} out:${String(sym.outgoingCalls).padStart(3)}  ${sym.filePath}:${sym.startLine}`);
    }
  }

  if (result.communityRelations.length > 0) {
    pushSection(lines, `Cross-Community Dependencies (${result.communityRelations.length} total)`);
    const commLabels = new Map(result.communities.map(c => [c.id, c.label]));
    for (const rel of result.communityRelations.slice(0, 10)) {
      const src = commLabels.get(rel.sourceCommunity) || rel.sourceCommunity;
      const tgt = commLabels.get(rel.targetCommunity) || rel.targetCommunity;
      lines.push(`  ${src.padEnd(20)} → ${tgt.padEnd(20)} (${rel.callCount} calls, strength: ${rel.strength})`);
    }
  }

  if (result.flows.length > 0) {
    pushSection(lines, `Execution Flows (${result.flows.length} total)`);
    for (const flow of result.flows.slice(0, 10)) {
      const tag = flow.type === 'cross_community' ? '⚡' : '📎';
      lines.push(`  ${tag} ${flow.summary.padEnd(45)} ${flow.stepCount} steps  [${flow.communities.join(', ')}]`);
    }
  }

  pushSection(lines, 'Done');
  lines.push(`  Analysis complete in ${result.durationMs}ms`);
  lines.push(`  ${result.stats.totalSymbols} symbols → ${result.stats.totalEdges} edges → ${result.stats.totalCommunities} communities → ${result.stats.totalFlows} flows`);
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function renderMarkdown(result: AnalysisResult): string {
  const lines: string[] = [];

  lines.push(`# OpenCortex Report: ${result.stats.name}`);
  lines.push('');
  lines.push('## Stats');
  lines.push('');
  lines.push(`- Commit: ${markdownCode(result.stats.commitHash)}`);
  lines.push(`- Files: ${result.stats.totalFiles}`);
  lines.push(`- Symbols: ${result.stats.totalSymbols}`);
  lines.push(`- Edges: ${result.stats.totalEdges}`);
  lines.push(`- Communities: ${result.stats.totalCommunities}`);
  lines.push(`- Flows: ${result.stats.totalFlows}`);
  lines.push(`- Languages: ${result.stats.languages.join(', ')}`);
  lines.push(`- Duration: ${result.durationMs}ms`);
  lines.push('');

  if (result.communities.length > 0) {
    lines.push('## Top Communities');
    lines.push('');
    for (const comm of result.communities.slice(0, 10)) {
      lines.push(`- **${comm.label}**: ${comm.symbolCount} symbols, cohesion ${comm.cohesion}`);
    }
    lines.push('');
  }

  if (result.criticalSymbols.length > 0) {
    lines.push('## Critical Symbols');
    lines.push('');
    for (const sym of result.criticalSymbols.slice(0, 15)) {
      lines.push(`- **${sym.name}** (${sym.riskLevel}) — in:${sym.incomingCalls} out:${sym.outgoingCalls} at ${markdownCode(`${sym.filePath}:${sym.startLine}`)}`);
    }
    lines.push('');
  }

  if (result.flows.length > 0) {
    lines.push('## Execution Flows');
    lines.push('');
    for (const flow of result.flows.slice(0, 10)) {
      lines.push(`- **${flow.summary}** (${flow.type}, ${flow.stepCount} steps)`);
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

function toSerializableResult(result: AnalysisResult) {
  return {
    stats: result.stats,
    symbols: result.symbols,
    graph: {
      nodes: Array.from(result.graph.nodes.values()),
      edges: result.graph.edges,
    },
    communities: result.communities,
    communityRelations: result.communityRelations,
    criticalSymbols: result.criticalSymbols,
    flows: result.flows,
    durationMs: result.durationMs,
  };
}

function pushSection(lines: string[], text: string): void {
  lines.push('');
  lines.push(`── ${text} ${'─'.repeat(Math.max(0, 55 - text.length))}`);
  lines.push('');
}

function markdownCode(value: string): string {
  return `\`${value}\``;
}
