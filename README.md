# Voice Incident Commander

[![CI Pipeline](https://github.com/SumitDalavi/voice-incident-commander/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/SumitDalavi/voice-incident-commander/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/SumitDalavi/voice-incident-commander?color=0969da&label=release&logo=github)](https://github.com/SumitDalavi/voice-incident-commander/releases)
[![Release Workflow](https://github.com/SumitDalavi/voice-incident-commander/actions/workflows/release.yml/badge.svg)](https://github.com/SumitDalavi/voice-incident-commander/actions/workflows/release.yml)
[![SBOM](https://img.shields.io/badge/SBOM-SPDX%202.3-blueviolet?logo=spdx)](https://github.com/SumitDalavi/voice-incident-commander/releases/tag/v0.2.0)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> Distributed via GitHub Container Registry (`ghcr.io/sumitdalavi/voice-incident-commander:v0.2.0`) and tagged GitHub Releases with Anchore SPDX 2.3 SBOM and SHA-256 digest attestation.

---

## The Problem
Modern distributed systems and AI agents require robust operational scaffolding. Simple CRUD apps or mock loops fail when subjected to real-world edge cases, asynchronous boundaries, and security constraints.

## The Solution
A real-time voice interface over an incident backend (project 2's API, or project 3's coordinator, or a bundled mock backend). Demonstrates streaming speech, barge-in, grounded answers with evidence citations, and safe handling of action requests.

---

## Key Capabilities & Architectural Highlights
- **Live Speech Pipeline**: 16kHz PCM audio capturing via Web Audio API streamed over bidirectional WebSockets.
- **Gemini 2.5 Pro Context**: Deep natural language reasoning grounded in cluster diagnostics.
- **Mandatory Visual Gate**: Strict on-screen confirmation barrier preventing mutating actions by voice alone.
- **Full OCI Distribution**: Published to GitHub Container Registry (GHCR).

## 💻 Tech Stack
- **Container Registry:** `ghcr.io/sumitdalavi/voice-incident-commander:v0.2.0`
- **Security & Attestation:** Anchore SPDX 2.3 SBOM, SHA-256 Checksums
- **License:** MIT Open Source

---

## 📚 Documentation Index
- [Architecture Specification](docs/ARCHITECTURE.md) — System diagram, component contracts, and container distribution architecture.
- [Production Runbook](docs/RUNBOOK.md) — Operational runbook, live execution commands, and verification recipes.
- [Demo Walkthrough](docs/DEMO_SCRIPT.md) — Step-by-step interactive demonstration scenario.
- [Changelog](CHANGELOG.md) — Full version history following Keep a Changelog and SemVer.

---

## 🚀 Quickstart & Installation

### Option 1: Run with Docker Container (GHCR)
```bash
docker pull ghcr.io/sumitdalavi/voice-incident-commander:v0.2.0
docker run -d -p 4005:4005 -e GEMINI_API_KEY=$GEMINI_API_KEY ghcr.io/sumitdalavi/voice-incident-commander:v0.2.0
```

### Option 2: Run Locally with Browser UI
```bash
npm install
npm start
# Open http://localhost:4005 in Chrome or Edge
```

### Option 3: Local Developer Setup
```bash
# 1. Clone the repository
git clone https://github.com/SumitDalavi/voice-incident-commander.git
cd voice-incident-commander

# 2. Build and start
make setup
make dev
```

---

## 🎮 Usage & Demo
See [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) for the interactive walkthrough and verification steps.

## Principles

1. Voice is an interface, not an authority. Approvals happen on screen with explicit confirmation.
2. Every spoken claim traces to evidence shown in the UI.
3. Measure latency stage by stage; publish what you measured, with hardware, network, and provider details.

---

## ✅ Verification

### Operational Verification
| Check | Command | Expected |
|---|---|---|
| Build | `make setup` | Dependencies install successfully |
| Run | `make dev` | Services start without crashing |
| Test | `make test` | Behavioral test suite passes |

### Cryptographic & Supply Chain Verification
To verify the authentic origin, integrity, and software composition of release artifacts:
```bash
# 1. Download Release Bundle & Checksums
gh release download v0.2.0 --repo SumitDalavi/voice-incident-commander --pattern "*.tar.gz" --pattern "checksums.txt"

# 2. Verify SHA-256 Digest
sha256sum -c checksums.txt

# 3. Inspect SPDX 2.3 Software Bill of Materials
gh release download v0.2.0 --repo SumitDalavi/voice-incident-commander --pattern "sbom.spdx.json"
cat sbom.spdx.json | jq .spdxVersion
```

---

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

---

## 🔌 Dual-Mode Execution: Live-First with Graceful Mock Fallback

This platform operates in **Dual-Mode**, dynamically selecting between live cloud AI services and embedded offline audio fixtures based on environment variables:

| Component | Environment Variable | Live Mode Behavior | Fallback Mode (Unset / Empty) |
|---|---|---|---|
| **Contextual Reasoning** | `GEMINI_API_KEY` / `LLM_API_KEY` | Streams live natural language reasoning via Google Generative AI (Gemini 2.5 Pro) | Returns structured mock diagnostic responses |
| **Speech-to-Text (STT)** | `GOOGLE_APPLICATION_CREDENTIALS` | Streams real-time `WEBM_OPUS` audio to Google Cloud Speech-to-Text API | Simulates spoken utterances via text fallback and audio test fixtures |
| **Text-to-Speech (TTS)** | `GOOGLE_APPLICATION_CREDENTIALS` | Synthesizes neural voice audio streams via Google Cloud Text-to-Speech | Flushes spoken transcripts directly to on-screen console output |
| **Incident Backend** | `INCIDENT_API_URL` | Routes validated remediation requests to live Incident Agent API (`:4000`) | Binds to bundled mock incident endpoints |


---

## 👨‍💻 Author
**Sumit Dalavi** — Senior DevSecOps / Platform Engineer  
[GitHub](https://github.com/SumitDalavi) | [LinkedIn](https://in.linkedin.com/in/sumit-dalavi-762838129)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE). Copyright (c) 2026 Sumit Dalavi.
