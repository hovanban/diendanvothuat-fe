"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface MartialArt {
  _id: string;
  name: string;
  slug: string;
}

export default function MartialArtFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const [martialArts, setMartialArts] = useState<MartialArt[]>([]);
  const [loading, setLoading] = useState(true);

  const currentSlug = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  const currentMartialArt = martialArts.find((ma) => ma.slug === currentSlug);
  const selectedValue = currentMartialArt ? currentMartialArt._id : "all";

  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_URL}/martial-arts`)
      .then((res) => res.json())
      .then((data) => {
        setMartialArts(data.martialArts || data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleMartialArtChange = (value: string) => {
    if (value === "all") {
      router.push("/", { scroll: false });
    } else {
      const selectedMartialArt = martialArts.find((ma) => ma._id === value);
      if (selectedMartialArt) {
        router.push(`/${selectedMartialArt.slug}`, { scroll: false });
      }
    }
  };

  if (loading) {
    return <div className="text-sm text-dark400_light700">Đang tải...</div>;
  }

  return (
    <Select value={selectedValue} onValueChange={handleMartialArtChange}>
      <SelectTrigger className="no-focus background-light900_dark300 light-border-2 text-dark300_light700 min-h-[40px] border w-[170px]">
        <SelectValue placeholder="Chọn môn võ" />
      </SelectTrigger>
      <SelectContent className="background-light900_dark300">
        <SelectItem value="all" className="text-dark300_light700">
          Tất cả môn võ
        </SelectItem>
        {martialArts.map((ma) => (
          <SelectItem key={ma._id} value={ma._id} className="text-dark300_light700">
            {ma.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
