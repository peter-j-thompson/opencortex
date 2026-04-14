#!/usr/bin/env node
/**
 * OpenCortex CLI — Analyze any codebase from the command line.
 */

import { analyze } from './analyzer.js';
import { parseCliArgs, resolveCliOptions } from './config.js';
import {
  renderAnalysis,
  renderCommunities,
  renderCritical,
  renderFlows,
  renderStats,
  writeOutput,
} from './render.js';

function printUsage(): void {
  console.log(`OpenCortex CLI

Usage:
  opencortex analyze [path] [options]
  opencortex stats [path] [options]
  opencortex communities [path] [options]
  opencortex critical [path] [options]
  opencortex flows [path] [options]
  opencortex json [path] [options]

Options:
  --output <summary|json|markdown>   Output format for analyze (default: summary)
  --out <file>                       Write output to a file instead of stdout
  --include <glob,glob>             Override include globs
  --exclude <glob,glob>             Override exclude globs
  --max-files <n>                   Limit parsed files
  --min-community-size <n>          Minimum community size
  -h, --help                        Show help

Config:
  OpenCortex loads .opencortex.json from the target repo root when present.
  CLI flags override config values.
`);
}

try {
  const parsed = parseCliArgs(process.argv.slice(2));

  if (parsed.help) {
    printUsage();
    process.exit(0);
  }

  const resolved = resolveCliOptions(parsed);
  const result = analyze(resolved.analyzeOptions);

  let rendered: string;

  switch (parsed.command) {
    case 'analyze':
    case 'json':
      rendered = renderAnalysis(result, resolved.output);
      break;

    case 'stats':
      rendered = renderStats(result);
      break;

    case 'communities':
      rendered = renderCommunities(result);
      break;

    case 'critical':
      rendered = renderCritical(result);
      break;

    case 'flows':
      rendered = renderFlows(result);
      break;

    default:
      throw new Error(`Unknown command: ${parsed.command}`);
  }

  writeOutput(rendered, resolved.outFile);
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
