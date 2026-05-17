import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: authData, isLoading: isCheckingAuth, error } = useQuery({
    queryKey: ["adminMe"],
    queryFn: () => authService.me().catch(() => ({ authenticated: false, user: null })),
    retry: false
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["adminMe"], { authenticated: true, user: data.user });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(["adminMe"], { authenticated: false, user: null });
      queryClient.clear();
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["adminMe"], { authenticated: true, user: data.user });
    }
  });

  return {
    isAuthenticated: !!authData?.authenticated,
    adminUser: authData?.user || null,
    isCheckingAuth,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending
  };
}
