# @trackyourapi/sdk

> Official JavaScript/TypeScript SDK for [TrackYourAPI](https://trackyourapi.ai) — AI API usage tracking & observability

Track every OpenAI, Anthropic, and Gemini call automatically with **3 lines of code**.

## Installation

```bash
npm install @trackyourapi/sdk
# or
bun add @trackyourapi/sdk
# or
pip install trackyourapi  # Python
```

## Quick Start

### 1. Get your API key

Sign in to your [TrackYourAPI dashboard](https://trackyourapi.ai/dashboard) → **API Keys** → Generate a key (`qtn_xxx`).

### 2. Wrap your AI client

#### OpenAI

```ts
import OpenAI from 'openai'
import { wrapOpenAI } from '@trackyourapi/sdk'

const openai = wrapOpenAI(new OpenAI({ apiKey: process.env.OPENAI_API_KEY }), {
  apiKey: 'qtn_xxx',                          // your TrackYourAPI key
  endpoint: 'https://YOUR.convex.site',       // your TrackYourAPI endpoint
})

// ✅ All calls are now auto-tracked — no other changes needed
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
})
```

#### Anthropic

```ts
import Anthropic from '@anthropic-ai/sdk'
import { wrapAnthropic } from '@trackyourapi/sdk'

const anthropic = wrapAnthropic(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }), {
  apiKey: 'qt_xxx',
  endpoint: 'https://dbikmzkqpteicmcpfeew.supabase.co',
})

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }],
})
```

#### Google Gemini

```ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { wrapGemini } from '@trackyourapi/sdk'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = wrapGemini(
  genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }),
  { apiKey: 'qt_xxx', endpoint: 'https://dbikmzkqpteicmcpfeew.supabase.co', modelName: 'gemini-1.5-pro' }
)

const result = await model.generateContent('Explain quantum computing')
```

## What Gets Tracked

| Field | Description |
|---|---|
| `provider` | `openai` / `anthropic` / `google` |
| `model` | Exact model name (e.g. `gpt-4o`, `claude-3-5-sonnet-20241022`) |
| `tokens` | Total tokens (prompt + completion) |
| `cost` | USD cost calculated from official pricing tables |
| `latency` | Request duration in milliseconds |

## Manual Tracking (any provider)

If your provider isn't wrapped yet, track manually:

```ts
import { TrackYourAPIClient } from '@trackyourapi/sdk'

const trackyourapi = new TrackYourAPIClient({
  apiKey: 'qt_xxx',
  endpoint: 'https://dbikmzkqpteicmcpfeew.supabase.co',
})

// After your AI call:
trackyourapi.track({
  provider: 'mistral',
  model: 'mistral-large',
  tokens: 1500,
  cost: 0.004,
  latency: 320,
})
```

## Pricing Tables

The SDK ships with built-in pricing for:
- **OpenAI**: GPT-4o, GPT-4o-mini, GPT-4 Turbo, GPT-3.5, o1, o3-mini
- **Anthropic**: Claude 3.5 Sonnet/Haiku, Claude 3 Opus/Sonnet/Haiku, Claude 2
- **Google**: Gemini 2.0 Flash, Gemini 1.5 Pro/Flash

## Options

```ts
interface TrackYourAPIOptions {
  apiKey: string;     // Required. Your qt_xxx key
  endpoint: string;   // Required. Your TrackYourAPI site URL
  debug?: boolean;    // Optional. Log tracking errors to console (default: false)
}
```

## Python SDK

```python
from openai import OpenAI
from trackyourapi import wrap_openai

client = wrap_openai(OpenAI(), api_key="qt_xxx", endpoint="https://dbikmzkqpteicmcpfeew.supabase.co")
response = client.chat.completions.create(...)  # auto-tracked
```

See [`sdk-python/`](../sdk-python/README.md) for full Python docs.

## License

MIT © TrackYourAPI
