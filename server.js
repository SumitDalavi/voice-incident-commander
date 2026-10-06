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

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'barge_in') {
      console.log('Barge-in detected. Canceling turn.');
      currentGenerationId++; // Invalidate previous generation
    } else if (data.type === 'audio_chunk') {
      // Process incoming audio, simulate TTS response
      const responseGeneration = currentGenerationId;
      setTimeout(() => {
        if (responseGeneration === currentGenerationId) {
          ws.send(JSON.stringify({ type: 'tts_chunk', generationId: responseGeneration, data: 'dummy_audio_bytes' }));
        }
      }, 500);
    }
  });
});

server.listen(3000, () => console.log('Voice UI running on http://localhost:3000'));
