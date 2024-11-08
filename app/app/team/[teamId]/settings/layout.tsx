"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TeamSettingsProvider,
  useTeamSettingsContext,
} from "@/components/context/teamSettingsContext";

const navItems = [
  { name: "General", href: "general", icon: Archive },
  { name: "Interface", href: "interface", icon: Archive },
  { name: "Members", href: "members", icon: Archive },
  { name: "Plans", href: "plans", icon: Archive },
  { name: "Billings", href: "billings", icon: Archive },
];

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[3];
  const absolutePath = pathname.split("/").slice(1, 4).join("/");

  const { data } = useTeamSettingsContext();

  return (
    <div className="flex-1 p-8">
      <div className=" rounded-lg p-6">
        <div className="flex justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Settings</h1>
            </div>
            <p className="text-sm text-gray-500 mb-4">Maneja tus ajustes</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            {/* <Input
            type="text"
            placeholder="Search files..."
            className="max-w-sm"
          /> */}
            <Button onClick={() => console.log("click", { data })}>
              + Update profile
            </Button>
          </div>
        </div>
        <div className="flex bg-white">
          <div className="w-64 p-4 ">
            <nav>
              {navItems.map((item, index) => (
                <Link
                  onClick={() => console.log("click Link", { data })}
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
      </div>
    </div>
  );
}

export default function ProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TeamSettingsProvider>
      <Layout>{children}</Layout>
    </TeamSettingsProvider>
  );
}
