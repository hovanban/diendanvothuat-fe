"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/context/ThemeProvider";
import { questionsApi } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MartialArtSelect from "../shared/MartialArtSelect";
import TagSelector from "../shared/TagSelector";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

interface Props {
  type?: string;
  mongoUserId: string;
  questionDetails?: string;
  preselectedMartialArt?: string;
}

const Question = ({ type, mongoUserId, questionDetails, preselectedMartialArt }: Props) => {
  const { mode } = useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const editorRef = useRef<any>(null);

  const parsedDetails = questionDetails ? JSON.parse(questionDetails) : null;

  const [title, setTitle] = useState(parsedDetails?.title || "");
  const [content, setContent] = useState(parsedDetails?.content || "");
  const [selectedMartialArt, setSelectedMartialArt] = useState<string>(
    parsedDetails?.martialArt?._id || parsedDetails?.martialArt || preselectedMartialArt || ""
  );
  const [tags, setTags] = useState<string[]>(parsedDetails?.tags?.map((t: any) => t.name) || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Tiêu đề không được để trống";
    else if (title.length < 5) errs.title = "Tiêu đề phải có ít nhất 5 ký tự";
    if (!content.trim()) errs.content = "Nội dung không được để trống";
    else if (content.replace(/<[^>]*>/g, "").length < 20) errs.content = "Nội dung tối thiểu 20 ký tự";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!token) return;

    setIsSubmitting(true);
    try {
      if (type === "Edit" && parsedDetails?._id) {
        await questionsApi.update(parsedDetails._id, {
          title,
          content,
          martialArt: selectedMartialArt && selectedMartialArt !== "none" ? selectedMartialArt : undefined,
        }, token);
        router.push(`/question/${parsedDetails.slug}`);
      } else {
        await questionsApi.create({ title, content, tags, martialArt: selectedMartialArt && selectedMartialArt !== "none" ? selectedMartialArt : undefined }, token);
        router.push("/");
      }
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra khi đăng bài");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="paragraph-semibold text-dark400_light800">
          Tiêu đề <span className="text-primary-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[40px] border"
          placeholder="Tiêu đề câu hỏi..."
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <label className="paragraph-semibold text-dark400_light800">
          Nội dung <span className="text-primary-500">*</span>
        </label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
          onInit={(_evt: any, editor: any) => { editorRef.current = editor; }}
          onEditorChange={(val: string) => setContent(val)}
          initialValue={parsedDetails?.content || ""}
          init={{
            height: 350,
            menubar: false,
            plugins: ["advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor", "searchreplace", "visualblocks", "codesample", "fullscreen", "insertdatetime", "media", "table"],
            toolbar: "undo redo | codesample | bold italic forecolor | alignleft aligncenter | alignright alignjustify | bullist numlist",
            content_style: "body { font-family:Inter; font-size:16px }",
            skin: mode === "dark" ? "oxide-dark" : "oxide",
            content_css: mode === "dark" ? "dark" : "light",
          }}
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
        <p className="body-regular text-light-500">Nội dung tối thiểu 20 ký tự.</p>
      </div>

      {/* Martial Art */}
      <div className="flex flex-col gap-2">
        <label className="paragraph-semibold text-dark400_light800">Môn võ (không bắt buộc)</label>
        <MartialArtSelect value={selectedMartialArt} onChange={setSelectedMartialArt} />
      </div>

      {/* Tags */}
      {type !== "Edit" && (
        <div className="flex flex-col gap-2">
          <label className="paragraph-semibold text-dark400_light800">Tags (không bắt buộc)</label>
          <TagSelector selectedTags={tags} onTagsChange={setTags} martialArtId={selectedMartialArt} maxTags={3} />
        </div>
      )}

      <Button type="submit" className="primary-gradient w-fit !text-light-900" disabled={isSubmitting}>
        {isSubmitting ? (type === "Edit" ? "Đang cập nhật..." : "Đang đăng...") : (type === "Edit" ? "Cập nhật" : "Đăng bài")}
      </Button>
    </form>
  );
};

export default Question;
