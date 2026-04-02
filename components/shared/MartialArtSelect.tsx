"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MartialArt {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export default function MartialArtSelect({ value, onChange }: Props) {
  const [martialArts, setMartialArts] = useState<MartialArt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/martial-arts`)
      .then((res) => res.json())
      .then((data) => {
        setMartialArts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-dark400_light700">Đang tải...</p>;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="no-focus background-light900_dark300 light-border-2 text-dark300_light700 min-h-[40px] border">
        <SelectValue placeholder="Chọn môn võ (không bắt buộc)" />
      </SelectTrigger>
      <SelectContent className="background-light900_dark300">
        <SelectItem value="none" className="text-dark300_light700">Không chọn</SelectItem>
        {martialArts.map((ma) => (
          <SelectItem key={ma._id} value={ma._id} className="text-dark300_light700">{ma.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
