import React from 'react';

import { cn } from '@/lib/utils';

interface FooterTextProps extends React.ComponentProps<'p'> {
  className?: string;
}

export function FooterText({ className, ...props }: FooterTextProps) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className,
      )}
      {...props}
    >
      Totes les respostes en aquesta conversa estan generades mitjançant una
      Intel·ligència Artificial (AI)
    </p>
  );
}
