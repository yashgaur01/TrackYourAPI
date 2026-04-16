import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export interface LogFilters {
  provider?: string;
  model?: string; // used for search in the original UI
  dateFrom?: number;
  dateTo?: number;
  minCost?: number;
  maxCost?: number;
  minLatency?: number;
  maxLatency?: number;
}

export function useUsageLogs(filters: LogFilters) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['usageLogs', user?.id, filters],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      let query = supabase
        .from('usage_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(200);

      if (filters.provider && filters.provider !== "all") {
        query = query.eq('provider', filters.provider);
      }
      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters.dateFrom) {
        query = query.gte('timestamp', new Date(filters.dateFrom).toISOString());
      }
      if (filters.dateTo) {
        query = query.lte('timestamp', new Date(filters.dateTo).toISOString());
      }
      if (filters.minCost !== undefined) {
        query = query.gte('cost_in_cents', filters.minCost * 100);
      }
      if (filters.maxCost !== undefined) {
        query = query.lte('cost_in_cents', filters.maxCost * 100);
      }
      if (filters.minLatency !== undefined) {
        query = query.gte('latency_ms', filters.minLatency);
      }
      if (filters.maxLatency !== undefined) {
        query = query.lte('latency_ms', filters.maxLatency);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Map Supabase rows to the frontend structure
      return data.map(row => ({
        _id: row.id,
        timestamp: new Date(row.timestamp).getTime(),
        provider: row.provider,
        model: row.model,
        tokens: row.total_tokens,
        cost: (row.cost_in_cents / 100),
        latency: row.latency_ms
      }));
    },
    enabled: !!user,
  });
}
