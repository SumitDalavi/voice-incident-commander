const fs = require('fs');

const replacement = `## Phase 5.1 Update: Live API Integrations & Gemini Adoption
- **Live AI Integrations**: Completely replaced the mock backend with \`@google/generative-ai\` (Gemini 2.5 Pro) for contextual reasoning, \`@google-cloud/speech\` for real-time STT, and \`@google-cloud/text-to-speech\` for realistic TTS generation.
- **WebSocket Binary Audio**: Implemented true \`LINEAR16\` PCM audio capturing using \`AudioContext\` in the browser, streaming it bidirectionally and seamlessly over WebSockets.
- **Robust Barge-in Pipeline**: Implemented precise generation ID tracking. Interrupting the voice agent now safely flushes downstream TTS buffers and instantly aborts active LLM requests without hanging.
- **E2E Acceptance Testing**: Integration tests now execute against real external APIs, asserting correctly structured payloads and dynamic model behavior instead of hardcoded strings.
`;

const targetPattern = /## Phase 5: Final Correctness & Behavioral Test Hardening \(Completed\)[\s\S]*?adherence to correctness over naive assumptions\./;

['docs/ARCHITECTURE.md', 'docs/RUNBOOK.md', 'README.md'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // First, find the text to replace.
  const match = content.match(targetPattern);
  if (match) {
    // Append the new text after the match
    content = content.replace(targetPattern, match[0] + '\n\n\n' + replacement.trim());
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find target pattern in ${file}`);
  }
});
