const puppeteer = require('puppeteer');

async function runBrowserAudioTest() {
    console.log("Running real browser integration test on index.html...");
    
    const browser = await puppeteer.launch({ 
        headless: true, 
        args: [
            '--no-sandbox', 
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream'
        ] 
    });
    const page = await browser.newPage();
    
    // We navigate to the actual UI being served by the test server process
    await page.goto('http://127.0.0.1:4005');
    
    // Inject a spy into audioCtx to check if decodeAudioData succeeds
    await page.evaluate(() => {
        window.testLog = [];
        // The page defines audioCtx at the top level
        const originalDecode = window.AudioContext.prototype.decodeAudioData;
        window.AudioContext.prototype.decodeAudioData = async function(...args) {
            window.testLog.push('decode_start');
            try {
               const res = await originalDecode.apply(this, args);
               window.testLog.push('decode_end');
               return res;
            } catch (e) {
               window.testLog.push('decode_error');
               throw e;
            }
        };
    });

    // 1. Simulate Text Query
    await page.evaluate(() => {
        // mock prompt
        window.prompt = () => "Restart the frontend service";
        document.querySelector('button[onclick="simulateTextRequest()"]').click();
    });

    // wait for decode_start
    await page.waitForFunction(() => window.testLog.includes('decode_start'), { timeout: 10000 });
    
    // Check logs
    const logs = await page.evaluate(() => window.testLog);
    if (!logs.includes('decode_end')) {
        throw new Error("Failed to properly decode valid audio fixture!");
    }
    
    await browser.close();
    console.log("✅ Browser Audio Test Passed");
}

runBrowserAudioTest().catch(err => {
    console.error("❌ Browser Audio Test Failed:", err);
    process.exit(1);
});
