"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

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
    // <div className="grow flex flex-col overflow-auto w-full">
    <>
      {/* <Header /> */}
      <div className="grow flex flex-col overflow-auto items-start w-full h-full">
        {children}
      </div>
    </>
  );
}
