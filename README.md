# Voice Incident Commander

[![CI Pipeline](https://github.com/SumitDalavi/voice-incident-commander/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/SumitDalavi/voice-incident-commander/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/SumitDalavi/voice-incident-commander?color=0969da&label=release&logo=github)](https://github.com/SumitDalavi/voice-incident-commander/releases)
[![Release Workflow](https://github.com/SumitDalavi/voice-incident-commander/actions/workflows/release.yml/badge.svg)](https://github.com/SumitDalavi/voice-incident-commander/actions/workflows/release.yml)
[![SBOM](https://img.shields.io/badge/SBOM-SPDX%202.3-blueviolet?logo=spdx)](https://github.com/SumitDalavi/voice-incident-commander/releases/tag/v0.2.0)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> Hands-free voice interface for on-call engineers, parsing spoken queries into structured Kubernetes diagnostic queries with mandatory on-screen visual confirmation gates for any mutating actions.

---

## Key Capabilities & Architectural Highlights
- **Speech-to-intent**: pipeline streaming natural spoken queries over WebSockets to cluster diagnostics
- **Strict**: mandatory on-screen visual confirmation gate preventing misrecognized mutating commands
- **Audio**: stream cancellation on abrupt disconnects and robust audio buffer handling
- **Full**: OCI container distribution via GitHub Container Registry (GHCR)

## Technology Stack
- **Languages & Frameworks:** JavaScript, Node.js 22, Web Audio API, WebSockets, Google STT/TTS, Docker
- **Container Registry:** `ghcr.io/sumitdalavi/voice-incident-commander:v0.2.0`
- **License:** MIT Open Source

---

## Documentation Index
- [Architecture Specification](docs/ARCHITECTURE.md) — Detailed system diagrams, state machines, and design contracts.
- [Production Runbook](docs/RUNBOOK.md) — Deployment instructions, configuration options, and operations.
- [Demo Script & Walkthrough](docs/DEMO_SCRIPT.md) — Step-by-step verification scenario.
- [Changelog](CHANGELOG.md) — Full release notes and version history.

---

## Quickstart & Installation

### Option 1: Run with Docker Container (GHCR)
```bash
docker pull ghcr.io/sumitdalavi/voice-incident-commander:v0.2.0
docker run -d -p 4005:4005 ghcr.io/sumitdalavi/voice-incident-commander:v0.2.0
```

### Option 2: Run Locally
```bash
npm install
npm start
# Open http://localhost:4005 in your browser
```

### Option 3: Local Developer Setup
```bash
git clone https://github.com/SumitDalavi/voice-incident-commander.git
cd voice-incident-commander
make setup
make test
```

---

## Release & Security Verification

This repository adheres to the Portfolio Release Standard with verifiable supply-chain security attestations:

- **Distribution Archive:** `voice-incident-commander-v0.2.0.tar.gz`
- **SHA-256 Digest:** `1c19948c03ccdfaec9c79c7303850c1fcfd24f42919acacd4c5b10be23433037`
- **Software Bill of Materials (SBOM):** Anchore SPDX 2.3 JSON specification (`sbom.spdx.json`).

### Verification Commands
```bash
# 1. Download Release Bundle & Checksums
gh release download v0.2.0 --repo SumitDalavi/voice-incident-commander --pattern "*.tar.gz" --pattern "checksums.txt"

# 2. Verify Cryptographic Integrity
sha256sum -c checksums.txt

# 3. Inspect SPDX SBOM
gh release download v0.2.0 --repo SumitDalavi/voice-incident-commander --pattern "sbom.spdx.json"
cat sbom.spdx.json | jq .spdxVersion
```

---

## License
MIT License. Copyright (c) 2026 Sumit Dalavi.
