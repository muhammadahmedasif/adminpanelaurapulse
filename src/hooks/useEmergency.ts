import { useQuery } from "@tanstack/react-query";
import { emergencyService } from "@/services/emergencyService";

export function useEmergency() {
  const statusQuery = useQuery({
    queryKey: ["emergency", "status"],
    queryFn: emergencyService.getEmergencyStatus,
  });

  const logsQuery = useQuery({
    queryKey: ["emergency", "logs"],
    queryFn: () => emergencyService.getEscalationLogs({ page: 1, limit: 20 }),
  });

  return {
    status: statusQuery.data || null,
    logs: logsQuery.data?.logs || [],
    logsPagination: logsQuery.data?.pagination || null,
    isLoading: statusQuery.isLoading || logsQuery.isLoading,
    error: statusQuery.error || logsQuery.error,
    refetch: () => {
      statusQuery.refetch();
      logsQuery.refetch();
    },
  };
}
