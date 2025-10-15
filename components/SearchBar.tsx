"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState(value);

  
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="p-4">
      <Input
        placeholder="Search by title..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
