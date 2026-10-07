const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected for Voice Commander');
  let currentGenerationId = 0;
  let ttsTimeout = null;
  let isGenerating = false;

  ws.on('message', (message, isBinary) => {
    if (isBinary) {
      // Receive raw audio from client (Mock STT processing)
      // In a real app, this would stream to Whisper API
      // We simulate detecting end-of-speech after receiving some audio
      if (!isGenerating) {
        isGenerating = true;
        // Simulate LLM + TTS delay
        ttsTimeout = setTimeout(() => {
          simulateTTSResponse(ws, currentGenerationId);
          isGenerating = false;
        }, 1500);
      }
    } else {
      const data = JSON.parse(message);
      if (data.type === 'barge_in') {
        console.log(`Barge-in detected. Canceling turn ${currentGenerationId}.`);
        currentGenerationId++; // Invalidate active generation
        isGenerating = false;
        if (ttsTimeout) clearTimeout(ttsTimeout);
      } else if (data.type === 'text_input') {
        // Fallback or explicit trigger
        currentGenerationId++;
        isGenerating = true;
        ttsTimeout = setTimeout(() => {
          simulateTTSResponse(ws, currentGenerationId);
          isGenerating = false;
        }, 500);
      }
    }
  });
});

function simulateTTSResponse(ws, genId) {
  // We send a JSON metadata packet first so UI knows a response is starting
  ws.send(JSON.stringify({ type: 'transcript', text: 'I am looking into the incident. The Checkout service has high latency.', generationId: genId }));
  
  // Then we simulate streaming binary audio chunks
  let chunksSent = 0;
  const interval = setInterval(() => {
    if (chunksSent >= 5) {
      clearInterval(interval);
      return;
    }
    // We send a small JSON wrapper containing the base64 audio and generationId. 
    // In strict binary protocols, you'd prepend a header byte for the genId.
    const fakeAudioData = "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="; // Minimal valid WAV header for demo
    ws.send(JSON.stringify({ 
      type: 'tts_chunk', 
      generationId: genId, 
      audio: fakeAudioData 
    }));
    chunksSent++;
  }, 200);
}

server.listen(3000, () => console.log('Voice UI running on http://localhost:3000'));
