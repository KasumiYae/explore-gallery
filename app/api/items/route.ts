import { NextResponse } from "next/server";

// Tạo danh sách 30 ảnh mock
const allItems = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Image ${i + 1}`,
  category: i % 2 === 0 ? "Nature" : "Travel",
  likes: Math.floor(Math.random() * 100),
  image: `https://picsum.photos/400?random=${i + 1}`,
  description: "Random demo image",
}));

// ✅ API GET (phân trang)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = 6;
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = allItems.slice(start, end);

  return NextResponse.json({
    items,
    hasMore: end < allItems.length,
  });
}

// ✅ API POST (like)
export async function POST(req: Request) {
  const { id } = await req.json();
  const item = allItems.find((it) => it.id === id);
  if (item) {
    item.likes += 1;
    return NextResponse.json(item);
  }
  return NextResponse.json({ error: "Item not found" }, { status: 404 });
}
