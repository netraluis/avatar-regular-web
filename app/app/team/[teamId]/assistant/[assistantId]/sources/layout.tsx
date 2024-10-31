"use client";

import Link from "next/link";
import {
  Archive,
  FileText,
  Mail,
  MessageSquare,
  HardDrive,
} from "lucide-react";

import { usePathname } from "next/navigation";

const navItems = [
  { name: "Archives", href: "archives", icon: Archive },
  { name: "Texts", href: "texts", icon: FileText },
  { name: "Emails", href: "emails", icon: Mail },
  { name: "Q&A", href: "qna", icon: MessageSquare },
  { name: "Notion", href: "notion", icon: HardDrive },
  { name: "Google Drive", href: "google-drive", icon: HardDrive },
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
    <div className="flex bg-white">
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
      <div className="flex-1">{children}</div>
    </div>
  );
}
