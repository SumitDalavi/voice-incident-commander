const WebSocket = require('ws');
const { spawn } = require('child_process');

async function runTests() {
  console.log("Starting Voice Commander API for Behavioral Tests...");
  const apiProcess = spawn('node', ['server.js'], {
     env: { ...process.env, LLM_API_KEY: '', LLM_MODEL: '' } // Mock mode
  });
  
  // Give API 5 seconds to spin up
  await new Promise(r => setTimeout(r, 5000));
  console.log("Running Behavioral Tests for Voice Incident Commander...");

  // Setup a mock coordinator to count dispatches
  let mockDispatches = 0;
  const mockCoordApp = require('express')();
  mockCoordApp.post('/api/dispatch', (req, res) => {
      mockDispatches++;
      res.json({ success: true });
  });
  const mockCoord = mockCoordApp.listen(3000);

  try {
    const ws1 = new WebSocket('ws://127.0.0.1:4005');
    
    await new Promise((resolve) => ws1.on('open', resolve));
    
    // Simulate query
    ws1.send(JSON.stringify({ type: 'text_input', text: 'Restart the frontend service' }));
    
    let proposalId = null;
    let ttsReceived = false;
    
    await new Promise((resolve, reject) => {
       ws1.on('message', (data) => {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'action_proposal') proposalId = msg.proposal.id;
          if (msg.type === 'tts_chunk' || msg.type === 'tts_mock') ttsReceived = true;
          if (proposalId && ttsReceived) resolve();
       });
       setTimeout(() => reject(new Error("Timeout waiting for proposal and TTS")), 5000);
    });

    console.log(`Received Proposal ID: ${proposalId}. Attempting cross-session approval...`);
    
    // Connect second session
    const ws2 = new WebSocket('ws://127.0.0.1:4005');
    await new Promise((resolve) => ws2.on('open', resolve));

    // Wait for console.error output or just ensure server doesn't crash
    ws2.send(JSON.stringify({ type: 'approve_action', proposal: { id: proposalId, task: 'restart-service' } }));
    
    await new Promise(r => setTimeout(r, 500)); // wait to see if it processes
    
    if (mockDispatches > 0) throw new Error("Cross-session approval resulted in a dispatched action!");

    // Owner approves it
    console.log("Owner session approving action...");
    ws1.send(JSON.stringify({ type: 'approve_action', proposal: { id: proposalId, task: 'restart-service' } }));
    await new Promise(r => setTimeout(r, 500));
    
    if (mockDispatches !== 1) throw new Error(`Owner session approval failed! Expected 1 dispatch, got ${mockDispatches}`);
    
    console.log("Testing replay attack...");
    ws1.send(JSON.stringify({ type: 'approve_action', proposal: { id: proposalId, task: 'restart-service' } }));
    await new Promise(r => setTimeout(r, 500));
    
    if (mockDispatches !== 1) throw new Error(`Replay attack succeeded! Expected 1 dispatch, got ${mockDispatches}`);

    const { spawnSync } = require('child_process');
    console.log("Running browser audio test via Puppeteer...");
    const browserProc = spawnSync('node', ['browser-test.js'], { stdio: 'inherit' });
    if (browserProc.status !== 0) {
        throw new Error("Browser audio test failed!");
    }

    console.log("✅ Voice Incident Commander passed behavioral tests.");
    ws1.close();
    ws2.close();
    apiProcess.kill();
    mockCoord.close();
  } catch (err) {
    console.error("❌ Test Failed:", err);
    apiProcess.kill();
    if (mockCoord) mockCoord.close();
    process.exit(1);
  }
}

runTests();
