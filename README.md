# voice-incident-commander

> **Maturity:** Fully functional E2E Portfolio Project
> Ask by voice why checkout is failing, interrupt the explanation, ask for evidence, and approve a scoped action through an explicit UI, never by voice alone.

## The Problem
Modern distributed systems and AI agents require robust operational scaffolding. Simple CRUD apps or mock loops fail when subjected to real-world edge cases, asynchronous boundaries, and security constraints.

## The Solution
A real-time voice interface over an incident backend (project 2's API, or project 3's coordinator, or a bundled mock backend). Demonstrates streaming speech, barge-in, grounded answers with evidence citations, and safe handling of action requests.

## 💻 Tech Stack
- **Core Technology**: TypeScript, Node.js, Docker
- **Architecture**: Microservices, Event-Driven

## 📚 Documentation
- [Architecture](docs/ARCHITECTURE.md) — System diagram and component details
- [Runbook](docs/RUNBOOK.md) — Setup, commands, and expected outputs
- [Demo](docs/DEMO_SCRIPT.md) — Walkthrough scenario

## 🚀 Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/SumitDalavi/voice-incident-commander.git
cd voice-incident-commander

# 2. Build and start
make setup
make dev
```

## 💻 Usage & Demo
See the [DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) for the interactive walkthrough and verification steps.

## ✅ Verification

| Check | Command | Expected |
|-------|---------|----------|
| Build | `make setup` | Dependencies install successfully |
| Run | `make dev` | Services start without crashing |

## Capability Status
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

## 👨‍💻 Author
**Sumit Dalavi** — Senior DevSecOps / Platform Engineer
[GitHub](https://github.com/SumitDalavi) | [LinkedIn](https://in.linkedin.com/in/sumit-dalavi-762838129)

---
*Built with a focus on robust patterns, not toy demos.*
