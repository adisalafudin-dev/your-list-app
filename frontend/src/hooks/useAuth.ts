import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAuth() {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: api.auth.me,
    retry: false,
  });

  const signIn = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const register = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.register(email, password),
  });

  const signOut = useMutation({
    mutationFn: api.auth.signOut,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  return {
    user: meQuery.data,
    isAuthenticated: meQuery.isSuccess,
    isLoading: meQuery.isLoading,
    signIn,
    register,
    signOut,
  };
}
