import { useInfiniteQuery } from "@tanstack/react-query";

interface Item {
  id: number;
  title: string;
  category: string;
  likes: number;
  image: string;
  description: string;
}

interface ApiResponse {
  items: Item[];
  hasMore: boolean;
}

export function useInfiniteItems() {
  return useInfiniteQuery<ApiResponse>({
    queryKey: ["items"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/items?page=${pageParam}`);
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1, // ✅ thêm dòng này để fix lỗi
  });
}
