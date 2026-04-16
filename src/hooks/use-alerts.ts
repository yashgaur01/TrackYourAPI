import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export function useAlerts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['alerts', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(row => ({
        _id: row.id,
        severity: row.severity,
        message: row.message,
        isRead: row.is_read,
        createdAt: new Date(row.created_at).getTime()
      }));
    },
    enabled: !!user,
  });

  const markAsRead = useMutation({
    mutationFn: async ({ alertId }: { alertId: string }) => {
      if (!user) throw new Error("No user");
      
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', user?.id] });
    }
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("No user");
      
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', user?.id] });
    }
  });

  return {
    alerts: query.data,
    isLoading: query.isLoading,
    markAsRead: markAsRead.mutateAsync,
    markAllAsRead: markAllAsRead.mutateAsync
  };
}
