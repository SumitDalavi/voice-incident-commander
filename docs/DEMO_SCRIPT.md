# Demo Script

1. **Start the Stack**: Run `make dev` in the root.
2. **Open UI**: Open `ui/public/index.html` in your browser.
3. **Trigger Interaction**: 
   - Click "Simulate Text Query (Fallback)" or hold the Microphone button.
   - The UI transcript will show the bot begins to generate a response.
4. **Listen**: The browser will begin playing the binary audio chunks (or simulating it if strict mocked WAV headers are used).
5. **Test Barge-in**: 
   - While the bot is speaking (or generating), press the Microphone button again.
   - Observe the transcript: the generation is immediately cancelled, audio nodes are stopped, and stale chunks are logged as discarded.
