/**
 * OpenCortex Parser — Extracts symbols and call relationships from TypeScript/JavaScript
 *
 * Uses ts-morph to parse ASTs. Extracts functions, classes, methods, interfaces,
 * and their call/reference relationships.
 */

import { Project, Node, SyntaxKind, SourceFile, type FunctionDeclaration, type MethodDeclaration, type ClassDeclaration, type InterfaceDeclaration, type CallExpression } from 'ts-morph';
import * as path from 'node:path';
import * as fs from 'node:fs';
import type { CodeSymbol, SymbolKind } from '../types.js';

export interface ParseOptions {
  /** Root directory to parse */
  rootDir: string;
  /** Glob patterns to include (default: **\/*.{ts,tsx,js,jsx}) */
  include?: string[];
  /** Glob patterns to exclude (default: node_modules, dist, .git, etc.) */
  exclude?: string[];
  /** Max files to parse (safety limit) */
  maxFiles?: number;
}

const DEFAULT_INCLUDE = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
const DEFAULT_EXCLUDE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/.next/**',
  '**/coverage/**',
  '**/*.d.ts',
  '**/*.test.*',
  '**/*.spec.*',
  '**/__tests__/**',
];

/**
 * Parse a codebase and extract all symbols with their relationships.
 */
export function parseCodebase(options: ParseOptions): CodeSymbol[] {
  const { rootDir, include = DEFAULT_INCLUDE, exclude = DEFAULT_EXCLUDE, maxFiles = 5000 } = options;

  // Check for tsconfig
  const tsconfigPath = path.join(rootDir, 'tsconfig.json');
  const hasTsConfig = fs.existsSync(tsconfigPath);

  const project = new Project({
    ...(hasTsConfig ? { tsConfigFilePath: tsconfigPath } : {}),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      allowJs: true,
      checkJs: false,
      noEmit: true,
      skipLibCheck: true,
    },
  });

  // Add source files matching patterns
  const sourceFiles = project.addSourceFilesAtPaths(
    include.map(p => path.join(rootDir, p))
  );

  // Filter out excluded files
  const filteredFiles = sourceFiles.filter(sf => {
    const filePath = sf.getFilePath();
    return !exclude.some(pattern => {
      const simple = pattern.replace(/\*\*/g, '').replace(/\*/g, '');
      return filePath.includes(simple.replace(/^\/|\/$/g, ''));
    });
  }).slice(0, maxFiles);

  const symbols: CodeSymbol[] = [];

  for (const sourceFile of filteredFiles) {
    const fileSymbols = extractSymbols(sourceFile, rootDir);
    symbols.push(...fileSymbols);
  }

  return symbols;
}

/**
 * Extract symbols from a single source file.
 */
