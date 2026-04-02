import { clsx, type ClassValue } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import parse from 'html-react-parser';

/** Strip HTML tags và decode entities dùng html-react-parser */
export function htmlToText(html: string): string {
  // Strip tags trước, html-react-parser sẽ decode entities trong text nodes
  const stripped = html.replace(/<[^>]*>/g, ' ');
  const parsed = parse(stripped);
  const text = Array.isArray(parsed)
    ? parsed.map((n) => (typeof n === 'string' ? n : '')).join('')
    : typeof parsed === 'string'
    ? parsed
    : '';
  return text.replace(/\s+/g, ' ').trim();
}

export const getTimestamp = (createdAt: Date | string): string => {
  const now = new Date();
  const createdAtDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const diff = now.getTime() - createdAtDate.getTime();

  const units = [
    { unit: "Năm", ms: 365 * 24 * 60 * 60 * 1000 },
    { unit: "Tháng", ms: 30 * 24 * 60 * 60 * 1000 },
    { unit: "Tuần", ms: 7 * 24 * 60 * 60 * 1000 },
    { unit: "Ngày", ms: 24 * 60 * 60 * 1000 },
    { unit: "Giờ", ms: 60 * 60 * 1000 },
    { unit: "Phút", ms: 60 * 1000 },
    { unit: "Giây", ms: 1000 },
  ];

  for (const { unit, ms } of units) {
    const t = Math.floor(diff / ms);
    if (t >= 1) return `${t} ${unit} trước`;
  }
  return "Vừa xong";
};

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export const getFormattedNumber = (number: number): string => {
  if (number < 1000) return number.toString();
  if (number < 1_000_000) return `${(number / 1000).toFixed(1)}K`;
  if (number < 1_000_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
  return `${(number / 1_000_000_000).toFixed(1)}B`;
};

export const getFormattedJoinedDate = (date: Date): string => {
  const month = date.toLocaleString("en", { month: "long" });
  return `Joined ${month} ${date.getFullYear()}`;
};

export const formUrlQuery = ({ params, key, value }: { params: string; key: string; value: string | null }): string => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl }, { skipNull: true });
};

export const removeKeysFromQuery = ({ params, keysToRemove }: { params: string; keysToRemove: string[] }): string => {
  const currentUrl = qs.parse(params);
  keysToRemove.forEach((key) => delete currentUrl[key]);
  return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl }, { skipNull: true });
};
