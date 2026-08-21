import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useItems(categoryId: number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["items", categoryId],
    queryFn: () => api.items.getByCategory(categoryId),
  });

  const createMutation = useMutation({
    mutationFn: (title: string) => api.items.create(title, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", categoryId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.items.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", categoryId] });
    },
  });

  return {
    items: query.data ?? [],
    loading: query.isLoading,
    addItem: createMutation.mutate,
    removeItem: deleteMutation.mutate,
  };
}
