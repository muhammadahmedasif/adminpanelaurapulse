import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";
import type { AnalyticsMetrics, AnalyticsTrends } from "@/types";

export function useAnalytics() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: analyticsService.getAnalytics,
  });

  const defaultMetrics: AnalyticsMetrics = {
    totalUsers: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    totalSessions: 0,
    activeSessions: 0,
    avgSessionMinutes: 0,
    totalEscalations: 0,
    escalationsThisWeek: 0,
    totalActivities: 0,
    totalMoodEntries: 0,
    avgMoodScore: 0,
  };

  const defaultTrends: AnalyticsTrends = {
    usersGrowth: [],
    sessionsPerDay: [],
    emergencyTrends: [],
  };

  return {
    metrics: data?.metrics || defaultMetrics,
    trends: data?.trends || defaultTrends,
    isLoading,
    error,
    refetch,
  };
}
