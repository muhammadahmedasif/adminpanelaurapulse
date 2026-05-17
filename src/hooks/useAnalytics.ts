import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

export function useAnalytics() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: analyticsService.getAnalytics
  });

  return {
    metrics: data?.metrics || {
      totalUsers: 0,
      activeUsers: 0,
      totalSessions: 0,
      emergencyEventsCount: 0,
      failedLogins: 0,
      systemUsageTrend: []
    },
    isLoading,
    error,
    refetch
  };
}
