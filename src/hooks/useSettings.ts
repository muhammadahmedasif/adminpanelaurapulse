import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingService } from "@/services/settingService";

export function useSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings
  });

  const updateMutation = useMutation({
    mutationFn: settingService.updateSettings,
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["settings"] });
      const previousData = queryClient.getQueryData(["settings"]);

      queryClient.setQueryData(["settings"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          settings: {
            ...old.settings,
            ...updates
          }
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["settings"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["emergency"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    }
  });

  return {
    settings: data?.settings || null,
    isLoading,
    error,
    refetch,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending
  };
}
