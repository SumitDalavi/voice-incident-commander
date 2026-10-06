# voice-incident-commander

> Ask by voice why checkout is failing, interrupt the explanation, ask for evidence, and approve a scoped action through an explicit UI, never by voice alone.

A real-time voice interface over an incident backend (project 2's API, or project 3's coordinator, or a bundled mock backend). Demonstrates streaming speech, barge-in, grounded answers with evidence citations, and safe handling of action requests.

**Status: personal portfolio project. Not production-deployed.**

## Capability status

| Capability | Status |
|---|---|
| Browser mic capture and audio playback | Planned |
| Streaming speech recognition | Planned |
| Streaming speech synthesis | Planned |
| Barge-in (user interrupts; playback stops quickly) | Planned |
| Turn management / endpointing | Planned |
| Grounded answers with citations (spoken + on-screen) | Planned |
| Tool use against incident backend (read-only) | Planned |
| Action proposals requiring on-screen approval | Planned |
| Push-to-talk and text fallback | Planned |
| Latency instrumentation (per stage) | Planned |
| Provider abstraction (swap speech/model providers) | Planned |

## Principles
1. Voice is an interface, not an authority. Approvals happen on screen with explicit confirmation.
2. Every spoken claim traces to evidence shown in the UI.
3. Measure latency stage by stage; publish what you measured, with hardware, network, and provider details.

## Docs
[Architecture](docs/ARCHITECTURE.md) | [Plan](docs/IMPLEMENTATION_PLAN.md) | [Work packages](docs/WORK_PACKAGES.md) | [Threat model](docs/THREAT_MODEL.md) | [Evaluation](docs/EVALUATION.md) | [Demo](docs/DEMO_SCRIPT.md) | [Decisions](docs/DECISIONS.md)

