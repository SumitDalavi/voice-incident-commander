# AGENTS.md: instructions for coding agents

## Mission
Build `voice-incident-commander`: real-time, interruptible voice over a grounded incident backend with on-screen approvals.

## Hard rules
1. **No voice-only approvals.** Any state-changing action requires an on-screen explicit confirmation bound to the proposal id and params hash. Spoken "yes" may open the approval panel but never completes it.
2. **Grounding.** Spoken answers about system state must come from tool results; the response schema carries `evidence_ids`; the UI shows them. If no evidence, the assistant says it does not know.
3. **Barge-in correctness.** On user speech start, playback stops and the assistant turn is cancelled (server-side generation cancelled too). Test this.
4. **Provider abstraction.** Speech-to-text, text-to-speech, and the language model sit behind interfaces. Both a "cascaded" pipeline (STT -> LLM -> TTS) and, optionally, a speech-to-speech realtime provider can implement `VoiceSession`. Confirm each provider's current API from official docs at WP time.
5. **Privacy.** No raw audio is stored by default. Transcripts are stored only with explicit config and redacted. Display a recording indicator whenever the mic is hot.
6. **Fallbacks.** Push-to-talk and text input always work without any speech provider (mock provider).
7. Label live/replay/mock; never present recorded audio as live.
8. No unmeasured latency numbers in docs.

## Layout
```text
contracts/          session events, voice tool schemas, incident bridge
services/voice-gateway/  WebSocket/WebRTC session server (TypeScript)
services/assistant/      dialog manager + tool use + grounding validator
services/bridge/         adapters: project2 API | project3 coordinator | mock backend
apps/web/                mic capture (AudioWorklet), playback, UI, approval panel
eval/                    latency + dialog evaluation harness, audio fixtures
scenarios/               scripted dialogs, audio clips (synthetic), expected outcomes
```
