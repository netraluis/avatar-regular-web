import React from "react";

import { cn } from "@/lib/utils";
import { useTeamAssistantContext } from "./context/teamAssistantContext";

interface FooterTextProps extends React.ComponentProps<"p"> {
  className?: string;
}

export function FooterText({ className, ...props }: FooterTextProps) {
  const { data } = useTeamAssistantContext();
  const footerText = data?.footer[0]?.text;

  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className,
      )}
      {...props}
    >
      {footerText || ""}
    </p>
  );
}
