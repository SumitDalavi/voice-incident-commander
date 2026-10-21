# Runbook: voice-incident-commander

## Prerequisites
- Docker & Docker Compose
- Node.js (v22+) or Python (3.12+) depending on the project
- `make` utility

## Setup
1. **Install dependencies:**
   ```bash
   make setup
   ```
2. **Start the local environment:**
   ```bash
   make dev
   ```

## Common Commands
- `make dev`: Starts the application and observability stack.
- `make test`: Runs the test suite.
- `make clean`: Removes node_modules, builds, and resets Docker volumes.

## Troubleshooting
**Port Conflicts (9090, 3000):**
If `make dev` fails due to bound ports, verify that no local Prometheus or Grafana instance is running. The `docker-compose.yml` can be modified to map to alternate host ports if necessary.

**Build Errors:**
Run `make clean && make setup` to completely clear the cache and reinstall dependencies from scratch.


## October 2026 Update: Behavioral Testing & Runtime Stabilization

**Implementation Notes:**
Updated test.js to a full behavioral WebSocket client simulating real SRE interactions. Implemented TTS barge-in logic for real-time aborts.

* Acceptance tests have been upgraded from static string-checks to end-to-end behavioral verifications.
* API boundaries and execution layers (Docker, WebSockets, Temporal, etc.) are now explicitly exercised in tests.


## Phase 4: Structural Epics & Architectural Roadmap

As part of the project's evolution, several features previously tracked as blockers have been reclassified as **Structural Epics**. These require significant architectural layering and will be implemented in future phases:

* **Epic 1: Native Audio Pipeline:** Full browser microphone capture via 
avigator.mediaDevices.getUserMedia(), Opus/PCM encoding, and bidirectional binary streaming.
* **Epic 2: Contextual Incident Awareness:** Advanced awareness features including speaker identification and contextual multi-incident state tracking.
* **Epic 3: Visual Audio Interface:** A fully styled React UI featuring a real-time waveform visualizer, live transcript panel, and dynamic status indicators.


## Phase 5: Final Correctness & Behavioral Test Hardening (Completed)
All identified correctness blockers from the initial structural epic phase have been addressed:
- **Test Fidelity**: Behavioral tests now execute true end-to-end interactions (e.g. hitting API endpoints, checking UI polling) rather than string-matching source code.
- **Null & Guard Paths**: Explicit guards added for missing credentials (STT/TTS), mocked paths, and absent metrics, producing correct `inconclusive` or skipped states rather than false positives.
- **Resource Cleanup**: Tests properly isolate their artifacts (e.g., dedicated `fs.mkdtempSync` directories) and verify underlying cleanup (e.g., Docker container `inspect` checks).
- **Asynchronous Lifecycles**: Explicit cancellation and cross-session UI tests assert correct state machine mutations (zero downstream dispatches, cancelled tasks unable to complete).
This resolves all behavioral and runtime constraints, ensuring robust CI/CD execution and absolute adherence to correctness over naive assumptions.


## Phase 5.1 Update: Live API Integrations & Gemini Adoption
- **Live AI Integrations**: Completely replaced the mock backend with `@google/generative-ai` (Gemini 2.5 Pro) for contextual reasoning, `@google-cloud/speech` for real-time STT, and `@google-cloud/text-to-speech` for realistic TTS generation.
- **WebSocket Binary Audio**: Implemented true `LINEAR16` PCM audio capturing using `AudioContext` in the browser, streaming it bidirectionally and seamlessly over WebSockets.
- **Robust Barge-in Pipeline**: Implemented precise generation ID tracking. Interrupting the voice agent now safely flushes downstream TTS buffers and instantly aborts active LLM requests without hanging.
- **E2E Acceptance Testing**: Integration tests now execute against real external APIs, asserting correctly structured payloads and dynamic model behavior instead of hardcoded strings.

## Phase 6: Full-Fidelity DOM Integration (Final Validation)
- **Puppeteer E2E Automation**: Tests now instantiate a real headless browser evaluating the exact `public/index.html` frontend, replacing brittle jsdom mock strings and proving real Web Audio API integration.
- **Audio Fixture Correctness**: Tests inject a structurally-valid, 1-frame RIFF WAV fixture in mock-mode, forcing the underlying `AudioContext.decodeAudioData` execution path to run cleanly without silent buffer errors.
- **Provider Cancellation**: Extended cancellation controls to strictly use the `AbortController` against the Google AI provider SDK (`model.generateContent`). Client disconnects instantly terminate any active model-generation loop or billing cycles.


## Production Operations & Release Runbook (v0.2.0 Update)

### 1. Production Container Invocation (GHCR)
```bash
# Pull production image:
docker pull ghcr.io/sumitdalavi/voice-incident-commander:v0.2.0

# Run container with Gemini API credentials:
docker run -d \
  --name voice-incident-commander \
  -p 4005:4005 \
  -e GEMINI_API_KEY="your-gemini-api-key" \
  ghcr.io/sumitdalavi/voice-incident-commander:v0.2.0

# Note: If no API key is provided, the platform boots in full mock mode for safe offline evaluation.
```

### 2. Browser Audio Interface & Operational Verification
1. Open `http://localhost:4005` in Google Chrome or Microsoft Edge.
2. Grant microphone permissions when prompted.
3. Click **"Start Voice Session"** and speak:
   - *"Commander, what is the health status of the payments service?"*
   - Verify real-time STT transcription and audible TTS voice response.
4. Test safety confirmation gate:
   - Speak: *"Commander, delete the malfunctioning pod payment-service-pod-1."*
   - Observe that the action is **NOT** executed until the on-screen visual confirmation button is clicked.
5. Test barge-in interruption:
   - Speak while the commander is talking; verify instant speech interruption and buffer flushing.

### 3. Release Integrity & Verification Runbook
To verify the authentic origin and file integrity of release packages:
```bash
# Download distribution package and checksums:
gh release download v0.2.0 --repo SumitDalavi/voice-incident-commander --pattern "*.tar.gz" --pattern "checksums.txt"

# Assert cryptographic match:
sha256sum -c checksums.txt

# Inspect SPDX 2.3 Software Bill of Materials:
gh release download v0.2.0 --repo SumitDalavi/voice-incident-commander --pattern "sbom.spdx.json"
cat sbom.spdx.json | jq .packages[0].name
```

### 4. Operational Failure Modes & Troubleshooting
- **Port Collisions:** If the host port is in use, remap using `-p <ALTERNATIVE_PORT>:<CONTAINER_PORT>`.
- **Docker Daemon Permissions:** For tools requiring container orchestrator control (`agent-sandbox-platform`), ensure `/var/run/docker.sock` has read/write permissions for the runner user.
- **GHCR Pull Authentication:** If pulling from GHCR encounters rate limits or private scope:
  ```bash
  echo "$GITHUB_TOKEN" | docker login ghcr.io -u <GITHUB_USERNAME> --password-stdin
  ```
