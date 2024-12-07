"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export const assistantSettingsNav = [
  { name: "Playground", href: "playground", id: "playground" },
  { name: "Activity", href: "activity", id: "activity" },
  { name: "Sources", href: "sources", id: "sources" },
  { name: "Connect", href: "connect", id: "connect" },
  { name: "Settings", href: "settings", id: "settings" },
];

function Header() {
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[4];
  const absolutePath = pathname.split("/").slice(1, 5).join("/");

  return (
    <nav className="flex space-x-4 border-b py-0 px-4">
      {assistantSettingsNav.map((item) => (
        <Link
          key={item.name}
          href={`/${absolutePath}/${item.href}`}
          className={`pb-2 px-4 text-sm font-medium transition-colors hover:text-primary ${
            comparatePathName === item.href
              ? "text-primary border-primary border-b border-b-2 p-0"
              : "text-muted-foreground"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-4 pt-4 grow flex flex-col overflow-auto w-full max-w-6xl">
      <Header />
      <div className="grow flex flex-col overflow-auto items-start pt-4 w-full h-full">
        {children}
      </div>
    </div>
  );
}
