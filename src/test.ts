import * as path from 'node:path';
import { analyze } from './index.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const rootDir = path.resolve('.');
const result = analyze({ rootDir });

assert(result.stats.totalFiles > 0, 'expected at least one file');
assert(result.stats.totalSymbols > 0, 'expected at least one symbol');
assert(result.stats.totalEdges > 0, 'expected at least one edge');
assert(result.communities.length > 0, 'expected at least one community');
assert(result.flows.length > 0, 'expected at least one flow');

console.log('OpenCortex smoke test passed');
console.log(JSON.stringify({
  files: result.stats.totalFiles,
  symbols: result.stats.totalSymbols,
  edges: result.stats.totalEdges,
  communities: result.communities.length,
  flows: result.flows.length,
}, null, 2));
