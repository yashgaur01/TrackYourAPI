/**
 * Core TrackYourAPI tracking client.
 * Sends usage data to the TrackYourAPI /api/track endpoint.
 */

export interface TrackYourAPIOptions {
  /** Your TrackYourAPI API key (starts with qtn_) */
  apiKey: string;
  /** The TrackYourAPI tracking endpoint URL */
  endpoint: string;
  /** Whether to log tracking errors to console (default: false) */
  debug?: boolean;
}

export interface TrackPayload {
  provider: string;
  model: string;
  tokens: number;
  cost: number;
  latency: number;
}

export class TrackYourAPIClient {
  private apiKey: string;
  private endpoint: string;
  private debug: boolean;

  constructor(options: TrackYourAPIOptions) {
    this.apiKey = options.apiKey;
    this.endpoint = options.endpoint.replace(/\/$/, ""); // strip trailing slash
    this.debug = options.debug ?? false;
  }

  /**
   * Fire-and-forget: send a usage event to the TrackYourAPI backend.
   * Never throws — errors are suppressed to avoid breaking your app.
   */
  track(payload: TrackPayload): void {
    const url = `${this.endpoint}/functions/v1/track`;

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      if (this.debug) {
        console.warn("[TrackYourAPI] Failed to track usage:", err?.message ?? err);
      }
    });
  }
}
