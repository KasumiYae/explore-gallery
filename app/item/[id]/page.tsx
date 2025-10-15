"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { useLikeItem } from "@/hooks/useLikeItem";

export default function ItemDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { mutate } = useLikeItem();

  // ✅ Gọi API để lấy thông tin chi tiết ảnh
  const { data, isLoading, isError } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const res = await fetch(`/api/items`);
      if (!res.ok) throw new Error("Failed to fetch item");
      const json = await res.json();
      const item = json.items.find((x: any) => x.id === Number(id));
      return item;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError || !data) return <p className="text-center mt-10">Item not found 😢</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft size={16} className="mr-2" /> Back
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{data.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={data.image}
            alt={data.title}
            className="rounded-lg w-full h-[400px] object-cover mb-4"
          />
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">{data.category}</p>
            <Button
              variant="ghost"
              onClick={() => mutate(data.id)}
              className="flex items-center gap-1 text-pink-600 hover:bg-pink-100"
            >
              <Heart size={16} /> {data.likes}
            </Button>
          </div>
          <p className="text-gray-700">{data.description}</p>
        </CardContent>
      </Card>

      {/* ✅ Ảnh cùng loại */}
      <MoreFromCategory currentId={data.id} category={data.category} />
    </div>
  );
}

// ✅ Component hiển thị ảnh cùng category
function MoreFromCategory({ currentId, category }: { currentId: number; category: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["related", category],
    queryFn: async () => {
      const res = await fetch(`/api/items`);
      const json = await res.json();
      return json.items.filter((item: any) => item.category === category && item.id !== currentId);
    },
  });

  if (isLoading) return <p className="mt-6 text-center">Loading related images...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">More from {category}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item: any) => (
          <div key={item.id} className="cursor-pointer">
            <img
              src={item.image}
              alt={item.title}
              className="rounded-lg w-full h-40 object-cover hover:opacity-90"
              onClick={() => (window.location.href = `/item/${item.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
