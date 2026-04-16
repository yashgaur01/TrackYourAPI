-- Add tracking_source to usage_logs to distinguish between SDK and Proxy traffic
ALTER TABLE public.usage_logs ADD COLUMN IF NOT EXISTS tracking_source text DEFAULT 'sdk' NOT NULL;

-- Index the new column for faster dashboard filtering
CREATE INDEX IF NOT EXISTS idx_usage_logs_tracking_source ON public.usage_logs(tracking_source);
