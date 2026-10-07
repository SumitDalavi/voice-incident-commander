const puppeteer = require('puppeteer');

async function runBrowserAudioTest() {
    console.log("Running browser audio decoding interruption test...");
    
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // We mock a browser audio playback queue and interrupt it
    const html = `
    <html>
    <body>
        <script>
            window.testLog = [];
            window.audioQueue = [];
            window.isPlaying = false;
            window.currentSource = null;

            // Mock audio context
            window.audioContext = {
                decodeAudioData: async (buf) => {
                    return new Promise((resolve, reject) => {
                        window.testLog.push('decode_start');
                        // simulate async decoding
                        setTimeout(() => {
                           if (window.interruptRequested) {
                               window.testLog.push('decode_aborted');
                               reject(new Error("Interrupted"));
                           } else {
                               window.testLog.push('decode_end');
                               resolve({ duration: 1 });
                           }
                        }, 200);
                    });
                }
            };

            async function playNext() {
                if (window.audioQueue.length === 0) {
                    window.isPlaying = false;
                    return;
                }
                window.isPlaying = true;
                const chunk = window.audioQueue.shift();
                
                try {
                    const buffer = new Uint8Array(chunk).buffer;
                    const audioBuffer = await window.audioContext.decodeAudioData(buffer);
                    window.testLog.push('play_start');
                    
                    window.currentSource = {
                        stop: () => { window.testLog.push('play_stopped'); }
                    };
                    
                    // simulate play
                    setTimeout(() => {
                        window.testLog.push('play_end');
                        playNext();
                    }, 100);
                } catch (e) {
                    window.testLog.push('play_error');
                    // do not restart playback if interrupted!
                }
            }

            window.enqueueAudio = (chunk) => {
                window.audioQueue.push(chunk);
                if (!window.isPlaying) playNext();
            };

            window.interruptAudio = () => {
                window.interruptRequested = true;
                window.audioQueue = [];
                if (window.currentSource) {
                    window.currentSource.stop();
                }
            };
        </script>
    </body>
    </html>
    `;
    
    await page.setContent(html);
    
    // 1. Enqueue chunk 1
    await page.evaluate(() => window.enqueueAudio([1, 2, 3]));
    
    // Wait slightly so decode starts
    await new Promise(r => setTimeout(r, 50));
    
    // 2. Interrupt during decode
    await page.evaluate(() => window.interruptAudio());
    
    // 3. Wait for decode to finish/abort
    await new Promise(r => setTimeout(r, 300));
    
    const logs = await page.evaluate(() => window.testLog);
    
    await browser.close();
    
    console.log("Audio interruption test log:", logs);
    
    if (!logs.includes('decode_start')) throw new Error("Decoding didn't start");
    if (!logs.includes('decode_aborted')) throw new Error("Decoding wasn't properly aborted/interrupted");
    if (logs.includes('play_start')) throw new Error("Playback restarted after being interrupted!");
    if (logs.includes('play_end')) throw new Error("Playback reached end despite interruption!");
    
    console.log("✅ Browser Audio Test Passed");
}

runBrowserAudioTest().catch(err => {
    console.error("❌ Browser Audio Test Failed:", err);
    process.exit(1);
});
