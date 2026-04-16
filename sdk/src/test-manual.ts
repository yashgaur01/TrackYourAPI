import { TrackYourAPIClient } from "./client";

async function main() {
  // Use the Supabase URL for the tracking endpoint
  const tracker = new TrackYourAPIClient({
    apiKey: "qt_85e5a381f431486199fc724afdcc2924",
    endpoint: "https://dbikmzkqpteicmcpfeew.supabase.co",
    debug: true
  });

  console.log("🚀 Starting TrackYourAPI tracking test...");

  // 1. Success trace (New GPT-5 flagship)
  console.log("\n📡 Sending GPT-5.4 success trace...");
  tracker.track({
    provider: "openai",
    model: "gpt-5.4",
    tokens: 1200,
    cost: 0.009,
    latency: 320
  });

  // 2. Claude 4.6 Opus
  console.log("\n📡 Sending Claude 4.6 Opus trace...");
  tracker.track({
    provider: "anthropic",
    model: "claude-3-opus-4.6",
    tokens: 2500,
    cost: 0.045,
    latency: 1200
  });

  // 3. DeepSeek V4-Lite (Third Party)
  console.log("\n📡 Sending DeepSeek V4-Lite trace...");
  tracker.track({
    provider: "deepseek",
    model: "deepseek-v4-lite",
    tokens: 5000,
    cost: 0.001,
    latency: 180
  });

  // 4. Gemini 2.1 Pro
  console.log("\n📡 Sending Gemini 2.1 Pro trace...");
  tracker.track({
    provider: "google",
    model: "gemini-2.1-pro",
    tokens: 3000,
    cost: 0.0075,
    latency: 250
  });

  console.log("\n✅ 2026 Suite test traces fired. Waiting 2 seconds...");
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("🏁 Done. Check the dashboard for GPT-5 and DeepSeek entries!");
}

main().catch(console.error);
