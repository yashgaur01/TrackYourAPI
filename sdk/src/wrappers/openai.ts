/**
 * Pricing table for OpenAI models (USD per 1M tokens).
 * Source: https://openai.com/pricing (updated Apr 2025)
 */
const OPENAI_PRICING: Record<string, { input: number; output: number }> = {
  // GPT-5 (2026 Suite)
  "gpt-5.4": { input: 1.5, output: 6 },
  "gpt-5.3-codex": { input: 1.2, output: 4.8 },
  "gpt-5.2": { input: 1, output: 4 },
  "gpt-5-mini": { input: 0.1, output: 0.4 },
  // GPT-4o
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4o-2024-11-20": { input: 2.5, output: 10 },
  "gpt-4o-2024-08-06": { input: 2.5, output: 10 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o-mini-2024-07-18": { input: 0.15, output: 0.6 },
  // GPT-4 Turbo
  "gpt-4-turbo": { input: 10, output: 30 },
  "gpt-4-turbo-preview": { input: 10, output: 30 },
  "gpt-4": { input: 30, output: 60 },
  "gpt-4-32k": { input: 60, output: 120 },
  // GPT-3.5
  "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
  "gpt-3.5-turbo-0125": { input: 0.5, output: 1.5 },
  // o-series
  "o1": { input: 15, output: 60 },
  "o1-mini": { input: 3, output: 12 },
  "o3-mini": { input: 1.1, output: 4.4 },
  // Third-party via OpenAI compatible API (DeepSeek/Kimi/GLM/Search)
  "deepseek-chat": { input: 0.14, output: 0.28 },
  "deepseek-reasoner": { input: 0.55, output: 2.19 },
  "deepseek-v4-lite": { input: 0.05, output: 0.15 },
  "moonshot-v1-8k": { input: 0.6, output: 2.5 },
  "moonshot-v1-32k": { input: 1.15, output: 8.0 },
  "glm-4": { input: 10, output: 10 },
  "glm-4.7": { input: 0.5, output: 0.5 },
  "glm-4-flash": { input: 0, output: 0 },
  "sonar": { input: 1.0, output: 1.0 },
  "sonar-pro": { input: 3.0, output: 15.0 },
  "grok-4.1": { input: 1.0, output: 4.0 },
  "llama-4-scout": { input: 0.1, output: 0.1 },
};

function calcOpenAICost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = OPENAI_PRICING[model] ?? { input: 2.5, output: 10 }; // fallback to gpt-4o price
  return (promptTokens * pricing.input + completionTokens * pricing.output) / 1_000_000;
}

/**
 * Wrap an OpenAI client instance to automatically track usage with TrackYourAPI.
 *
 * @example
 * ```ts
 * import OpenAI from 'openai'
 * import { wrapOpenAI } from '@trackyourapi/sdk'
 *
 * const openai = wrapOpenAI(new OpenAI(), {
 *   apiKey: 'qtn_xxx',
 *   endpoint: 'https://your-convex-site.convex.site'
 * })
 * ```
 */
export function wrapOpenAI<T extends OpenAILike>(
  client: T,
  options: { apiKey: string; endpoint: string; provider?: string; debug?: boolean }
): T {
  const { TrackYourAPIClient } = require("../client") as typeof import("../client");
  const tracker = new TrackYourAPIClient(options);
  const provider = options.provider ?? "openai";

  // Proxy the chat.completions.create method
  const originalCreate = client.chat.completions.create.bind(client.chat.completions);

  client.chat.completions.create = async function (...args: Parameters<typeof originalCreate>) {
    const start = Date.now();
    const result = await originalCreate(...(args as [any]));
    const latency = Date.now() - start;

    try {
      const response = result as ChatCompletionResponse;
      const model = response.model ?? (args[0] as { model?: string })?.model ?? "unknown";
      const usage = response.usage;
      if (usage) {
        const promptTokens = usage.prompt_tokens ?? 0;
        const completionTokens = usage.completion_tokens ?? 0;
        const totalTokens = usage.total_tokens ?? promptTokens + completionTokens;
        const cost = calcOpenAICost(model, promptTokens, completionTokens);

        tracker.track({
          provider,
          model,
          tokens: totalTokens,
          cost,
          latency,
        });
      }
    } catch {
      // never let tracking break the app
    }

    return result;
  };

  return client;
}

// Minimal type shims so the wrapper doesn't require openai as a hard dependency
interface OpenAILike {
  chat: {
    completions: {
      create: (...args: any[]) => Promise<any>;
    };
  };
}

interface ChatCompletionResponse {
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}
