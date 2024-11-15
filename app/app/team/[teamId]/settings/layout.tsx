"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  TeamSettingsProvider,
  useTeamSettingsContext,
} from "@/components/context/teamSettingsContext";

import {
  Settings,
  Paintbrush,
  User,
  Gem,
  CreditCard,
  Languages,
} from "lucide-react";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { useAppContext } from "@/components/context/appContext";

const navItems = [
  { name: "General", href: "general", icon: Settings },
  { name: "Interface", href: "interface", icon: Paintbrush },
  { name: "Localisations", href: "localisations", icon: Languages },
  { name: "Members", href: "members", icon: User },
  { name: "Plans", href: "plans", icon: Gem },
  { name: "Billings", href: "billings", icon: CreditCard },
];

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[3];
  const absolutePath = pathname.split("/").slice(1, 4).join("/");

  const { state } = useAppContext();
  const { teamId } = useParams();
  const { data } = useTeamSettingsContext();
  const { updateTeam } = useUpdateTeam();

  const saveHandler = async () => {
    if (state.user.user.id) {
      await updateTeam(teamId as string, data, state.user.user.id);
    }
  };
  return (
    <div className="flex flex-col rounded-lg p-6 overflow-hidden h-full">
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
          <Button onClick={saveHandler}>+ Update profile</Button>
        </div>
      </div>
      <div className="flex bg-white overflow-hidden h-full">
        <div className="w-64 p-4 ">
          <nav>
            {navItems.map((item, index) => (
              <Link
                onClick={saveHandler}
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
        <div className="flex-1 overflow-y-auto h-full scrollbar-hidden">
          {children}
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
