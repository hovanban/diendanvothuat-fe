"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  martialArtId?: string;
  maxTags?: number;
  disabled?: boolean;
}

export default function TagSelector({ selectedTags, onTagsChange, martialArtId, maxTags = 3, disabled = false }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/tags?martialArtId=${martialArtId || ""}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => { setAvailableTags(data.tags || data || []); })
      .catch(() => setAvailableTags([]))
      .finally(() => setIsLoading(false));
  }, [martialArtId]);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableTags.filter(
        (tag) => tag.name.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(tag.name)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [inputValue, availableTags, selectedTags]);

  const handleAddTag = (tagName: string) => {
    if (selectedTags.length >= maxTags) { alert(`Chỉ có thể thêm tối đa ${maxTags} tags`); return; }
    if (!selectedTags.includes(tagName)) { onTagsChange([...selectedTags, tagName]); setInputValue(""); setSuggestions([]); }
  };

  const handleRemoveTag = (tagName: string) => onTagsChange(selectedTags.filter((t) => t !== tagName));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = inputValue.trim();
      if (val) { if (val.length > 15) { alert("Tag phải ngắn hơn 15 ký tự"); return; } handleAddTag(val); }
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          disabled={disabled}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Đang tải tags..." : martialArtId && martialArtId !== "none" ? "Tìm hoặc thêm tag..." : "Thêm tags..."}
          className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[40px] border"
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-md border border-light-400 bg-light-900 shadow-lg dark:border-dark-400 dark:bg-dark-300">
            {suggestions.map((tag) => (
              <button key={tag._id} type="button" onClick={() => handleAddTag(tag.name)} className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-light-800 dark:hover:bg-dark-400">
                <span className="text-dark100_light900">{tag.name}</span>
                {tag.martialArt && <span className="text-xs text-light-400">({tag.martialArt.name})</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize" onClick={() => !disabled && handleRemoveTag(tag)}>
              {tag}
              {!disabled && <Image src="/assets/icons/close.svg" alt="Remove" width={12} height={12} className="cursor-pointer object-contain invert-0 dark:invert" />}
            </Badge>
          ))}
        </div>
      )}

      <p className="body-regular text-light-500">
        {martialArtId && martialArtId !== "none"
          ? `Hiển thị tags cho môn võ đã chọn. Đã chọn: ${selectedTags.length}/${maxTags}`
          : `Nhập tên tag và nhấn Enter. Đã chọn: ${selectedTags.length}/${maxTags}`}
      </p>
    </div>
  );
}
