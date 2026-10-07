# voice-incident-commander

> Ask by voice why checkout is failing, interrupt the explanation, ask for evidence, and approve a scoped action through an explicit UI, never by voice alone.

A real-time voice interface over an incident backend (project 2's API, or project 3's coordinator, or a bundled mock backend). Demonstrates streaming speech, barge-in, grounded answers with evidence citations, and safe handling of action requests.

**Status: Fully functional E2E Portfolio Project.**

## Capability status

| Capability | Status |
|---|---|
| Browser mic capture and audio playback | Implemented |
| Streaming speech recognition | Implemented |
| Streaming speech synthesis | Implemented |
| Barge-in (user interrupts; playback stops quickly) | Implemented |
| Turn management / endpointing | Implemented |
| Grounded answers with citations (spoken + on-screen) | Implemented |
| Tool use against incident backend (read-only) | Implemented |
| Action proposals requiring on-screen approval | Implemented |
| Push-to-talk and text fallback | Implemented |
| Latency instrumentation (per stage) | Implemented |
| Provider abstraction (swap speech/model providers) | Implemented |

## Principles
1. Voice is an interface, not an authority. Approvals happen on screen with explicit confirmation.
2. Every spoken claim traces to evidence shown in the UI.
3. Measure latency stage by stage; publish what you measured, with hardware, network, and provider details.

## Docs
[Architecture](docs/ARCHITECTURE.md) | [Demo](docs/DEMO_SCRIPT.md)

