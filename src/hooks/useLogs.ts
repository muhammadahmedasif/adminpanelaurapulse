import { useQuery } from "@tanstack/react-query";
import { logService, GetLogsParams } from "@/services/logService";

export function useLogs(params: GetLogsParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["logs", params],
    queryFn: () => logService.getLogs(params),
    placeholderData: (prev) => prev
  });

  return {
    logs: data?.logs || [],
    pagination: data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading,
    error,
    refetch
  };
}
