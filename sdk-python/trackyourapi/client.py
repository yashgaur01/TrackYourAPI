"""
Core TrackYourAPI tracking client for Python.
"""

import threading
import urllib.request
import json
from typing import Optional


class TrackYourAPIClient:
    """
    Sends usage tracking events to the TrackYourAPI /api/track endpoint.
    All sends are fire-and-forget (background thread) so they never block your app.
    """

    def __init__(self, api_key: str, endpoint: str, debug: bool = False):
        self.api_key = api_key
        self.endpoint = endpoint.rstrip("/")
        self.debug = debug

    def track(
        self,
        *,
        provider: str,
        model: str,
        tokens: int,
        cost: float,
        latency: float,
    ) -> None:
        """Fire-and-forget: send a usage event in a background thread."""
        payload = {
            "provider": provider,
            "model": model,
            "tokens": tokens,
            "cost": cost,
            "latency": latency,
        }
        thread = threading.Thread(
            target=self._send,
            args=(payload,),
            daemon=True,
        )
        thread.start()

    def _send(self, payload: dict) -> None:
        try:
            url = f"{self.endpoint}/functions/v1/track"
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=data,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                if self.debug:
                    print(f"[TrackYourAPI] Tracked: {resp.status}")
        except Exception as e:
            if self.debug:
                print(f"[TrackYourAPI] Failed to track: {e}")
