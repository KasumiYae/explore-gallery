import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLikeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to like item");
      return res.json();
    },
    // ✅ Optimistic update
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });
      const previousData = queryClient.getQueryData<any>(["items"]);

      queryClient.setQueryData(["items"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: any) =>
              item.id === id ? { ...item, likes: item.likes + 1 } : item
            ),
          })),
        };
      });

      return { previousData };
    },
    // Nếu lỗi → rollback
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["items"], context.previousData);
      }
    },
    // Khi xong → refetch để đồng bộ
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
