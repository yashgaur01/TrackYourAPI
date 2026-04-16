import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export function useSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['settings', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found

      if (!data) {
        // Return defaults
        return {
          monthlyBudget: 1000,
          latencyAlertThreshold: 2000,
          costAlertThreshold: 0.1,
          emailNotifications: true,
          theme: 'system'
        };
      }

      return {
        monthlyBudget: data.monthly_budget,
        latencyAlertThreshold: data.latency_threshold_ms,
        costAlertThreshold: 0.1, // assuming hardcoded per item or missing from schema
        emailNotifications: data.email_notifications,
        theme: data.theme
      };
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (settingsData: {
      monthlyBudget?: number;
      costAlertThreshold?: number;
      latencyAlertThreshold?: number;
    }) => {
      if (!user) throw new Error("No user");
      
      const updateData = {
        user_id: user.id,
        monthly_budget: settingsData.monthlyBudget,
        latency_threshold_ms: settingsData.latencyAlertThreshold,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('user_settings')
        .upsert(updateData);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', user?.id] });
    }
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    updateSettings: updateSettings.mutateAsync
  };
}
