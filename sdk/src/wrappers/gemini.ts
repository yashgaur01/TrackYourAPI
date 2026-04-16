/**
 * Pricing table for Google Gemini models (USD per 1M tokens).
 * Source: https://ai.google.dev/pricing (Apr 2025)
 */
const GEMINI_PRICING: Record<string, { input: number; output: number }> = {
  // Gemini 2.x (2026 suite)
  "gemini-2.1-pro": { input: 0.5, output: 2.0 },
  "gemini-2.1-flash": { input: 0.05, output: 0.2 },
  "gemini-2.0-pro": { input: 0.8, output: 3.2 },
  // Gemini 2.0
  "gemini-2.0-flash": { input: 0.1, output: 0.4 },
  "gemini-2.0-flash-exp": { input: 0, output: 0 },
  // Gemini 1.5
  "gemini-1.5-pro": { input: 1.25, output: 5 },
  "gemini-1.5-pro-latest": { input: 1.25, output: 5 },
  "gemini-1.5-flash": { input: 0.075, output: 0.3 },
  "gemini-1.5-flash-latest": { input: 0.075, output: 0.3 },
  "gemini-1.5-flash-8b": { input: 0.0375, output: 0.15 },
  // Gemini 1.0
  "gemini-1.0-pro": { input: 0.5, output: 1.5 },
  "gemini-pro": { input: 0.5, output: 1.5 },
};

function calcGeminiCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = GEMINI_PRICING[model] ?? { input: 1.25, output: 5 }; // fallback to 1.5-pro
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
}

/**
 * Wrap a Google Generative AI client to automatically track usage with TrackYourAPI.
 *
 * @example
 * ```ts
 * import { GoogleGenerativeAI } from '@google/generative-ai'
 * import { wrapGemini } from '@trackyourapi/sdk'
 *
 * const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
 * const model = wrapGemini(genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }), {
 *   apiKey: 'qtn_xxx',
 *   endpoint: 'https://your-convex-site.convex.site'
 * })
 *
 * const result = await model.generateContent('Hello!')
 * ```
 */
export function wrapGemini<T extends GeminiModelLike>(
  model: T,
  options: { apiKey: string; endpoint: string; modelName?: string; debug?: boolean }
): T {
  const { TrackYourAPIClient } = require("../client") as typeof import("../client");
  const tracker = new TrackYourAPIClient(options);
  const modelName = options.modelName ?? "gemini-1.5-pro";

  const originalGenerate = model.generateContent.bind(model);

  model.generateContent = async function (...args: Parameters<typeof originalGenerate>) {
    const start = Date.now();
    const result = await originalGenerate(...(args as [any]));
    const latency = Date.now() - start;

    try {
      const response = result as GeminiResponse;
      const metadata = response?.response?.usageMetadata;
      if (metadata) {
        const inputTokens = metadata.promptTokenCount ?? 0;
        const outputTokens = metadata.candidatesTokenCount ?? 0;
        const cost = calcGeminiCost(modelName, inputTokens, outputTokens);

        tracker.track({
          provider: "google",
          model: modelName,
          tokens: inputTokens + outputTokens,
          cost,
          latency,
        });
      }
    } catch {
      // silent
    }

    return result;
  };

  // Also wrap generateContentStream if present
  if (typeof model.generateContentStream === "function") {
    const originalStream = model.generateContentStream.bind(model);

    model.generateContentStream = async function (...args: Parameters<typeof originalStream>) {
      const start = Date.now();
      const result = await originalStream(...(args as [any]));
      const latency = Date.now() - start;

      // Track after stream is consumed — wrap the response
      const originalResponse = result.response;
      result.response = originalResponse.then((r: GeminiResponseInner) => {
        try {
          const metadata = r?.usageMetadata;
          if (metadata) {
            const inputTokens = metadata.promptTokenCount ?? 0;
            const outputTokens = metadata.candidatesTokenCount ?? 0;
            const cost = calcGeminiCost(modelName, inputTokens, outputTokens);
            tracker.track({ provider: "google", model: modelName, tokens: inputTokens + outputTokens, cost, latency });
          }
        } catch { /* silent */ }
        return r;
      });

      return result;
    };
  }

  return model;
}

interface GeminiModelLike {
  generateContent: (...args: any[]) => Promise<any>;
  generateContentStream?: (...args: any[]) => Promise<any>;
}

interface GeminiResponseInner {
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
}

interface GeminiResponse {
  response?: GeminiResponseInner;
}
