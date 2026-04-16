import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export function useDashboardMetrics() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      const { data: logs, error } = await supabase
        .from('usage_logs')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const stats = {
        totalCost: 0,
        totalTokens: 0,
        totalRequests: logs?.length || 0,
        avgLatency: 0,
        costThisMonth: 0,
        tokensThisMonth: 0,
        requestsThisMonth: logs?.length || 0,
      };

      if (!logs || logs.length === 0) {
        return {
          stats,
          dailyCosts: [],
          providerBreakdown: [],
          dailyRequests: [],
          recentActivity: [],
          insights: []
        };
      }

      let totalCost = 0;
      let totalTokens = 0;
      let totalLatency = 0;

      const dailyCostsMap = new Map<string, number>();
      const providerMap = new Map<string, { cost: number; tokens: number; requests: number }>();
      const dailyRequestsMap = new Map<string, number>();

      logs.forEach((log) => {
        totalCost += (log.cost_in_cents / 100);
        totalTokens += log.total_tokens;
        totalLatency += log.latency_ms;

        const dateStr = log.timestamp.split('T')[0];
        dailyCostsMap.set(dateStr, (dailyCostsMap.get(dateStr) || 0) + (log.cost_in_cents / 100));
        dailyRequestsMap.set(dateStr, (dailyRequestsMap.get(dateStr) || 0) + 1);

        const pd = providerMap.get(log.provider) || { cost: 0, tokens: 0, requests: 0 };
        providerMap.set(log.provider, {
          cost: pd.cost + (log.cost_in_cents / 100),
          tokens: pd.tokens + log.total_tokens,
          requests: pd.requests + 1,
        });
      });

      stats.totalCost = totalCost;
      stats.totalTokens = totalTokens;
      stats.avgLatency = totalLatency / logs.length;
      stats.costThisMonth = totalCost; // simplifying for last 30 days
      stats.tokensThisMonth = totalTokens;

      const dailyCosts = Array.from(dailyCostsMap.entries())
        .map(([date, cost]) => ({ date, cost }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const dailyRequests = Array.from(dailyRequestsMap.entries())
        .map(([date, requests]) => ({ date, requests }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const providerBreakdown = Array.from(providerMap.entries())
        .map(([provider, data]) => ({
          provider,
          cost: data.cost,
          tokens: data.tokens,
          requests: data.requests
        }));

      const recentActivity = logs.slice(0, 5).map((log, i) => ({
        _id: log.id || `act-${i}`,
        timestamp: new Date(log.timestamp).getTime(),
        model: log.model,
        provider: log.provider,
        tokens: log.total_tokens,
        cost: (log.cost_in_cents / 100),
        latency: log.latency_ms
      }));

      const insights = [
        {
          _id: "i1",
          _creationTime: Date.now(),
          title: "Optimize Token Usage",
          description: `You used ${logs[0]?.provider || 'AI'} extensively today. Consider implementing caching.`,
          type: "optimization",
          severity: "info",
          message: `You used ${logs[0]?.provider || 'AI'} extensively today. Consider implementing caching.`,
          actionLabel: "View Docs",
          actionUrl: "/docs"
        }
      ];

      return {
        user,
        stats,
        dailyCosts,
        providerBreakdown,
        dailyRequests,
        recentActivity,
        insights
      };
    },
    enabled: !!user,
  });
}
