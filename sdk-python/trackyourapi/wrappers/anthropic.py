"""
Anthropic wrapper for TrackYourAPI Python SDK.
"""

import time
from typing import Any
from ..client import TrackYourAPIClient

_PRICING = {
    # Claude 4.6 (2026 Suite)
    "claude-3-opus-4.6": (3.0, 15.0),
    "claude-3-sonnet-4.6": (1.5, 7.5),
    "claude-3-haiku-4.6": (0.2, 0.8),
    # Claude 3.5
    "claude-3-5-sonnet-20241022": (3.0, 15.0),
    "claude-3-5-sonnet-20240620": (3.0, 15.0),
    "claude-3-5-haiku-20241022": (0.8, 4.0),
    # Claude 3
    "claude-3-opus-20240229": (15.0, 75.0),
    "claude-3-sonnet-20240229": (3.0, 15.0),
    "claude-3-haiku-20240307": (0.25, 1.25),
    # Claude 2
    "claude-2.1": (8.0, 24.0),
    "claude-2.0": (8.0, 24.0),
}

def _calc_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    input_price, output_price = _PRICING.get(model, (3.0, 15.0))
    return (input_tokens * input_price + output_tokens * output_price) / 1_000_000


def wrap_anthropic(client: Any, *, api_key: str, endpoint: str, debug: bool = False) -> Any:
    """
    Wrap an Anthropic client to auto-track usage with TrackYourAPI.

    Example::

        from anthropic import Anthropic
        from trackyourapi import wrap_anthropic

        client = wrap_anthropic(Anthropic(), api_key="qtn_xxx", endpoint="https://YOUR.convex.site")
        msg = client.messages.create(model="claude-3-5-sonnet-20241022", ...)
    """
    tracker = TrackYourAPIClient(api_key=api_key, endpoint=endpoint, debug=debug)
    original_create = client.messages.create

    def patched_create(*args: Any, **kwargs: Any) -> Any:
        start = time.monotonic()
        response = original_create(*args, **kwargs)
        latency_ms = (time.monotonic() - start) * 1000

        try:
            model = getattr(response, "model", kwargs.get("model", "unknown"))
            usage = getattr(response, "usage", None)
            if usage:
                input_tokens = getattr(usage, "input_tokens", 0) or 0
                output_tokens = getattr(usage, "output_tokens", 0) or 0
                cost = _calc_cost(model, input_tokens, output_tokens)
                tracker.track(
                    provider="anthropic",
                    model=model,
                    tokens=input_tokens + output_tokens,
                    cost=cost,
                    latency=latency_ms,
                )
        except Exception:
            pass

        return response

    client.messages.create = patched_create
    return client
