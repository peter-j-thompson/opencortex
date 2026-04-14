# OpenCortex Report: openclaw-benchmark

## Stats

- Commit: `e0d1810632`
- Files: 1090
- Symbols: 8462
- Edges: 10407
- Communities: 30
- Flows: 48
- Languages: TypeScript
- Duration: 3456ms

## Top Communities

- **agents**: 3237 symbols, cohesion 0.001
- **gateway**: 1590 symbols, cohesion 0.002
- **plugins**: 661 symbols, cohesion 0.002
- **tools**: 443 symbols, cohesion 0.005
- **sandbox**: 373 symbols, cohesion 0.007
- **pi-embedded-runner**: 358 symbols, cohesion 0.005
- **server-methods**: 288 symbols, cohesion 0.005
- **channels**: 202 symbols, cohesion 0.006
- **schema**: 163 symbols, cohesion 0
- **auth-profiles**: 160 symbols, cohesion 0.015

## Critical Symbols

- **push** (critical) — in:385 out:0 at `src/agents/openai-ws-stream.ts:140`
- **get** (critical) — in:255 out:0 at `src/gateway/node-registry.ts:107`
- **add** (critical) — in:177 out:0 at `src/cron/service.ts:45`
- **resolve** (critical) — in:164 out:2 at `src/gateway/mcp-http.runtime.ts:28`
- **resolve** (critical) — in:165 out:0 at `src/gateway/exec-approval-manager.ts:104`
- **runEmbeddedAttempt** (low) — in:0 out:151 at `src/agents/pi-embedded-runner/run/attempt.ts:359`
- **compactEmbeddedPiSessionDirect** (low) — in:0 out:90 at `src/agents/pi-embedded-runner/compact.ts:304`
- **runEmbeddedPiAgent** (low) — in:1 out:85 at `src/agents/pi-embedded-runner/run.ts:197`
- **normalizeProviderId** (critical) — in:66 out:0 at `src/agents/provider-id.ts:3`
- **writeFile** (critical) — in:55 out:1 at `src/agents/sandbox/fs-bridge.ts:74`
- **writeFile** (critical) — in:55 out:0 at `src/agents/sandbox/remote-fs-bridge.ts:87`
- **close** (high) — in:48 out:0 at `src/agents/openai-ws-connection.ts:384`
- **errorShape** (high) — in:47 out:0 at `src/gateway/protocol/schema/error-codes.ts:14`
- **attachGatewayWsMessageHandler** (low) — in:1 out:44 at `src/gateway/server/ws-connection/message-handler.ts:159`
- **isRecord** (high) — in:43 out:0 at `src/agents/cli-runner/toml-inline.ts:9`

## Execution Flows

- **resolveEffectiveToolInventory → normalizeProviderId** (cross_community, 11 steps)
- **compactEmbeddedPiSessionDirect → normalizeProviderId** (cross_community, 11 steps)
- **removeSandboxBrowserContainer → resolveWatchdogState** (cross_community, 10 steps)
- **ensurePiAuthJsonFromAuthProfiles → resolveOpenClawAgentDir** (cross_community, 6 steps)
- **ensureSkillsWatcher → buildRegistryPluginIdAliases** (cross_community, 6 steps)
- **resolveSessionKeyFromResolveParams → resolveSessionTranscriptPath** (cross_community, 6 steps)
- **sendExecApprovalFollowup → canonicalizeToolGatewayWsUrl** (cross_community, 5 steps)
- **createGatewayConfigModuleMock → stableStringify** (cross_community, 5 steps)
- **buildAuthHealthSummary → resolveTokenExpiryState** (cross_community, 4 steps)
- **runBtwSideQuestion → listAgentEntries** (cross_community, 4 steps)

