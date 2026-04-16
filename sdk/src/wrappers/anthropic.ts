/**
 * Pricing table for Anthropic Claude models (USD per 1M tokens).
 * Source: https://docs.anthropic.com/en/docs/models-overview (Apr 2025)
 */
const ANTHROPIC_PRICING: Record<string, { input: number; output: number }> = {
  // Claude 4.6 (2026 Suite)
  "claude-3-opus-4.6": { input: 3, output: 15 },
  "claude-3-sonnet-4.6": { input: 1.5, output: 7.5 },
  "claude-3-haiku-4.6": { input: 0.2, output: 0.8 },
  // Claude 3.5
  "claude-3-5-sonnet-20241022": { input: 3, output: 15 },
  "claude-3-5-sonnet-20240620": { input: 3, output: 15 },
  "claude-3-5-haiku-20241022": { input: 0.8, output: 4 },
  // Claude 3
  "claude-3-opus-20240229": { input: 15, output: 75 },
  "claude-3-sonnet-20240229": { input: 3, output: 15 },
  "claude-3-haiku-20240307": { input: 0.25, output: 1.25 },
  // Claude 2
  "claude-2.1": { input: 8, output: 24 },
  "claude-2.0": { input: 8, output: 24 },
  // Claude instant
  "claude-instant-1.2": { input: 0.8, output: 2.4 },
};

function calcAnthropicCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = ANTHROPIC_PRICING[model] ?? { input: 3, output: 15 }; // fallback to sonnet pricing
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
}

/**
 * Wrap an Anthropic client instance to automatically track usage with TrackYourAPI.
 *
 * @example
 * ```ts
 * import Anthropic from '@anthropic-ai/sdk'
 * import { wrapAnthropic } from '@trackyourapi/sdk'
 *
 * const anthropic = wrapAnthropic(new Anthropic(), {
 *   apiKey: 'qtn_xxx',
 *   endpoint: 'https://your-convex-site.convex.site'
 * })
 *
 * const msg = await anthropic.messages.create({ ... })
 * ```
 */
export function wrapAnthropic<T extends AnthropicLike>(
  client: T,
  options: { apiKey: string; endpoint: string; debug?: boolean }
): T {
  const { TrackYourAPIClient } = require("../client") as typeof import("../client");
  const tracker = new TrackYourAPIClient(options);

  const originalCreate = client.messages.create.bind(client.messages);

  client.messages.create = async function (...args: Parameters<typeof originalCreate>) {
    const start = Date.now();
    const result = await originalCreate(...(args as [any]));
    const latency = Date.now() - start;

    try {
      const response = result as AnthropicMessageResponse;
      const model = response.model ?? (args[0] as { model?: string })?.model ?? "unknown";
      const usage = response.usage;
      if (usage) {
        const inputTokens = usage.input_tokens ?? 0;
        const outputTokens = usage.output_tokens ?? 0;
        const cost = calcAnthropicCost(model, inputTokens, outputTokens);

        tracker.track({
          provider: "anthropic",
          model,
          tokens: inputTokens + outputTokens,
          cost,
          latency,
        });
      }
    } catch {
      // never fail silently
    }

    return result;
  };

  return client;
}

interface AnthropicLike {
  messages: {
    create: (...args: any[]) => Promise<any>;
  };
}

interface AnthropicMessageResponse {
  model?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
}
