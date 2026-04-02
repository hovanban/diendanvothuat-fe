import Link from "next/link";
import { tagsApi, questionsApi } from "@/lib/api-client";

const RightSidebar = async () => {
  let hotQuestions: any[] = [];
  let popularTags: any[] = [];

  try {
    const [questionsRes, tagsRes] = await Promise.all([
      questionsApi.getAll({ filter: "frequent", pageSize: "6" }) as any,
      tagsApi.getTop(8) as any,
    ]);
    hotQuestions = questionsRes?.questions || [];
    popularTags = tagsRes || [];
  } catch {
    // API chưa chạy
  }

  return (
    <aside className="custom-scrollbar sticky top-[120px] h-[calc(100vh-120px)] w-[260px] shrink-0 flex-col overflow-y-auto max-xl:hidden">
      {/* Hot questions */}
      {hotQuestions.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Bài viết nổi bật</p>
          <div className="mt-3 flex flex-col gap-0">
            {hotQuestions.map((question: any, i: number) => (
              <Link
                key={question._id}
                href={`/question/${question.slug}`}
                className="group flex items-start gap-2.5 border-b border-light-700 dark:border-dark-400 py-3 last:border-0"
              >
                <span className="shrink-0 text-[11px] font-bold text-dark400_light700 w-4 pt-0.5 leading-none">{i + 1}</span>
                <p className="text-sm leading-snug text-dark300_light700 group-hover:text-primary-500 transition-colors line-clamp-2">
                  {question.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular tags */}
      {popularTags.length > 0 && (
        <div className="mt-7">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Chủ đề phổ biến</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularTags.map((tag: any) => (
              <Link
                key={tag._id}
                href={`/tags/${tag.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-light-700 dark:border-dark-400 px-3 py-1 text-xs font-medium text-dark400_light700 transition-colors hover:border-primary-500 hover:text-primary-500"
              >
                {tag.name}
                {tag.questionsCount > 0 && (
                  <span className="text-[10px] font-bold text-dark400_light700">{tag.questionsCount}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
