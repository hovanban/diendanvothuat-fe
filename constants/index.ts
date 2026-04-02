export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks = [
  { imgURL: "/assets/icons/home.svg", route: "/", label: "Trang Chủ" },
  { imgURL: "/assets/icons/suitcase.svg", route: "/clb", label: "Câu Lạc Bộ" },
  { imgURL: "/assets/icons/users.svg", route: "/community", label: "Thành Viên" },
  { imgURL: "/assets/icons/star.svg", route: "/collection", label: "Yêu Thích" },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: { BRONZE: 10, SILVER: 50, GOLD: 100 },
  ANSWER_COUNT: { BRONZE: 10, SILVER: 50, GOLD: 100 },
  QUESTION_UPVOTES: { BRONZE: 10, SILVER: 50, GOLD: 100 },
  ANSWER_UPVOTES: { BRONZE: 10, SILVER: 50, GOLD: 100 },
  TOTAL_VIEWS: { BRONZE: 1000, SILVER: 10000, GOLD: 100000 },
};
