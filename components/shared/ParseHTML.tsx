"use client";

import { useEffect } from "react";
import parse from "html-react-parser";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";

const ParseHTML = ({ data }: { data: string }) => {
  useEffect(() => { Prism.highlightAll(); }, []);
  return <div className="markdown w-full min-w-full text-dark200_light900">{parse(data)}</div>;
};

export default ParseHTML;
