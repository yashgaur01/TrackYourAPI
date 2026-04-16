"""
OpenAI wrapper for TrackYourAPI Python SDK.
"""

import time
from typing import Any
from ..client import TrackYourAPIClient

# Pricing: USD per 1M tokens (input, output)
_PRICING = {
    # GPT-5 (2026 Suite)
    "gpt-5.4": (1.5, 6.0),
    "gpt-5.3-codex": (1.2, 4.8),
    "gpt-5.2": (1.0, 4.0),
    "gpt-5-mini": (0.1, 0.4),
    # GPT-4o
    "gpt-4o": (2.5, 10.0),
    "gpt-4o-mini": (0.15, 0.6),
    "gpt-4-turbo": (10.0, 30.0),
    "gpt-4": (30.0, 60.0),
    "gpt-3.5-turbo": (0.5, 1.5),
    "o1": (15.0, 60.0),
    "o1-mini": (3.0, 12.0),
    "o3-mini": (1.1, 4.4),
    # Third-party via OpenAI compatible API
    "deepseek-chat": (0.14, 0.28),
    "deepseek-reasoner": (0.55, 2.19),
    "deepseek-v4-lite": (0.05, 0.15),
    "moonshot-v1-8k": (0.6, 2.5),
    "moonshot-v1-32k": (1.15, 8.0),
    "glm-4": (10.0, 10.0),
    "glm-4.7": (0.5, 0.5),
    "glm-4-flash": (0, 0),
    "sonar": (1.0, 1.0),
    "sonar-pro": (3.0, 15.0),
    "grok-4.1": (1.0, 4.0),
    "llama-4-scout": (0.1, 0.1),
}


def _calc_cost(model: str, prompt_tokens: int, completion_tokens: int) -> float:
    input_price, output_price = _PRICING.get(model, (2.5, 10.0))
    return (prompt_tokens * input_price + completion_tokens * output_price) / 1_000_000


def wrap_openai(client: Any, *, api_key: str, endpoint: str, provider: str = "openai", debug: bool = False) -> Any:
    """
    Wrap an OpenAI client to auto-track usage with TrackYourAPI.

    Example::

        from openai import OpenAI
        from trackyourapi import wrap_openai

        client = wrap_openai(OpenAI(), api_key="qtn_xxx", endpoint="https://YOUR.convex.site")

        # All calls are now tracked
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": "Hello!"}],
        )
    """
    tracker = TrackYourAPIClient(api_key=api_key, endpoint=endpoint, debug=debug)
    original_create = client.chat.completions.create

    def patched_create(*args: Any, **kwargs: Any) -> Any:
        start = time.monotonic()
        response = original_create(*args, **kwargs)
        latency_ms = (time.monotonic() - start) * 1000

        try:
            model = getattr(response, "model", kwargs.get("model", "unknown"))
            usage = getattr(response, "usage", None)
            if usage:
                prompt_tokens = getattr(usage, "prompt_tokens", 0) or 0
                completion_tokens = getattr(usage, "completion_tokens", 0) or 0
                total_tokens = getattr(usage, "total_tokens", prompt_tokens + completion_tokens) or 0
                cost = _calc_cost(model, prompt_tokens, completion_tokens)
                tracker.track(
                    provider=provider,
                    model=model,
                    tokens=total_tokens,
                    cost=cost,
                    latency=latency_ms,
                )
        except Exception:
            pass  # never break the app

        return response

    client.chat.completions.create = patched_create
    return client
