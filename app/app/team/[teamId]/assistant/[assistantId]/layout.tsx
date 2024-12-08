"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { assistantSettingsNav } from "@/lib/helper/navbar";

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
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[4];
  if (comparatePathName === "instructions" || comparatePathName === "files") {
    return <>{children}</>;
  }
  return (
    <div className="pt-4 grow flex flex-col overflow-auto w-full">
      <Header />
      <div className="grow flex flex-col overflow-auto items-start pt-4 w-full h-full grow">
        {children}
      </div>
    </div>
  );
}
