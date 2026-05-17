import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, GetUsersParams } from "@/services/userService";

export function useUsers(params: GetUsersParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getUsers(params),
    placeholderData: (prev) => prev
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "blocked" }) =>
      userService.updateUser(id, { status }),
    onMutate: async ({ id, status }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["users", params] });
      const previousData = queryClient.getQueryData(["users", params]);

      queryClient.setQueryData(["users", params], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          users: old.users.map((u: any) => (u.id === id ? { ...u, status } : u))
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["users", params], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return {
    users: data?.users || [],
    pagination: data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading,
    error,
    refetch,
    blockUser: (id: string) => updateStatusMutation.mutateAsync({ id, status: "blocked" }),
    unblockUser: (id: string) => updateStatusMutation.mutateAsync({ id, status: "active" }),
    deleteUser: deleteMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
