# OpenCortex Example Reports

This directory holds generated reports that show what OpenCortex can do on real codebases.

## OpenClaw core benchmark

- Report: [`reports/openclaw-core.md`](./reports/openclaw-core.md)
- Source repo: [`openclaw/openclaw`](https://github.com/openclaw/openclaw)
- Scope: core TypeScript surfaces across `src/agents`, `src/gateway`, `src/sessions`, `src/channels`, `src/cron`, `src/security`, and `src/routing`

Command used:

```bash
opencortex analyze /path/to/openclaw \
  --output markdown \
  --out reports/openclaw-core.md \
  --include "src/agents/**/*.ts,src/gateway/**/*.ts,src/sessions/**/*.ts,src/channels/**/*.ts,src/cron/**/*.ts,src/security/**/*.ts,src/routing/**/*.ts" \
  --max-files 1200 \
  --min-community-size 3
```

This benchmark is useful because it shows OpenCortex handling a large, modular, real-world TypeScript codebase and producing a report that is readable by both humans and AI agents.
