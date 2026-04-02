"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";

interface Props {
  value: string;
  onChange: (val: string) => void;
  height?: number;
  placeholder?: string;
}

export default function TinyEditor({ value, onChange, height = 350, placeholder }: Props) {
  const { mode } = useTheme();

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
      value={value}
      onEditorChange={(val: string) => onChange(val)}
      init={{
        height,
        menubar: false,
        placeholder,
        plugins: [
          "advlist", "autolink", "lists", "link", "image", "charmap",
          "preview", "anchor", "searchreplace", "visualblocks", "codesample",
          "fullscreen", "insertdatetime", "media", "table",
        ],
        toolbar:
          "undo redo | codesample | bold italic forecolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist | removeformat",
        content_style: "body { font-family: Inter, sans-serif; font-size: 15px; }",
        skin: mode === "dark" ? "oxide-dark" : "oxide",
        content_css: mode === "dark" ? "dark" : "light",
      }}
    />
  );
}
