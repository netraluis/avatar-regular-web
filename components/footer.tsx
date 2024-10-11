import React from "react";

import { cn } from "@/lib/utils";

interface FooterTextProps extends React.ComponentProps<"p"> {
  className?: string;
}

export function FooterText({ className, ...props }: FooterTextProps) {
  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className,
      )}
      {...props}
    >
      {/* Totes les respostes d’aquesta conversa estan generades mitjançant una
      Intel·ligència Artificial (AI) */}
      Genero respostes amb intel·ligència artificial i puc cometre errors. Si
      vols confirmar la informació, pots posar-te en contacte amb els tècnics de
      la Secretaria d&apos;Estat per a les Relacions amb la Unió Europea o bé
      contactar-nos andorraue@govern.ad, +376 875 700 o a través de WhatsApp:
      +376 637 400
    </p>
  );
}
