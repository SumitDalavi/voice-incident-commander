# Feasibility and Preflight — Voice Incident Commander (VIC)

## Purpose
Before any implementation begins, verify that all prerequisites are met. Record a GO or HOLD decision.

## Hardware and environment
- [ ] Docker / container runtime installed and functional
- [ ] Node.js 22+ installed
- [ ] Browser with AudioWorklet support (Chrome/Edge recommended)
- [ ] Microphone accessible from browser

## Speech providers
- [ ] STT provider API available OR mock mode sufficient for MVP
- [ ] TTS provider API available OR mock mode sufficient for MVP
- [ ] Optional: realtime speech-to-speech provider evaluated
- [ ] Provider APIs verified from current official docs (APIs change frequently)

## Backend
- [ ] Mock backend bundled for standalone MVP (no dependency on DIA/MSH)
- [ ] Integration paths with DIA API and MSH coordinator documented for later

## Privacy
- [ ] No raw audio storage by default
- [ ] Transcript storage only with explicit config, with redaction

## Licenses
- [ ] Speech provider terms reviewed
- [ ] All dependencies documented in `docs/DECISIONS.md`

## Tools
- [ ] `make`, `docker compose`, linters available
- [ ] Audio test fixtures (synthetic) available

## Decision
- [ ] **GO** — all prerequisites met, proceed to VIC-01
- [ ] **HOLD** — blocker identified: _________________
