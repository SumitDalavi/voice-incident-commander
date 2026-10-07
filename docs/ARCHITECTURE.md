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
