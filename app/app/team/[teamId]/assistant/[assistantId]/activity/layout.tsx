"use client";

import Link from "next/link";
import { Inbox, PieChart } from "lucide-react";

import { usePathname } from "next/navigation";

const navItems = [
  { name: "Chat Logs", href: "chat-logs", icon: Inbox },
  { name: "Analytics", href: "analytics", icon: PieChart },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[5];
  const absolutePath = pathname.split("/").slice(1, 6).join("/");

  return (
    <div className="flex bg-white grow overflow-hidden">
      <div className="w-64 p-4">
        <nav>
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={`/${absolutePath}/${item.href}`}
              className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded ${comparatePathName === item.href ? "bg-gray-200" : ""}`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
