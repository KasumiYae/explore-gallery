"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteItems } from "@/hooks/useInfiniteItems";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikeItem } from "@/hooks/useLikeItem";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

export default function Home() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteItems();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const observerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { mutate } = useLikeItem();

  // ✅ Gộp dữ liệu từ nhiều trang
  const items = data?.pages.flatMap((page) => page.items) ?? [];

  // ✅ Lấy danh sách category duy nhất
  const categories =
    items.reduce<string[]>((acc, item) => {
      if (!acc.includes(item.category)) acc.push(item.category);
      return acc;
    }, []) || [];

  // ✅ Lọc theo search + category
  const filtered = items
    .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
    .filter((item) => (category === "all" ? true : item.category === category));

  
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  
  if (isLoading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-60 w-full rounded-lg" />
        ))}
      </div>
    );

 
  if (isError)
    return <p className="text-center mt-10">Failed to load data 😢</p>;


  return (
    <div>
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between p-4">
        <SearchBar onSearch={setQuery} />
        <CategoryFilter categories={categories} onSelect={setCategory} />
      </div>

      {/* */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card
              className="hover:shadow-xl transition cursor-pointer"
              onClick={() => router.push(`/item/${item.id}`)} 
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="rounded-lg w-full h-60 object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <LikeButton id={item.id} likes={item.likes} mutate={mutate} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/*  */}
        <div ref={observerRef} className="h-10" />

        {isFetchingNextPage && (
          <div className="col-span-full text-center text-gray-500">
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
}


function LikeButton({
  id,
  likes,
  mutate,
}: {
  id: number;
  likes: number;
  mutate: any;
}) {
  return (
    <motion.div
      whileTap={{ scale: 1.3 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          mutate(id);
        }}
        className="flex items-center gap-1 text-pink-600 hover:bg-pink-100"
      >
        <Heart size={16} /> {likes}
      </Button>
    </motion.div>
  );
}
