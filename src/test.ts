import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { analyze } from './index.js';
import { parseCliArgs, resolveCliOptions } from './config.js';
import { renderAnalysis, writeOutput } from './render.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'opencortex-fixture-'));

fs.writeFileSync(
  path.join(fixtureRoot, 'index.ts'),
  `export function start() { return helper(); }\nfunction helper() { return 42; }\n`,
  'utf-8'
);

fs.writeFileSync(
  path.join(fixtureRoot, 'extra.ts'),
  `export const value = () => start();\nimport { start } from './index';\n`,
  'utf-8'
);

fs.writeFileSync(
  path.join(fixtureRoot, '.opencortex.json'),
  JSON.stringify({
    include: ['**/*.ts'],
    exclude: ['**/*.spec.ts'],
    maxFiles: 10,
    minCommunitySize: 2,
    output: 'markdown',
  }, null, 2),
  'utf-8'
);

const rootResult = analyze({ rootDir: path.resolve('.') });
assert(rootResult.stats.totalFiles > 0, 'expected at least one file in repo smoke test');
assert(rootResult.stats.totalSymbols > 0, 'expected at least one symbol in repo smoke test');

const parsedFromConfig = parseCliArgs(['analyze', fixtureRoot]);
const resolvedFromConfig = resolveCliOptions(parsedFromConfig);
assert(resolvedFromConfig.output === 'markdown', 'expected config output to be loaded');
assert(resolvedFromConfig.analyzeOptions.maxFiles === 10, 'expected maxFiles from config');
assert(resolvedFromConfig.analyzeOptions.minCommunitySize === 2, 'expected minCommunitySize from config');

const parsedOverride = parseCliArgs([
  'analyze',
  fixtureRoot,
  '--output',
  'json',
  '--max-files',
  '5',
  '--min-community-size',
  '3',
  '--include',
  'src/**/*.ts,*.ts',
]);
const resolvedOverride = resolveCliOptions(parsedOverride);
assert(resolvedOverride.output === 'json', 'expected CLI output override to win');
assert(resolvedOverride.analyzeOptions.maxFiles === 5, 'expected CLI maxFiles override to win');
assert(resolvedOverride.analyzeOptions.minCommunitySize === 3, 'expected CLI minCommunitySize override to win');
assert(resolvedOverride.analyzeOptions.include?.includes('*.ts'), 'expected include override to be parsed');

const fixtureResult = analyze(resolvedFromConfig.analyzeOptions);
assert(fixtureResult.stats.totalFiles === 2, 'expected fixture repo to analyze 2 files');
assert(fixtureResult.stats.totalSymbols >= 3, 'expected fixture repo symbols');

const markdown = renderAnalysis(fixtureResult, 'markdown');
assert(markdown.includes('# OpenCortex Report:'), 'expected markdown output');

const json = renderAnalysis(fixtureResult, 'json');
assert(json.includes('"stats"'), 'expected json output');
assert(json.includes('"communities"'), 'expected json output communities');

const outputFile = path.join(fixtureRoot, 'reports', 'analysis.md');
const writtenPath = writeOutput(markdown, outputFile);
assert(writtenPath === path.resolve(outputFile), 'expected resolved output file path');
assert(fs.existsSync(outputFile), 'expected output file to be created');
assert(fs.readFileSync(outputFile, 'utf-8').includes('# OpenCortex Report:'), 'expected file contents to match');

console.log('OpenCortex test suite passed');
console.log(JSON.stringify({
  repoFiles: rootResult.stats.totalFiles,
  fixtureFiles: fixtureResult.stats.totalFiles,
  fixtureSymbols: fixtureResult.stats.totalSymbols,
  outputFile,
}, null, 2));
