import React, { useContext } from "react";

import { cn } from "@/lib/utils";
import { GlobalContext } from "./context/globalContext";

interface FooterTextProps extends React.ComponentProps<"p"> {
  className?: string;
}

export function FooterText({ className, ...props }: FooterTextProps) {
  const { domainData } = useContext(GlobalContext);
  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className,
      )}
      {...props}
    >
      {/* Totes les respostes dd&aposaquesta conversa estan generades mitjançant una
      Intel·ligència Artificial (AI) */}
      {domainData?.footerText ||
        "Totes les respostes d'aquesta conversa estan generades mitjançant una Intel·ligència Artificial (AI)"}
    </p>
  );
}
