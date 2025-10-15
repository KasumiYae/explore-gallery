import { useQuery } from "@tanstack/react-query";

export interface Item {
  id: number;
  title: string;
  category: string;
  likes: number;
  image: string;
  description: string;
}

export function useItems() {
  return useQuery<Item[]>({
    queryKey: ["items"], // tên để cache
    queryFn: async () => {
      const res = await fetch("/api/items"); // gọi API mock của bạn
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });
}
