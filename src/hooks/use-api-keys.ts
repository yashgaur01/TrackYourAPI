import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export function useApiKeys() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['apiKeys', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(row => ({
        _id: row.id,
        name: row.name,
        key: row.key,
        provider: row.provider,
        isActive: row.is_active,
        lastUsed: row.last_used_at ? new Date(row.last_used_at).getTime() : undefined,
        createdAt: new Date(row.created_at).getTime()
      }));
    },
    enabled: !!user,
  });

  const generateKey = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!user) throw new Error("No user");
      
      const newKey = `qt_${crypto.randomUUID().replace(/-/g, '')}`;
      
      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name,
          key: newKey,
          provider: 'trackyourapi',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      return newKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys', user?.id] });
    }
  });

  const revokeKey = useMutation({
    mutationFn: async ({ keyId }: { keyId: string }) => {
      if (!user) throw new Error("No user");
      
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys', user?.id] });
    }
  });

  return {
    apiKeys: query.data,
    isLoading: query.isLoading,
    generateKey: generateKey.mutateAsync,
    isGenerating: generateKey.isPending,
    revokeKey: revokeKey.mutateAsync
  };
}
