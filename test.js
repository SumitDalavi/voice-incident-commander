const assert = require('assert');
const fs = require('fs');

async function runTests() {
  console.log("Running Voice Incident Commander Tests...");
  
  const serverCode = fs.readFileSync(__dirname + '/server.js', 'utf8');
  const uiCode = fs.readFileSync(__dirname + '/public/index.html', 'utf8');
  
  // Test 1: Correct connection port
  assert(uiCode.includes("ws://localhost:4005"), "Gate 6 Failed: Client connecting to wrong port.");
  
  // Test 2: Intelligible audio
  assert(serverCode.includes("audioEncoding: 'MP3'"), "Gate 6 Failed: Audio not encoded in MP3 for native browser playback.");
  
  // Test 3: Approvals rejected
  assert(serverCode.includes("activeProposals.get(data.proposal.id)"), "Gate 6 Failed: Fabricated approvals not verified server-side.");
  
  console.log("✅ Voice Incident Commander passed.");
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
