import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionService, GetSessionsParams } from "@/services/sessionService";

export function useSessions(params: GetSessionsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sessions", params],
    queryFn: () => sessionService.getSessions(params),
    placeholderData: (prev) => prev
  });

  const flagMutation = useMutation({
    mutationFn: sessionService.flagSession,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["sessions", params] });
      const previousData = queryClient.getQueryData(["sessions", params]);

      queryClient.setQueryData(["sessions", params], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sessions: old.sessions.map((s: any) => (s.id === id ? { ...s, flagged: !s.flagged } : s))
        };
      });

      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["sessions", params], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    }
  });

  return {
    sessions: data?.sessions || [],
    pagination: data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading,
    error,
    refetch,
    flagSession: flagMutation.mutateAsync,
    isFlagging: flagMutation.isPending
  };
}