function extractSymbols(sourceFile: SourceFile, rootDir: string): CodeSymbol[] {
  const symbols: CodeSymbol[] = [];
  const relPath = path.relative(rootDir, sourceFile.getFilePath());

  // Extract top-level functions
  for (const func of sourceFile.getFunctions()) {
    const name = func.getName();
    if (!name) continue;

    symbols.push({
      name,
      qualifiedName: name,
      kind: 'function',
      filePath: relPath,
      startLine: func.getStartLineNumber(),
      endLine: func.getEndLineNumber(),
      exported: func.isExported(),
      callees: extractCallees(func),
      callers: [],
      imports: [],
    });
  }

  // Extract classes and their methods
  for (const cls of sourceFile.getClasses()) {
    const className = cls.getName();
    if (!className) continue;

    symbols.push({
      name: className,
      qualifiedName: className,
      kind: 'class',
      filePath: relPath,
      startLine: cls.getStartLineNumber(),
      endLine: cls.getEndLineNumber(),
      exported: cls.isExported(),
      callees: [],
      callers: [],
      imports: [],
    });

    for (const method of cls.getMethods()) {
      const methodName = method.getName();
      const qualifiedName = `${className}.${methodName}`;

      symbols.push({
        name: methodName,
        qualifiedName,
        kind: 'method',
        filePath: relPath,
        startLine: method.getStartLineNumber(),
        endLine: method.getEndLineNumber(),
        exported: cls.isExported(),
        callees: extractCallees(method),
        callers: [],
        imports: [],
      });
    }
  }

  // Extract interfaces
  for (const iface of sourceFile.getInterfaces()) {
    const name = iface.getName();

    symbols.push({
      name,
      qualifiedName: name,
      kind: 'interface',
      filePath: relPath,
      startLine: iface.getStartLineNumber(),
      endLine: iface.getEndLineNumber(),
      exported: iface.isExported(),
      callees: [],
      callers: [],
      imports: [],
    });
  }

  // Extract exported variable declarations (arrow functions, consts)
  for (const varStmt of sourceFile.getVariableStatements()) {
    const isExported = varStmt.isExported();
    for (const decl of varStmt.getDeclarations()) {
      const name = decl.getName();
      const init = decl.getInitializer();

      // Check if it's an arrow function or function expression
      if (init && (Node.isArrowFunction(init) || Node.isFunctionExpression(init))) {
        symbols.push({
          name,
          qualifiedName: name,
          kind: 'function',
          filePath: relPath,
          startLine: decl.getStartLineNumber(),
          endLine: decl.getEndLineNumber(),
          exported: isExported,
          callees: extractCallees(init),
          callers: [],
          imports: [],
        });
      }
    }
  }

  // Extract type aliases
  for (const typeAlias of sourceFile.getTypeAliases()) {
    const name = typeAlias.getName();
    symbols.push({
      name,
      qualifiedName: name,
      kind: 'type',
      filePath: relPath,
      startLine: typeAlias.getStartLineNumber(),
      endLine: typeAlias.getEndLineNumber(),
      exported: typeAlias.isExported(),
      callees: [],
      callers: [],
      imports: [],
    });
  }

  // Extract enums
  for (const enumDecl of sourceFile.getEnums()) {
    const name = enumDecl.getName();
    symbols.push({
      name,
      qualifiedName: name,
      kind: 'enum',
      filePath: relPath,
      startLine: enumDecl.getStartLineNumber(),
      endLine: enumDecl.getEndLineNumber(),
      exported: enumDecl.isExported(),
      callees: [],
      callers: [],
      imports: [],
    });
  }

  return symbols;
}

/**
 * Extract callee names from a function/method body.
 * Finds all call expressions and extracts the called function name.
 */
function extractCallees(node: Node): string[] {
  const callees = new Set<string>();

  try {
    node.forEachDescendant((descendant) => {
      if (Node.isCallExpression(descendant)) {
        const expr = descendant.getExpression();
        const calleeName = resolveCalleeName(expr);
        if (calleeName) {
          callees.add(calleeName);
        }
      }
    });
  } catch {
    // Some nodes may not be traversable
  }

  return Array.from(callees);
}

/**
 * Resolve the name of a call expression target.
 */
function resolveCalleeName(expr: Node): string | null {
  // Simple identifier: foo()
  if (Node.isIdentifier(expr)) {
    return expr.getText();
  }

  // Property access: obj.method() or Class.method()
  if (Node.isPropertyAccessExpression(expr)) {
    const objectName = expr.getExpression();
    const propName = expr.getName();

    // Try to get the full qualified name
    if (Node.isIdentifier(objectName)) {
      return `${objectName.getText()}.${propName}`;
    }

    // For chained access like a.b.c(), just use the last two parts
    if (Node.isPropertyAccessExpression(objectName)) {
      const innerProp = objectName.getName();
      return `${innerProp}.${propName}`;
    }

    // this.method()
    if (objectName.getKind() === SyntaxKind.ThisKeyword) {
      return propName;
    }

    return propName;
  }

  return null;
}

/**
 * Detect languages in a directory by file extension.
 */
export function detectLanguages(rootDir: string, files: string[]): string[] {
  const langs = new Set<string>();
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (ext === '.ts' || ext === '.tsx') langs.add('TypeScript');
    else if (ext === '.js' || ext === '.jsx') langs.add('JavaScript');
    else if (ext === '.py') langs.add('Python');
    else if (ext === '.rs') langs.add('Rust');
    else if (ext === '.go') langs.add('Go');
    else if (ext === '.java') langs.add('Java');
  }
  return Array.from(langs);
}
