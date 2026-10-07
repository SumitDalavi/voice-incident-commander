require('dotenv').config();
const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const axios = require('axios');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Setup Clients
const sttClient = new speech.SpeechClient();
const ttsClient = new textToSpeech.TextToSpeechClient();
const genAI = process.env.LLM_API_KEY ? new GoogleGenerativeAI(process.env.LLM_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: process.env.LLM_MODEL || 'gemini-1.5-flash' }) : null;

const INCIDENT_API_URL = process.env.INCIDENT_API_URL || 'http://localhost:4000';
const MESH_COORDINATOR_URL = process.env.MESH_COORDINATOR_URL || 'http://localhost:3000';

const activeProposals = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected for Voice Commander');
  let currentGenerationId = 0;
  let isGenerating = false;
  let recognizeStream = null;
  let conversationHistory = [];

  const startRecognizeStream = () => {
    if (recognizeStream) return;
    recognizeStream = sttClient.streamingRecognize({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
      },
      interimResults: true,
    })
    .on('error', console.error)
    .on('data', data => {
      const result = data.results[0];
      if (result && result.alternatives[0]) {
        const transcript = result.alternatives[0].transcript;
        ws.send(JSON.stringify({ type: 'transcript_update', text: transcript, isFinal: result.isFinal }));
        if (result.isFinal) {
          handleUserUtterance(transcript);
          recognizeStream.end();
          recognizeStream = null;
        }
      }
    });
  };

  const handleUserUtterance = async (text) => {
    if (isGenerating) return;
    isGenerating = true;
    currentGenerationId++;
    const genId = currentGenerationId;
    
    conversationHistory.push({ role: 'user', parts: [{ text }] });
    
    try {
      let responseText = "I received your message but no LLM is configured.";
      let actionProposal = null;
      
      if (model) {
        let incidentContext = "";
        try {
          // Real backend fetch
          const incRes = await axios.get(`${INCIDENT_API_URL}/api/incidents`);
          incidentContext = `Active incidents: ${JSON.stringify(incRes.data)}`;
        } catch (e) {
          incidentContext = "No active incidents fetched.";
        }

        const prompt = `System context: ${incidentContext}\nYou are an incident responder agent. If the user asks to analyze telemetry or restart a service or check cves, respond with an action tag <ACTION>{"task":"analyze-telemetry"}</ACTION>. Otherwise just answer concisely.\nUser: ${text}`;
        
        const result = await model.generateContent(prompt);
        const fullResponse = result.response.text();
        
        const actionMatch = fullResponse.match(/<ACTION>(.*?)<\/ACTION>/);
        if (actionMatch) {
          actionProposal = JSON.parse(actionMatch[1]);
          actionProposal.id = crypto.randomUUID();
          activeProposals.set(actionProposal.id, actionProposal);
          responseText = fullResponse.replace(/<ACTION>.*?<\/ACTION>/, '').trim();
        } else {
          responseText = fullResponse.trim();
        }
      }

      if (genId !== currentGenerationId) return; // Barge-in

      conversationHistory.push({ role: 'model', parts: [{ text: responseText }] });
      ws.send(JSON.stringify({ type: 'transcript', text: responseText, generationId: genId }));

      if (actionProposal) {
        ws.send(JSON.stringify({ type: 'action_proposal', proposal: actionProposal, generationId: genId }));
      }

      const request = {
        input: { text: responseText },
        voice: { languageCode: 'en-US', name: 'en-US-Standard-A' },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [ttsResponse] = await ttsClient.synthesizeSpeech(request);
      
      if (genId !== currentGenerationId) return;
      
      const audioBuffer = ttsResponse.audioContent;
      ws.send(JSON.stringify({ type: 'tts_chunk', generationId: genId, audio: audioBuffer.toString('base64') }));
      isGenerating = false;
      
    } catch (e) {
      console.error(e);
      isGenerating = false;
    }
  };

  ws.on('message', (message, isBinary) => {
    if (isBinary) {
      if (isGenerating) {
        console.log(`Barge-in detected. Canceling turn ${currentGenerationId}.`);
        currentGenerationId++; 
        isGenerating = false;
      }
      if (!recognizeStream) startRecognizeStream();
      recognizeStream.write(message);
    } else {
      const data = JSON.parse(message);
      if (data.type === 'barge_in') {
        currentGenerationId++; 
        isGenerating = false;
        if (recognizeStream) {
          recognizeStream.end();
          recognizeStream = null;
        }
      } else if (data.type === 'text_input') {
        handleUserUtterance(data.text);
      } else if (data.type === 'approve_action') {
        const storedProposal = activeProposals.get(data.proposal.id);
        if (!storedProposal) {
          console.error("Attempted to approve unknown or expired proposal.");
          return;
        }
        console.log("Action approved:", storedProposal.id);
        axios.post(`${MESH_COORDINATOR_URL}/api/dispatch`, {
          incidentId: "INC-1001",
          tasks: [storedProposal.task]
        }).catch(e => console.error("Coordinator error", e.message));
        activeProposals.delete(storedProposal.id);
      }
    }
  });

  ws.on('close', () => {
    if (recognizeStream) recognizeStream.end();
  });
});

server.listen(4005, () => console.log('Voice UI running on http://localhost:4005'));
