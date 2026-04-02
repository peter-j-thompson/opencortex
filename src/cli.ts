#!/usr/bin/env node
/**
 * OpenCortex CLI — Analyze any codebase from the command line
 *
 * Usage:
 *   opencortex analyze [path]          Analyze a codebase
 *   opencortex stats [path]            Quick stats only
 *   opencortex communities [path]      Show detected communities
 *   opencortex critical [path]         Show critical symbols
 *   opencortex flows [path]            Show execution flows
 *   opencortex json [path]             Full analysis as JSON
 */

import * as path from 'node:path';
import { analyze } from './analyzer.js';

const args = process.argv.slice(2);
const command = args[0] || 'analyze';
const targetPath = path.resolve(args[1] || '.');

function printHeader(text: string): void {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${text}`);
  console.log(`${'═'.repeat(60)}\n`);
}

function printSection(text: string): void {
  console.log(`\n── ${text} ${'─'.repeat(Math.max(0, 55 - text.length))}\n`);
}

try {
  switch (command) {
    case 'analyze': {
      printHeader(`OpenCortex — Analyzing: ${path.basename(targetPath)}`);
      const result = analyze({ rootDir: targetPath });

      printSection('Stats');
      console.log(`  Repository:   ${result.stats.name}`);
      console.log(`  Commit:       ${result.stats.commitHash}`);
      console.log(`  Files:        ${result.stats.totalFiles}`);
      console.log(`  Symbols:      ${result.stats.totalSymbols}`);
      console.log(`  Edges:        ${result.stats.totalEdges}`);
      console.log(`  Communities:  ${result.stats.totalCommunities}`);
      console.log(`  Flows:        ${result.stats.totalFlows}`);
      console.log(`  Languages:    ${result.stats.languages.join(', ')}`);
      console.log(`  Duration:     ${result.durationMs}ms`);

      if (result.communities.length > 0) {
        printSection(`Top Communities (${result.communities.length} total)`);
        for (const comm of result.communities.slice(0, 10)) {
          const bar = '█'.repeat(Math.min(20, Math.round(comm.symbolCount / 2)));
          console.log(`  ${comm.label.padEnd(25)} ${String(comm.symbolCount).padStart(5)} symbols  ${bar}  cohesion: ${comm.cohesion}`);
        }
      }

      if (result.criticalSymbols.length > 0) {
        printSection(`Critical Symbols (${result.criticalSymbols.length} total)`);
        for (const sym of result.criticalSymbols.slice(0, 15)) {
          const risk = sym.riskLevel === 'critical' ? '🔴' : sym.riskLevel === 'high' ? '🟠' : sym.riskLevel === 'medium' ? '🟡' : '🟢';
          console.log(`  ${risk} ${sym.name.padEnd(30)} in:${String(sym.incomingCalls).padStart(3)} out:${String(sym.outgoingCalls).padStart(3)}  ${sym.filePath}:${sym.startLine}`);
        }
      }

      if (result.communityRelations.length > 0) {
        printSection(`Cross-Community Dependencies (${result.communityRelations.length} total)`);
        // Map community IDs to labels
        const commLabels = new Map(result.communities.map(c => [c.id, c.label]));
        for (const rel of result.communityRelations.slice(0, 10)) {
          const src = commLabels.get(rel.sourceCommunity) || rel.sourceCommunity;
          const tgt = commLabels.get(rel.targetCommunity) || rel.targetCommunity;
          console.log(`  ${src.padEnd(20)} → ${tgt.padEnd(20)} (${rel.callCount} calls, strength: ${rel.strength})`);
        }
      }

      if (result.flows.length > 0) {
        printSection(`Execution Flows (${result.flows.length} total)`);
        for (const flow of result.flows.slice(0, 10)) {
          const tag = flow.type === 'cross_community' ? '⚡' : '📎';
          console.log(`  ${tag} ${flow.summary.padEnd(45)} ${flow.stepCount} steps  [${flow.communities.join(', ')}]`);
        }
      }

      printSection('Done');
      console.log(`  Analysis complete in ${result.durationMs}ms`);
      console.log(`  ${result.stats.totalSymbols} symbols → ${result.stats.totalEdges} edges → ${result.stats.totalCommunities} communities → ${result.stats.totalFlows} flows\n`);
      break;
    }

    case 'stats': {
      const result = analyze({ rootDir: targetPath });
      console.log(JSON.stringify(result.stats, null, 2));
      break;
    }

    case 'communities': {
      const result = analyze({ rootDir: targetPath });
      for (const comm of result.communities) {
        console.log(`\n[${comm.id}] ${comm.label} — ${comm.symbolCount} symbols (cohesion: ${comm.cohesion})`);
        console.log(`  Key: ${comm.keySymbols.join(', ')}`);
        console.log(`  Files: ${comm.files.join(', ')}`);
      }
      break;
    }

    case 'critical': {
      const result = analyze({ rootDir: targetPath });
      for (const sym of result.criticalSymbols) {
        console.log(`[${sym.riskLevel.toUpperCase()}] ${sym.name} — in:${sym.incomingCalls} out:${sym.outgoingCalls} — ${sym.filePath}:${sym.startLine}`);
      }
      break;
    }

    case 'flows': {
      const result = analyze({ rootDir: targetPath });
      for (const flow of result.flows) {
        console.log(`\n[${flow.id}] ${flow.summary} (${flow.type}, ${flow.stepCount} steps)`);
        console.log(`  Path: ${flow.steps.join(' → ')}`);
        console.log(`  Communities: ${flow.communities.join(', ')}`);
      }
      break;
    }

    case 'json': {
      const result = analyze({ rootDir: targetPath });
      // Serialize without the Map objects
      const serializable = {
        ...result,
        graph: {
          nodeCount: result.graph.nodes.size,
          edgeCount: result.graph.edges.length,
          edges: result.graph.edges.slice(0, 100), // Limit for readability
        },
      };
      console.log(JSON.stringify(serializable, null, 2));
      break;
    }

    default:
      console.log(`Unknown command: ${command}`);
      console.log('Usage: opencortex <analyze|stats|communities|critical|flows|json> [path]');
      process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
