import { FilterProps } from "@/types";

export const AnswerFilters = [
  { name: "Bình chọn cao nhất", value: "highestUpvotes" },
  { name: "Bình chọn thấp nhất", value: "lowestUpvotes" },
  { name: "Mới nhất", value: "recent" },
  { name: "Cũ nhất", value: "old" },
];

export const UserFilters = [
  { name: "Người dùng mới", value: "new_users" },
  { name: "Người dùng cũ", value: "old_users" },
  { name: "Người đóng góp hàng đầu", value: "top_contributors" },
];

export const QuestionFilters = [
  { name: "Mới nhất", value: "most_recent" },
  { name: "Cũ nhất", value: "oldest" },
  { name: "Bình chọn nhiều nhất", value: "most_voted" },
  { name: "Xem nhiều nhất", value: "most_viewed" },
  { name: "Nhiều câu trả lời nhất", value: "most_answered" },
];

export const TagFilters = [
  { name: "Phổ biến", value: "popular" },
  { name: "Mới", value: "recent" },
  { name: "Tên", value: "name" },
  { name: "Cũ", value: "old" },
];

export const HomePageFilters = [
  { name: "Mới nhất", value: "newest" },
  { name: "Đề xuất", value: "recommended" },
  { name: "Thường gặp", value: "frequent" },
  { name: "Chưa có câu trả lời", value: "unanswered" },
];

export const GlobalSearchFilters = [
  { name: "Câu hỏi", value: "question" },
  { name: "Câu trả lời", value: "answer" },
  { name: "CLB", value: "club" },
  { name: "Môn võ", value: "martialart" },
  { name: "Người dùng", value: "user" },
  { name: "Thẻ", value: "tag" },
];

export const JobPageFilters: FilterProps[] = [
  { name: "Toàn thời gian", value: "fulltime" },
  { name: "Bán thời gian", value: "parttime" },
  { name: "Hợp đồng", value: "contractor" },
  { name: "Thực tập", value: "intern" },
];
