"""
Google Gemini wrapper for TrackYourAPI Python SDK.
"""

import time
from typing import Any
from ..client import TrackYourAPIClient

# Pricing: USD per 1M tokens (input, output)
_PRICING = {
    # Gemini 2.x (2026 suite)
    "gemini-2.1-pro": (0.5, 2.0),
    "gemini-2.1-flash": (0.05, 0.2),
    "gemini-2.0-pro": (0.8, 3.2),
    # Gemini 2.0
    "gemini-2.0-flash": (0.1, 0.4),
    "gemini-1.5-pro": (1.25, 5.0),
    "gemini-1.5-flash": (0.075, 0.3),
    "gemini-1.5-flash-8b": (0.0375, 0.15),
    "gemini-1.0-pro": (0.5, 1.5),
}

def _calc_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    input_price, output_price = _PRICING.get(model, (1.25, 5.0))
    return (input_tokens * input_price + output_tokens * output_price) / 1_000_000


def wrap_gemini(model_instance: Any, *, api_key: str, endpoint: str, model_name: str = "gemini-1.5-pro", debug: bool = False) -> Any:
    """
    Wrap a Google Generative AI model instance to auto-track usage.

    Example::

        import google.generativeai as genai
        from trackyourapi import wrap_gemini

        genai.configure(api_key="...")
        model = genai.GenerativeModel('gemini-1.5-flash')
        model = wrap_gemini(model, api_key="qtn_xxx", endpoint="https://YOUR.convex.site")

        response = model.generate_content("Hello!")
    """
    tracker = TrackYourAPIClient(api_key=api_key, endpoint=endpoint, debug=debug)
    original_generate = model_instance.generate_content

    def patched_generate(*args: Any, **kwargs: Any) -> Any:
        start = time.monotonic()
        response = original_generate(*args, **kwargs)
        latency_ms = (time.monotonic() - start) * 1000

        try:
            # metadata in Python SDK: response.usage_metadata
            usage = getattr(response, "usage_metadata", None)
            if usage:
                input_tokens = getattr(usage, "prompt_token_count", 0) or 0
                output_tokens = getattr(usage, "candidates_token_count", 0) or 0
                cost = _calc_cost(model_name, input_tokens, output_tokens)
                tracker.track(
                    provider="google",
                    model=model_name,
                    tokens=input_tokens + output_tokens,
                    cost=cost,
                    latency=latency_ms,
                )
        except Exception:
            pass

        return response

    model_instance.generate_content = patched_generate
    return model_instance
