import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownDisplay({ markdownText }: { markdownText: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownText}</ReactMarkdown>
  );
}

export default MarkdownDisplay;
