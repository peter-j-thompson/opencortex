import * as fs from 'node:fs';
import * as path from 'node:path';
import type { AnalyzeOptions } from './analyzer.js';

export type OutputFormat = 'summary' | 'json' | 'markdown';

export interface RepoConfig {
  include?: string[];
  exclude?: string[];
  maxFiles?: number;
  minCommunitySize?: number;
  output?: OutputFormat;
}

export interface ParsedCliArgs {
  command: string;
  targetPath: string;
  output?: OutputFormat;
  outFile?: string;
  include?: string[];
  exclude?: string[];
  maxFiles?: number;
  minCommunitySize?: number;
  help: boolean;
}

export interface ResolvedCliOptions {
  analyzeOptions: AnalyzeOptions;
  output: OutputFormat;
  outFile?: string;
  configPath?: string;
}

export function parseCliArgs(args: string[]): ParsedCliArgs {
  let index = 0;
  let command = 'analyze';

  if (args[0] && !args[0].startsWith('-')) {
    command = args[0];
    index = 1;
  }

  let targetPath = '.';
  let output: OutputFormat | undefined;
  let outFile: string | undefined;
  let include: string[] | undefined;
  let exclude: string[] | undefined;
  let maxFiles: number | undefined;
  let minCommunitySize: number | undefined;
  let help = false;

  while (index < args.length) {
    const arg = args[index];

    if (arg === '--help' || arg === '-h') {
      help = true;
      index += 1;
      continue;
    }

    if (arg === '--output') {
      const value = args[index + 1];
      if (!isOutputFormat(value)) {
        throw new Error(`Invalid output format: ${value}`);
      }
      output = value;
      index += 2;
      continue;
    }

    if (arg === '--out') {
      const value = args[index + 1];
      if (!value) {
        throw new Error('--out requires a file path');
      }
      outFile = value;
      index += 2;
      continue;
    }

    if (arg === '--include') {
      include = parsePatternList(args[index + 1]);
      index += 2;
      continue;
    }

    if (arg === '--exclude') {
      exclude = parsePatternList(args[index + 1]);
      index += 2;
      continue;
    }

    if (arg === '--max-files') {
      maxFiles = parseNumberArg('--max-files', args[index + 1]);
      index += 2;
      continue;
    }

    if (arg === '--min-community-size') {
      minCommunitySize = parseNumberArg('--min-community-size', args[index + 1]);
      index += 2;
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown flag: ${arg}`);
    }

    targetPath = arg;
    index += 1;
  }

  return {
    command,
    targetPath: path.resolve(targetPath),
    output,
    outFile,
    include,
    exclude,
    maxFiles,
    minCommunitySize,
    help,
  };
}

export function loadRepoConfig(rootDir: string): { config?: RepoConfig; configPath?: string } {
  const configPath = path.join(rootDir, '.opencortex.json');
  if (!fs.existsSync(configPath)) {
    return {};
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  const parsed = JSON.parse(raw) as RepoConfig;
  validateRepoConfig(parsed, configPath);

  return {
    config: parsed,
    configPath,
  };
}

export function resolveCliOptions(parsed: ParsedCliArgs): ResolvedCliOptions {
  const { config, configPath } = loadRepoConfig(parsed.targetPath);

  const analyzeOptions: AnalyzeOptions = {
    rootDir: parsed.targetPath,
    include: parsed.include ?? config?.include,
    exclude: parsed.exclude ?? config?.exclude,
    maxFiles: parsed.maxFiles ?? config?.maxFiles,
    minCommunitySize: parsed.minCommunitySize ?? config?.minCommunitySize,
  };

  const output = parsed.command === 'json'
    ? 'json'
    : parsed.output ?? config?.output ?? 'summary';

  return {
    analyzeOptions,
    output,
    outFile: parsed.outFile,
    configPath,
  };
}

function validateRepoConfig(config: RepoConfig, configPath: string): void {
  if (config.include !== undefined && !Array.isArray(config.include)) {
    throw new Error(`${configPath}: include must be an array of glob strings`);
  }
  if (config.exclude !== undefined && !Array.isArray(config.exclude)) {
    throw new Error(`${configPath}: exclude must be an array of glob strings`);
  }
  if (config.maxFiles !== undefined && !Number.isInteger(config.maxFiles)) {
    throw new Error(`${configPath}: maxFiles must be an integer`);
  }
  if (config.minCommunitySize !== undefined && !Number.isInteger(config.minCommunitySize)) {
    throw new Error(`${configPath}: minCommunitySize must be an integer`);
  }
  if (config.output !== undefined && !isOutputFormat(config.output)) {
    throw new Error(`${configPath}: output must be one of summary, json, markdown`);
  }
}

function isOutputFormat(value: string | undefined): value is OutputFormat {
  return value === 'summary' || value === 'json' || value === 'markdown';
}

function parsePatternList(value: string | undefined): string[] {
  if (!value) {
    throw new Error('Expected a comma-separated pattern list');
  }

  return value
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);
}

function parseNumberArg(flag: string, value: string | undefined): number {
  if (!value) {
    throw new Error(`${flag} requires a numeric value`);
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer`);
  }

  return parsed;
}
