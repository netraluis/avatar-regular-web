"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Playground", href: "playground" },
  { name: "Activity", href: "activity" },
  { name: "Sources", href: "sources" },
  { name: "Connect", href: "connect" },
  { name: "Settings", href: "settings" },
];

function Header() {
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[4];
  const absolutePath = pathname.split("/").slice(1, 5).join("/");

  return (
    <nav className="flex space-x-4 border-b pb-2 mb-4">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={`/${absolutePath}/${item.href}`}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            comparatePathName === item.href
              ? "text-primary border-b-2 border-primary"
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
    <div className="container mx-auto p-4 grow flex flex-col overflow-hidden">
      <Header />
      {children}
    </div>
  );
}
