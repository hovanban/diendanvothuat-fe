export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export interface FilterProps {
  name: string;
  value: string;
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export interface BadgeParams {
  criteria: { type: keyof typeof import('@/constants').BADGE_CRITERIA; count: number }[];
}
