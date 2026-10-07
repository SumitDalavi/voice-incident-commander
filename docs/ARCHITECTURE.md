# Architecture: Voice Incident Commander (VIC)

## Overview
VIC provides a highly-responsive voice interface for incident command. Its primary technical differentiator is its robust handling of human barge-in (interruption), ensuring that network latency and stale audio buffers never result in the bot talking over the user.

## Components
1. **Web Audio Frontend**:
   - Uses `navigator.mediaDevices.getUserMedia` and `MediaRecorder` for capturing PCM audio chunks.
   - Uses the Web Audio API (`AudioContext`) to seamlessly queue and play incoming synthesized speech chunks.
2. **WebSocket Server**:
   - Maintains a bidirectional binary stream.
   - Simulates STT (Speech-to-Text), LLM generation, and TTS (Text-to-Speech).
3. **Barge-in Logic**:
   - Tracks a global `generationId`.
   - When the user interrupts, the frontend halts all playing `AudioNodes`, flushes its queue, and signals the server.
   - The server increments the `generationId` and drops all active TTS buffers. Any late-arriving packets are silently discarded by the client if their `generationId` is stale.


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
