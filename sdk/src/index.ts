/**
 * @trackyourapi/sdk
 * Official JavaScript/TypeScript SDK for TrackYourAPI — AI API observability
 *
 * Usage:
 *   import { wrapOpenAI } from '@trackyourapi/sdk'
 *   const openai = wrapOpenAI(new OpenAI(), { apiKey: 'qtn_xxx', endpoint: '...' })
 */

export { TrackYourAPIClient } from "./client";
export type { TrackYourAPIOptions, TrackPayload } from "./client";

export { wrapOpenAI } from "./wrappers/openai";
export { wrapAnthropic } from "./wrappers/anthropic";
export { wrapGemini } from "./wrappers/gemini";
