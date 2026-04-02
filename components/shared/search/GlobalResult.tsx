"use client";

import GlobalFilters from "@/components/shared/search/GlobalFilters";
import { searchApi } from "@/lib/api-client";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const GlobalResult = () => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);

      try {
        const response = await searchApi.global(global!, type || undefined) as any;
        setResult(response?.results || response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
      case "answer":
        return `/question/${Array.isArray(id) ? id[0] : id}`;
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tags/${id}`;
      case "club":
        return `/clb/${id}`;
      case "martialart":
        return `/hoc-vo/${id}`;
      default:
        return "/";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "question":
      case "answer":
        return "/assets/icons/message.svg";
      case "user":
        return "/assets/icons/avatar.svg";
      case "tag":
        return "/assets/icons/tag.svg";
      case "club":
        return "/assets/icons/link.svg";
      case "martialart":
        return "/assets/icons/star-filled.svg";
      default:
        return "/assets/icons/tag.svg";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "question": return "Câu hỏi";
      case "answer": return "Câu trả lời";
      case "user": return "Người dùng";
      case "tag": return "Thẻ";
      case "club": return "CLB";
      case "martialart": return "Môn võ";
      default: return type;
    }
  };

  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-lg dark:bg-dark-400">
      <GlobalFilters />
      <div className="my-5 h-px bg-light-700/50 dark:bg-dark-500/50" />
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          {global ? `Kết quả cho "${global}"` : "Top Match"}
          {result.length > 0 && (
            <span className="text-primary-500 ml-2">({result.length})</span>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="flex-center flex-col px-5 py-4">
          <ReloadIcon className="my-2 size-10 animate-spin text-primary-500" />
          <p className="body-regular text-dark200_light800">Đang tìm kiếm...</p>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-1">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  key={item.type + item.id + index}
                  href={renderLink(item.type, item.id)}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 transition-colors hover:bg-light-700/50 hover:dark:bg-dark-500/50"
                >
                  <Image
                    src={getIcon(item.type)}
                    alt={item.type}
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold">
                      {getTypeLabel(item.type)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5 py-4">
                <p className="text-dark200_light800 body-regular">
                  Không tìm thấy kết quả nào
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalResult;
