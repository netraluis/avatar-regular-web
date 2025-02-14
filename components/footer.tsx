import React from "react";

import { cn } from "@/lib/utils";
// import Image from "next/image";

interface FooterTextProps extends React.ComponentProps<"p"> {
  className?: string;
  text?: string;
}

export function FooterText({ className, text, ...props }: FooterTextProps) {
  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className,
      )}
      {...props}
    >
        <div className="flex justify-center items-center gap-x-2">
          {/* <Image
            src="/chatbotforSymbol.svg"
            alt={""}
            // fill
            width={5}
            height={5}
            className="w-3 h-3"
            unoptimized
          /> */}
          <span className="text-sm">Powered by Chatbotfor.ai</span>
        </div>
      {text || ""}
    </p>
  );
}
