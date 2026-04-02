import React from "react";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  href?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal" | "indigo" | "pink";
  badge?: string;
}

const colorMap = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/40",   icon: "bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400",   border: "border-l-blue-500",   badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300" },
  green:  { bg: "bg-green-50 dark:bg-green-950/40",  icon: "bg-green-100 dark:bg-green-900/60 text-green-600 dark:text-green-400", border: "border-l-green-500",  badge: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/40",icon: "bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400",border: "border-l-purple-500",badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/40",icon: "bg-orange-100 dark:bg-orange-900/60 text-orange-600 dark:text-orange-400",border: "border-l-orange-500",badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300" },
  red:    { bg: "bg-red-50 dark:bg-red-950/40",      icon: "bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400",       border: "border-l-red-500",    badge: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/40",    icon: "bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-400",   border: "border-l-teal-500",   badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/40",icon: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400",border: "border-l-indigo-500",badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300" },
  pink:   { bg: "bg-pink-50 dark:bg-pink-950/40",    icon: "bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-400",   border: "border-l-pink-500",   badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300" },
};

const StatsCard = ({ title, value, icon, description, href, color = "blue", badge }: StatsCardProps) => {
  const c = colorMap[color];
  const inner = (
    <div className={`group relative overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 border-l-4 ${c.border} ${c.bg} p-5 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-dark400_light700">{title}</p>
          <p className="mt-2 text-3xl font-bold text-dark100_light900 leading-none">{value}</p>
          {description && <p className="mt-2 text-xs text-dark400_light700 truncate">{description}</p>}
          {badge && <span className={`mt-3 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c.badge}`}>{badge}</span>}
        </div>
        <div className={`shrink-0 rounded-lg p-2.5 text-xl ${c.icon}`}>{icon}</div>
      </div>
      {href && (
        <div className="mt-3 flex items-center gap-1 text-xs text-dark400_light700 group-hover:text-dark100_light900 transition-colors">
          <span>Xem chi tiết</span>
          <span>→</span>
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
};

export default StatsCard;
