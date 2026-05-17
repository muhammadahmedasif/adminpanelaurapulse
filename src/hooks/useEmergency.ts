import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emergencyService } from "@/services/emergencyService";

export function useEmergency() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["emergency"],
    queryFn: emergencyService.getEmergencyData
  });

  const toggleMutation = useMutation({
    mutationFn: emergencyService.toggleGlobalEmergency,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["emergency"] });
      const previousData = queryClient.getQueryData(["emergency"]);

      queryClient.setQueryData(["emergency"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          twilioNumberStatus: {
            ...old.twilioNumberStatus,
            status: old.twilioNumberStatus.status.includes("Active") ? "Disabled (Global Kill-Switch ON)" : "Active & Secure"
          }
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["emergency"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency"] });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    }
  });

  return {
    events: data?.events || [],
    regions: data?.regions || [],
    twilioNumberStatus: data?.twilioNumberStatus || null,
    callLogs: data?.callLogs || [],
    isLoading,
    error,
    refetch,
    toggleGlobalEmergency: toggleMutation.mutateAsync,
    isToggling: toggleMutation.isPending
  };
}
