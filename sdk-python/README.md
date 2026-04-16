# trackyourapi

> Official Python SDK for [TrackYourAPI](https://trackyourapi.ai) — AI API usage tracking & observability

Track every OpenAI, Anthropic, and Gemini call automatically with **3 lines of code**.

## Installation

```bash
pip install trackyourapi
```

## Quick Start

### 1. Get your API key

Sign in to your [TrackYourAPI dashboard](https://trackyourapi.ai/dashboard) → **API Keys** → Generate a key (`qt_xxx`).

### 2. Wrap your AI client

#### OpenAI

```python
from openai import OpenAI
from trackyourapi import wrap_openai

client = wrap_openai(
    OpenAI(api_key="your_openai_key"), 
    api_key="qt_xxx",                             # your TrackYourAPI key
    endpoint="https://dbikmzkqpteicmcpfeew.supabase.co" # your TrackYourAPI endpoint
)

# ✅ All calls are now auto-tracked — no other changes needed
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

#### Anthropic

```python
import anthropic
from trackyourapi import wrap_anthropic

client = wrap_anthropic(
    anthropic.Anthropic(api_key="your_anthropic_key"),
    api_key="qt_xxx",
    endpoint="https://dbikmzkqpteicmcpfeew.supabase.co"
)

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## What Gets Tracked

| Field | Description |
|---|---|
| `provider` | `openai` / `anthropic` / `google` |
| `model` | Exact model name (e.g. `gpt-4o`, `claude-3-5-sonnet-20241022`) |
| `tokens` | Total tokens (prompt + completion) |
| `cost` | USD cost calculated from official pricing tables |
| `latency` | Request duration in milliseconds |

## Use with Standard OpenAI Environment Variables

If you already have `OPENAI_API_KEY` set:

```python
import os
from openai import OpenAI
from trackyourapi import wrap_openai

client = wrap_openai(
    OpenAI(),
    api_key=os.environ.get("TRACKYOURAPI_KEY"),
    endpoint="https://dbikmzkqpteicmcpfeew.supabase.co"
)
```

## License

MIT © TrackYourAPI
